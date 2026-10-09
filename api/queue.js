/**
 * Job Queue - Cola de procesamiento con Bull
 * Maneja procesamiento de videos en background de forma robusta
 */

const Queue = require('bull');
const { setJobStatus } = require('./database');
const { getCached, setCached } = require('./cache');

// Crear cola de videos (usa Redis en memoria si no está disponible)
let videoQueue;

try {
  // Intentar conectar a Redis (necesario para Bull en producción)
  videoQueue = new Queue('video-processing', {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined
    }
  });
} catch (error) {
  console.warn('⚠️ Redis no disponible. Usando modo simulado.');
  videoQueue = createMemoryQueue();
}

/**
 * Cola en memoria como fallback si Redis no está disponible
 */
function createMemoryQueue() {
  const memoryQueue = {
    jobs: new Map(),
    add: async (data) => {
      const jobId = Date.now().toString();
      const job = { id: jobId, data, status: 'pending', progress: 0 };
      memoryQueue.jobs.set(jobId, job);
      return job;
    },
    process: async (callback) => {
      console.log('Memory queue processor registered');
      setInterval(async () => {
        for (const [jobId, job] of memoryQueue.jobs) {
          if (job.status === 'pending') {
            job.status = 'processing';
            try {
              await callback(job);
              job.status = 'completed';
            } catch (error) {
              job.status = 'failed';
              job.error = error.message;
            }
          }
        }
      }, 5000);
    }
  };
  return memoryQueue;
}

/**
 * Agregar video a la cola de procesamiento
 * @param {object} jobData - { jobId, filePath, style, title, description }
 * @returns {Promise<object>} Job creado en la cola
 */
async function addVideoToQueue(jobData) {
  try {
    const job = await videoQueue.add(jobData, {
      attempts: 3, // Reintentar 3 veces si falla
      backoff: {
        type: 'exponential',
        delay: 2000 // 2 segundos inicial
      },
      removeOnComplete: true,
      removeOnFail: false,
      timeout: 300000 // 5 minutos timeout
    });

    console.log(`📝 Video agregado a cola: ${jobData.jobId} (Queue ID: ${job.id})`);

    return {
      success: true,
      queueJobId: job.id,
      videoJobId: jobData.jobId,
      position: job.progress || 0
    };
  } catch (error) {
    console.error('Error adding to queue:', error);
    throw error;
  }
}

/**
 * Obtener estado de un job en la cola
 * @param {number|string} queueJobId - ID del job en Bull
 * @returns {Promise<object>} Estado del job
 */
async function getQueueJobStatus(queueJobId) {
  try {
    const job = await videoQueue.getJob(queueJobId);

    if (!job) {
      return null;
    }

    return {
      queueJobId: job.id,
      status: job._status,
      progress: job.progress(),
      attempts: job.attemptsMade,
      maxAttempts: job.opts.attempts,
      data: job.data,
      failedReason: job.failedReason || null
    };
  } catch (error) {
    console.error('Error getting job status:', error);
    return null;
  }
}

/**
 * Obtener tamaño de la cola
 * @returns {Promise<object>} Información de la cola
 */
async function getQueueInfo() {
  try {
    const counts = await videoQueue.getJobCounts();

    return {
      waiting: counts.waiting || 0,
      active: counts.active || 0,
      completed: counts.completed || 0,
      failed: counts.failed || 0,
      delayed: counts.delayed || 0,
      total: (counts.waiting || 0) + (counts.active || 0)
    };
  } catch (error) {
    console.error('Error getting queue info:', error);
    return {
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
      delayed: 0,
      total: 0
    };
  }
}

/**
 * Procesar videos de la cola
 * @param {function} processingFunction - Función que procesa el video
 */
async function processQueue(processingFunction) {
  videoQueue.process(100, async (job) => {
    try {
      console.log(`▶️ Procesando job de cola: ${job.data.jobId}`);

      const jobId = job.data.jobId;
      const cacheConfig = {
        fileName: job.data.fileName,
        style: job.data.style,
        quality: job.data.quality || 'medium'
      };

      // Intentar usar caché
      const cached = getCached(cacheConfig);
      if (cached) {
        console.log(`⚡ Usando resultado en caché para: ${jobId}`);
        setJobStatus(jobId, 'completed', {
          progress: 100,
          message: 'Video procesado desde caché (instantáneo)',
          url: cached.url,
          fromCache: true
        });
        return { success: true, fromCache: true };
      }

      // Actualizar progreso inicial
      setJobStatus(jobId, 'processing', {
        progress: 10,
        message: 'Iniciando procesamiento...'
      });

      // Ejecutar función de procesamiento
      const result = await processingFunction(job.data, (progress, message) => {
        job.progress(progress);
        setJobStatus(jobId, 'processing', {
          progress: progress,
          message: message
        });
      });

      // Guardar en caché
      setCached(cacheConfig, result, 86400); // 24 horas

      // Completar job
      setJobStatus(jobId, 'completed', {
        progress: 100,
        message: result.message || 'Video procesado exitosamente',
        url: result.url
      });

      console.log(`✅ Job completado: ${jobId}`);
      return { success: true, result };

    } catch (error) {
      console.error(`❌ Error procesando job: ${error.message}`);
      setJobStatus(job.data.jobId, 'error', {
        error: error.message
      });
      throw error; // Bull lo reintentará automáticamente
    }
  });

  console.log('🚀 Procesador de cola iniciado');
}

/**
 * Limpiar trabajos completados
 * @returns {Promise<number>} Cantidad de jobs removidos
 */
async function cleanCompletedJobs() {
  try {
    const removed = await videoQueue.clean(86400000, 1000); // Limpiar completados después de 24h
    console.log(`🧹 ${removed} jobs completados removidos`);
    return removed;
  } catch (error) {
    console.error('Error cleaning jobs:', error);
    return 0;
  }
}

/**
 * Obtener estadísticas de la cola
 * @returns {Promise<object>} Stats detalladas
 */
async function getQueueStats() {
  try {
    const info = await getQueueInfo();
    const jobCounts = await videoQueue.getJobCounts();

    return {
      queue: info,
      health: {
        isHealthy: info.failed < info.completed,
        failureRate: info.completed > 0
          ? Math.round((info.failed / (info.completed + info.failed)) * 100)
          : 0
      },
      performance: {
        activeJobs: info.active,
        waitingJobs: info.waiting,
        averageTimePerJob: 'N/A'
      }
    };
  } catch (error) {
    console.error('Error getting queue stats:', error);
    return null;
  }
}

/**
 * Pausar cola
 */
async function pauseQueue() {
  try {
    await videoQueue.pause();
    console.log('⏸️ Cola pausada');
  } catch (error) {
    console.error('Error pausing queue:', error);
  }
}

/**
 * Reanudar cola
 */
async function resumeQueue() {
  try {
    await videoQueue.resume();
    console.log('▶️ Cola reanudada');
  } catch (error) {
    console.error('Error resuming queue:', error);
  }
}

module.exports = {
  addVideoToQueue,
  getQueueJobStatus,
  getQueueInfo,
  processQueue,
  cleanCompletedJobs,
  getQueueStats,
  pauseQueue,
  resumeQueue,
  videoQueue
};
