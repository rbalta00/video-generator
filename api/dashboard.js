/**
 * Dashboard - Estadísticas y análisis de videos
 * Proporciona datos agregados para visualización
 */

const { listJobs, getStats } = require('./database');

/**
 * Obtener estadísticas completas del dashboard
 * @returns {object} Estadísticas agregadas
 */
function getDashboardStats() {
  const stats = getStats();
  const allJobs = listJobs({ limit: 1000, offset: 0 });

  // Calcular tiempo promedio de procesamiento
  let totalProcessingTime = 0;
  let completedCount = 0;

  allJobs.forEach(job => {
    if (job.status === 'completed') {
      const created = new Date(job.createdAt);
      const updated = new Date(job.updatedAt);
      const processingTime = (updated - created) / 1000; // segundos
      totalProcessingTime += processingTime;
      completedCount++;
    }
  });

  const avgProcessingTime = completedCount > 0 ? Math.round(totalProcessingTime / completedCount) : 0;

  // Calcular tamaño total de archivos
  let totalFileSize = 0;
  allJobs.forEach(job => {
    totalFileSize += job.file?.size || 0;
  });

  // Agrupar por estilo
  const styleDistribution = {};
  allJobs.forEach(job => {
    const style = job.input?.style || 'unknown';
    styleDistribution[style] = (styleDistribution[style] || 0) + 1;
  });

  // Agrupar por fecha (últimos 7 días)
  const last7Days = getJobsByDate(allJobs, 7);

  // Success rate
  const successRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return {
    summary: {
      total: stats.total,
      pending: stats.pending,
      processing: stats.processing,
      completed: stats.completed,
      error: stats.error,
      successRate: successRate,
      averageProgress: stats.averageProgress
    },
    processing: {
      averageTime: avgProcessingTime,
      averageTimeFormatted: formatSeconds(avgProcessingTime),
      totalFileSize: totalFileSize,
      totalFileSizeFormatted: formatBytes(totalFileSize),
      averageFileSize: stats.total > 0 ? Math.round(totalFileSize / stats.total) : 0
    },
    distribution: {
      byStyle: styleDistribution,
      byStatus: {
        pending: stats.pending,
        processing: stats.processing,
        completed: stats.completed,
        error: stats.error
      }
    },
    timeline: last7Days,
    health: {
      status: stats.error === 0 ? 'healthy' : stats.error < stats.completed ? 'good' : 'warning',
      errorRate: stats.total > 0 ? Math.round((stats.error / stats.total) * 100) : 0
    }
  };
}

/**
 * Obtener trabajos agrupados por fecha
 * @param {array} jobs - Array de jobs
 * @param {number} days - Últimos N días
 * @returns {object} Jobs por día
 */
function getJobsByDate(jobs, days = 7) {
  const result = {};

  // Inicializar últimos N días
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    result[dateStr] = {
      date: dateStr,
      total: 0,
      completed: 0,
      error: 0,
      pending: 0
    };
  }

  // Contar jobs por fecha
  jobs.forEach(job => {
    const dateStr = job.createdAt.split('T')[0];
    if (result[dateStr]) {
      result[dateStr].total++;
      result[dateStr][job.status]++;
    }
  });

  return Object.values(result);
}

/**
 * Obtener detalles de un job específico
 * @param {string} jobId - ID del job
 * @returns {object} Detalles formateados
 */
function getJobDetails(jobId) {
  const { getJob } = require('./database');
  const job = getJob(jobId);

  if (!job) {
    return null;
  }

  const created = new Date(job.createdAt);
  const updated = new Date(job.updatedAt);
  const processingTime = Math.round((updated - created) / 1000);

  return {
    jobId: job.jobId,
    status: job.status,
    progress: job.progress,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    processingTime: processingTime,
    processingTimeFormatted: formatSeconds(processingTime),
    input: {
      title: job.input.title,
      description: job.input.description,
      style: job.input.style
    },
    file: {
      name: job.file.name,
      size: job.file.size,
      sizeFormatted: formatBytes(job.file.size),
      mimetype: job.file.mimetype
    },
    output: job.output,
    error: job.error
  };
}

/**
 * Obtener historial reciente de jobs
 * @param {number} limit - Cantidad de registros
 * @returns {array} Jobs recientes
 */
function getRecentJobs(limit = 10) {
  const jobs = listJobs({ limit: limit, offset: 0 });

  return jobs.map(job => ({
    jobId: job.jobId,
    status: job.status,
    progress: job.progress,
    title: job.input.title,
    style: job.input.style,
    fileSize: formatBytes(job.file.size),
    createdAt: job.createdAt,
    createdAtFormatted: formatDate(job.createdAt)
  }));
}

/**
 * Obtener jobs por estado
 * @param {string} status - pending|processing|completed|error
 * @param {number} limit - Cantidad
 * @returns {array} Jobs filtrados
 */
function getJobsByStatus(status, limit = 20) {
  const jobs = listJobs({ limit: limit, offset: 0, status: status });

  return jobs.map(job => ({
    jobId: job.jobId,
    status: job.status,
    progress: job.progress,
    title: job.input.title,
    style: job.input.style,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    error: job.error
  }));
}

/**
 * Obtener estadísticas de rendimiento
 * @returns {object} Métricas de rendimiento
 */
function getPerformanceMetrics() {
  const stats = getDashboardStats();

  return {
    successRate: stats.summary.successRate,
    errorRate: stats.health.errorRate,
    averageProcessingTime: stats.processing.averageTime,
    totalVideosProcessed: stats.summary.completed,
    pendingVideos: stats.summary.pending,
    processingVideos: stats.summary.processing,
    averageFileSize: formatBytes(stats.processing.averageFileSize),
    totalStorageUsed: stats.processing.totalFileSizeFormatted
  };
}

/**
 * Formatear segundos a formato legible
 * @param {number} seconds - Segundos
 * @returns {string} Formato "Xm Ys" o "Xs"
 */
function formatSeconds(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
}

/**
 * Formatear bytes a formato legible
 * @param {number} bytes - Bytes
 * @returns {string} Formato "X MB" o "X KB"
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Formatear fecha ISO a formato legible
 * @param {string} isoDate - Fecha ISO
 * @returns {string} Formato "DD/MM/YYYY HH:MM"
 */
function formatDate(isoDate) {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

module.exports = {
  getDashboardStats,
  getJobDetails,
  getRecentJobs,
  getJobsByStatus,
  getPerformanceMetrics,
  getJobsByDate,
  formatSeconds,
  formatBytes,
  formatDate
};
