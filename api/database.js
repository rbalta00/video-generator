/**
 * Simple Database for Video Jobs
 * Almacena estado de videos siendo procesados
 *
 * Estructura:
 * {
 *   jobId: "timestamp-unique",
 *   status: "pending|processing|completed|error",
 *   progress: 0-100,
 *   createdAt: "ISO timestamp",
 *   updatedAt: "ISO timestamp",
 *   input: { title, description, style },
 *   file: { name, size, mimetype },
 *   output: { url?, message? },
 *   error: null || error message
 * }
 */

const fs = require('fs');
const path = require('path');

// Usar /tmp para Vercel o archivo local para desarrollo
const DB_DIR = process.env.NODE_ENV === 'production' ? '/tmp' : '.';
const DB_FILE = path.join(DB_DIR, 'video-jobs.json');

// Cargar jobs al iniciar
let jobs = loadJobs();

/**
 * Cargar jobs del archivo
 */
function loadJobs() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading database:', error.message);
  }
  return {};
}

/**
 * Guardar jobs al archivo
 */
function saveJobs() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(jobs, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving database:', error.message);
  }
}

/**
 * Crear un nuevo job
 * @param {object} jobData - Datos iniciales del job
 * @returns {object} Job creado
 */
function createJob(jobData) {
  const jobId = jobData.jobId || Date.now().toString();

  const job = {
    jobId: jobId,
    status: 'pending',
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    input: {
      title: jobData.title || 'Untitled',
      description: jobData.description || '',
      style: jobData.style || 'profesional'
    },
    file: {
      name: jobData.fileName || 'video.mp4',
      size: jobData.fileSize || 0,
      mimetype: jobData.fileMimetype || 'video/mp4',
      path: jobData.filePath || null
    },
    output: {
      url: null,
      message: null
    },
    error: null
  };

  jobs[jobId] = job;
  saveJobs();

  console.log(`✅ Job creado: ${jobId}`);
  return job;
}

/**
 * Obtener un job por ID
 * @param {string} jobId
 * @returns {object|null} Job o null si no existe
 */
function getJob(jobId) {
  return jobs[jobId] || null;
}

/**
 * Actualizar estado de un job
 * @param {string} jobId
 * @param {object} updates - { status?, progress?, output?, error? }
 * @returns {object|null} Job actualizado
 */
function updateJob(jobId, updates) {
  if (!jobs[jobId]) {
    return null;
  }

  const job = jobs[jobId];

  // Actualizar campos
  if (updates.status) job.status = updates.status;
  if (updates.progress !== undefined) job.progress = Math.min(100, Math.max(0, updates.progress));
  if (updates.output) job.output = { ...job.output, ...updates.output };
  if (updates.error) job.error = updates.error;

  job.updatedAt = new Date().toISOString();

  saveJobs();

  console.log(`✅ Job actualizado: ${jobId} → ${updates.status || 'sin cambio'}`);
  return job;
}

/**
 * Cambiar estado de un job
 * @param {string} jobId
 * @param {string} status - "processing|completed|error"
 * @param {object} options - { progress?, message?, url?, error? }
 * @returns {object|null} Job actualizado
 */
function setJobStatus(jobId, status, options = {}) {
  if (!jobs[jobId]) {
    return null;
  }

  const updates = { status };

  if (options.progress !== undefined) updates.progress = options.progress;
  if (options.message !== undefined || options.url !== undefined) {
    updates.output = {};
    if (options.message !== undefined) updates.output.message = options.message;
    if (options.url !== undefined) updates.output.url = options.url;
  }
  if (options.error) updates.error = options.error;

  return updateJob(jobId, updates);
}

/**
 * Listar todos los jobs
 * @param {object} options - { limit?, offset?, status? }
 * @returns {array} Array de jobs
 */
function listJobs(options = {}) {
  const { limit = 50, offset = 0, status = null } = options;

  let jobList = Object.values(jobs);

  // Filtrar por status si se especifica
  if (status) {
    jobList = jobList.filter(j => j.status === status);
  }

  // Ordenar por fecha (más recientes primero)
  jobList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Aplicar paginación
  return jobList.slice(offset, offset + limit);
}

/**
 * Eliminar un job antiguo
 * @param {string} jobId
 * @returns {boolean} True si se eliminó
 */
function deleteJob(jobId) {
  if (!jobs[jobId]) {
    return false;
  }

  delete jobs[jobId];
  saveJobs();

  console.log(`🗑️ Job eliminado: ${jobId}`);
  return true;
}

/**
 * Limpiar jobs antiguos (> 24 horas)
 * @returns {number} Número de jobs eliminados
 */
function cleanupOldJobs(hoursOld = 24) {
  const now = new Date();
  const cutoff = new Date(now.getTime() - hoursOld * 60 * 60 * 1000);

  let deleted = 0;

  Object.keys(jobs).forEach(jobId => {
    const job = jobs[jobId];
    const createdAt = new Date(job.createdAt);

    if (createdAt < cutoff) {
      delete jobs[jobId];
      deleted++;
    }
  });

  if (deleted > 0) {
    saveJobs();
    console.log(`🧹 ${deleted} jobs antiguos eliminados`);
  }

  return deleted;
}

/**
 * Obtener estadísticas
 * @returns {object} Stats de jobs
 */
function getStats() {
  const jobList = Object.values(jobs);

  return {
    total: jobList.length,
    pending: jobList.filter(j => j.status === 'pending').length,
    processing: jobList.filter(j => j.status === 'processing').length,
    completed: jobList.filter(j => j.status === 'completed').length,
    error: jobList.filter(j => j.status === 'error').length,
    averageProgress: Math.round(
      jobList.reduce((sum, j) => sum + j.progress, 0) / (jobList.length || 1)
    )
  };
}

/**
 * Simular progreso (para testing)
 * @param {string} jobId
 */
function simulateProgress(jobId) {
  const job = getJob(jobId);
  if (!job) return;

  // Progresión: 0% → 25% → 50% → 75% → 100%
  const progressSteps = [
    { progress: 25, status: 'processing', message: 'Descargando archivos...' },
    { progress: 50, status: 'processing', message: 'Procesando video...' },
    { progress: 75, status: 'processing', message: 'Generando variantes...' },
    { progress: 100, status: 'completed', message: 'Video listo!', url: `/api/stream/${jobId}` }
  ];

  let stepIndex = 0;

  const interval = setInterval(() => {
    if (stepIndex >= progressSteps.length) {
      clearInterval(interval);
      return;
    }

    const step = progressSteps[stepIndex];
    setJobStatus(jobId, step.status, {
      progress: step.progress,
      message: step.message,
      url: step.url
    });

    stepIndex++;
  }, 2000); // Cada 2 segundos un paso
}

module.exports = {
  createJob,
  getJob,
  updateJob,
  setJobStatus,
  listJobs,
  deleteJob,
  cleanupOldJobs,
  getStats,
  simulateProgress
};
