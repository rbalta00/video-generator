const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const { validateVideoUpload, getValidationInfo } = require('./validators');
const { createJob, getJob, setJobStatus, listJobs, getStats, simulateProgress } = require('./database');
const { processVideoByStyle, generateOutputFilename } = require('./video-editor');
const { searchImages, getImageSourcesInfo } = require('./image-generator');
const { getVideoMetadata, formatMetadataForUI } = require('./ffprobe');
const { getTemplates, getTemplate, getCategories, validateVideoForTemplate, getTemplatesForUI } = require('./templates');
const { getDashboardStats, getJobDetails, getRecentJobs, getJobsByStatus, getPerformanceMetrics } = require('./dashboard');
const { getCached, setCached, getCacheStats, invalidateAll } = require('./cache');
const { addVideoToQueue, getQueueInfo, getQueueStats, processQueue } = require('./queue');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Configurar multer para uploads
const upload = multer({
  dest: '/tmp/uploads',
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

// ========== ROUTES ==========

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Video Generator API is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/info
 * Get information about the API
 */
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Video Generator Pro',
    version: '1.0.1',
    description: 'AI-powered video generator for El Buen Cerdito',
    features: [
      'Video creation from templates',
      'File validation (size, extension, MIME type)',
      'Automatic image generation',
      'FFmpeg integration',
      'Variant creation',
      'Text overlay support'
    ],
    backend: process.env.BACKEND_URL || 'Not configured',
    maxFileSize: '500MB',
    supportedFormats: ['mp4', 'mov', 'avi', 'webm']
  });
});

/**
 * GET /api/validation-info
 * Get validation requirements and limits
 */
app.get('/api/validation-info', (req, res) => {
  res.json(getValidationInfo());
});

/**
 * GET /api/jobs
 * List all jobs with pagination
 */
app.get('/api/jobs', (req, res) => {
  const { limit = 50, offset = 0, status = null } = req.query;

  const jobs = listJobs({
    limit: Math.min(parseInt(limit) || 50, 100),
    offset: parseInt(offset) || 0,
    status: status || null
  });

  res.json({
    total: jobs.length,
    jobs: jobs
  });
});

/**
 * GET /api/stats
 * Get database statistics
 */
app.get('/api/stats', (req, res) => {
  res.json(getStats());
});

/**
 * GET /api/dashboard
 * Get complete dashboard statistics
 */
app.get('/api/dashboard', (req, res) => {
  res.json(getDashboardStats());
});

/**
 * GET /api/dashboard/metrics
 * Get performance metrics summary
 */
app.get('/api/dashboard/metrics', (req, res) => {
  res.json(getPerformanceMetrics());
});

/**
 * GET /api/dashboard/recent
 * Get recent jobs
 * Query param: limit (default 10, max 50)
 */
app.get('/api/dashboard/recent', (req, res) => {
  const { limit = 10 } = req.query;
  const jobs = getRecentJobs(Math.min(parseInt(limit) || 10, 50));
  res.json({
    count: jobs.length,
    jobs: jobs
  });
});

/**
 * GET /api/dashboard/status/:status
 * Get jobs by status
 * Params: status (pending|processing|completed|error)
 * Query: limit (default 20, max 100)
 */
app.get('/api/dashboard/status/:status', (req, res) => {
  const { status } = req.params;
  const { limit = 20 } = req.query;

  const validStatuses = ['pending', 'processing', 'completed', 'error'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status',
      validStatuses: validStatuses
    });
  }

  const jobs = getJobsByStatus(status, Math.min(parseInt(limit) || 20, 100));
  res.json({
    status: status,
    count: jobs.length,
    jobs: jobs
  });
});

/**
 * GET /api/dashboard/job/:jobId
 * Get detailed info about a specific job
 */
app.get('/api/dashboard/job/:jobId', (req, res) => {
  const { jobId } = req.params;
  const details = getJobDetails(jobId);

  if (!details) {
    return res.status(404).json({
      error: 'Job not found',
      jobId: jobId
    });
  }

  res.json({
    success: true,
    job: details
  });
});

/**
 * GET /api/cache/stats
 * Get cache statistics and health
 */
app.get('/api/cache/stats', (req, res) => {
  const stats = getCacheStats();
  res.json({
    stats: stats,
    healthy: stats.hitRate > 20
  });
});

/**
 * DELETE /api/cache
 * Clear all cache
 */
app.delete('/api/cache', (req, res) => {
  const removed = invalidateAll();
  res.json({
    success: true,
    itemsRemoved: removed,
    message: `${removed} items removed from cache`
  });
});

/**
 * GET /api/queue/info
 * Get queue status and statistics
 */
app.get('/api/queue/info', async (req, res) => {
  try {
    const info = await getQueueInfo();
    const stats = await getQueueStats();

    res.json({
      queue: info,
      stats: stats,
      healthy: info.failed < info.completed
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get queue info',
      message: error.message
    });
  }
});

/**
 * GET /api/templates
 * Get all available video templates
 * Query param: category (optional, filter by category)
 */
app.get('/api/templates', (req, res) => {
  const { category } = req.query;
  res.json({
    templates: getTemplates(category),
    categories: getCategories(),
    count: Object.keys(getTemplates(category)).length
  });
});

/**
 * GET /api/templates-ui
 * Get templates organized for UI display
 */
app.get('/api/templates-ui', (req, res) => {
  res.json({
    templates: getTemplatesForUI(),
    categories: getCategories()
  });
});

/**
 * GET /api/templates/:templateId
 * Get specific template by ID
 */
app.get('/api/templates/:templateId', (req, res) => {
  const { templateId } = req.params;
  const template = getTemplate(templateId);

  if (!template) {
    return res.status(404).json({
      error: 'Template not found',
      templateId: templateId,
      availableTemplates: Object.keys(getTemplates())
    });
  }

  res.json({
    success: true,
    template: template
  });
});

/**
 * POST /api/templates/validate
 * Validate if video meets template requirements
 * Body: { templateId, metadata }
 */
app.post('/api/templates/validate', (req, res) => {
  const { templateId, metadata } = req.body;

  if (!templateId || !metadata) {
    return res.status(400).json({
      error: 'templateId and metadata are required'
    });
  }

  const validation = validateVideoForTemplate(metadata, templateId);
  res.json(validation);
});

/**
 * GET /api/image-sources
 * Get information about available image sources
 */
app.get('/api/image-sources', (req, res) => {
  res.json(getImageSourcesInfo());
});

/**
 * POST /api/video-info
 * Get metadata from uploaded video file
 * Body: { filePath } (path to video file in /tmp)
 */
app.post('/api/video-info', async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({
        error: 'filePath is required',
        example: '{ "filePath": "/tmp/uploads/video.mp4" }'
      });
    }

    const metadata = await getVideoMetadata(filePath);
    const formatted = formatMetadataForUI(metadata);

    res.json({
      success: true,
      metadata: formatted
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to get video metadata',
      message: error.message
    });
  }
});

/**
 * GET /api/search-images
 * Search for images by keyword
 * Query params: query (required), source (unsplash|pixabay|all), count (1-30)
 */
app.get('/api/search-images', async (req, res) => {
  try {
    const { query, source = 'all', count = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        error: 'Search query is required',
        example: '/api/search-images?query=nature&source=all&count=5'
      });
    }

    const results = await searchImages(
      query,
      source,
      Math.min(parseInt(count) || 10, 30)
    );

    res.json(results);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to search images',
      message: error.message
    });
  }
});

/**
 * POST /api/process/:jobId
 * Process video with selected style (local processing or queue to backend)
 */
app.post('/api/process/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    // Obtener job de la BD
    const job = getJob(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Cambiar status a processing
    setJobStatus(jobId, 'processing', {
      progress: 10,
      message: 'Iniciando procesamiento de video...'
    });

    // Simular progreso de edición
    const progressSteps = [
      { progress: 25, message: 'Descargando archivo...' },
      { progress: 50, message: 'Comprimiendo video...' },
      { progress: 75, message: 'Aplicando efectos de estilo...' },
      { progress: 90, message: 'Finalizando...' },
      { progress: 100, message: 'Video listo para descargar!', url: `/api/download/${jobId}` }
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step >= progressSteps.length) {
        clearInterval(interval);

        // Video completado
        const finalJob = setJobStatus(jobId, 'completed', {
          progress: 100,
          message: 'Video listo para descargar!',
          url: `/api/download/${jobId}`
        });

        return;
      }

      const current = progressSteps[step];
      setJobStatus(jobId, 'processing', {
        progress: current.progress,
        message: current.message
      });

      step++;
    }, 1500);

    res.json({
      status: 'processing',
      jobId: jobId,
      message: 'Video processing started',
      estimatedDuration: '2-3 minutes',
      style: job.input.style,
      input: job.input
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to process video',
      message: error.message
    });
  }
});

/**
 * POST /api/generate
 * Create a new video and save to database
 */
app.post('/api/generate', upload.single('video'), async (req, res) => {
  try {
    const { title, description, style } = req.body;
    const file = req.file;

    // ✅ VALIDAR archivos y formulario
    const validation = validateVideoUpload(file, req.body);

    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: validation.errors,
        hint: 'Please check the validation requirements at /api/validation-info'
      });
    }

    // Log del archivo aceptado
    console.log(`✅ Video validado: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    // Crear carpeta uploads si no existe
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!require('fs').existsSync(uploadsDir)) {
      require('fs').mkdirSync(uploadsDir, { recursive: true });
    }

    // Generar jobId primero para usarlo en el nombre del archivo
    const jobId = Date.now().toString();
    const newFilePath = path.join(uploadsDir, `${jobId}.mp4`);

    // Mover el archivo a la carpeta uploads con el jobId como nombre
    require('fs').renameSync(file.path, newFilePath);
    console.log(`📁 Video guardado: ${newFilePath}`);

    // ✅ CREAR JOB EN BASE DE DATOS
    const job = createJob({
      title: title,
      description: description || '',
      style: style || 'profesional',
      fileName: file.originalname,
      fileSize: file.size,
      fileMimetype: file.mimetype,
      filePath: newFilePath,
      jobId: jobId
    });

    // Simular progreso (para testing)
    simulateProgress(job.jobId);

    res.json({
      status: 'pending',
      jobId: job.jobId,
      message: 'Video creado y en cola de procesamiento',
      file: {
        name: file.originalname,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        mimetype: file.mimetype
      },
      input: {
        title: title,
        description: description || 'Sin descripción',
        style: style || 'profesional'
      },
      createdAt: job.createdAt,
      statusUrl: `/api/status/${job.jobId}`
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to generate video',
      message: error.message
    });
  }
});

/**
 * GET /api/status/:jobId
 * Check status of a video generation job from database
 */
app.get('/api/status/:jobId', (req, res) => {
  const { jobId } = req.params;

  // ✅ Traer job de la BD
  const job = getJob(jobId);

  if (!job) {
    return res.status(404).json({
      error: 'Job not found',
      jobId: jobId,
      message: 'The job does not exist or has expired'
    });
  }

  // Retornar estado actual del job
  res.json({
    jobId: job.jobId,
    status: job.status,
    progress: job.progress,
    message: job.output?.message || 'In progress',
    estimatedTime: job.status === 'completed' ? '0 minutes' : '2-3 minutes',
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    input: job.input,
    output: job.output,
    error: job.error
  });
});

/**
 * GET /api/stream/:jobId
 * Stream video for playback (without download header)
 */
app.get('/api/stream/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = getJob(jobId);

  if (!job) {
    return res.status(404).json({
      error: 'Job not found',
      jobId: jobId
    });
  }

  if (job.status !== 'completed') {
    return res.status(400).json({
      error: 'Video not ready',
      message: `Job status is ${job.status}. Must be completed.`,
      jobId: jobId
    });
  }

  const fs = require('fs');
  const sourceVideoPath = job.file?.path || path.join(__dirname, '../video_final.mp4');

  if (!fs.existsSync(sourceVideoPath)) {
    return res.status(500).json({
      error: 'Video file not found',
      jobId: jobId,
      path: sourceVideoPath,
      message: 'The video file is not available'
    });
  }

  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Accept-Ranges', 'bytes');
  res.sendFile(sourceVideoPath);
});

/**
 * GET /api/download/:jobId
 * Download processed video
 */
app.get('/api/download/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = getJob(jobId);

  if (!job) {
    return res.status(404).json({
      error: 'Job not found',
      jobId: jobId
    });
  }

  if (job.status !== 'completed') {
    return res.status(400).json({
      error: 'Video not ready',
      message: `Job status is ${job.status}. Must be completed.`,
      jobId: jobId
    });
  }

  // Definir ruta de descargas
  const downloadDir = 'C:\\descargas';
  const videoFilename = `video_${jobId}.mp4`;
  const downloadPath = path.join(downloadDir, videoFilename);

  // Copiar el video a la carpeta de descargas si no existe
  const fs = require('fs');
  const sourceVideoPath = job.file?.path || path.join(__dirname, '../video_final.mp4');

  if (!fs.existsSync(downloadPath) && fs.existsSync(sourceVideoPath)) {
    try {
      fs.copyFileSync(sourceVideoPath, downloadPath);
      console.log(`✅ Video copied to: ${downloadPath}`);
    } catch (error) {
      console.warn(`⚠️ Could not copy video to downloads folder: ${error.message}`);
    }
  }

  // Verificar que el archivo existe
  if (!fs.existsSync(downloadPath)) {
    return res.status(500).json({
      error: 'Video file not found',
      jobId: jobId,
      message: 'The processed video file is not available for download'
    });
  }

  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Disposition', `attachment; filename="${videoFilename}"`);
  res.sendFile(downloadPath);
});

/**
 * GET /
 * Serve main HTML page
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

/**
 * GET /dashboard
 * Serve dashboard page
 */
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Inicializar queue de procesamiento
async function initializeQueue() {
  try {
    // Procesar videos de la cola
    await processQueue(async (jobData, progressCallback) => {
      progressCallback(25, 'Descargando archivo...');
      progressCallback(50, 'Procesando video...');
      progressCallback(75, 'Aplicando efectos...');
      progressCallback(95, 'Finalizando...');

      // Simular procesamiento (en producción usaría processVideoByStyle real)
      return {
        url: `/api/download/${jobData.jobId}`,
        message: `Video procesado con estilo ${jobData.style}`
      };
    });

    console.log('✅ Queue processor iniciado');
  } catch (error) {
    console.warn('⚠️ Queue processor error:', error.message);
  }
}

// Initialize queue on server start
initializeQueue().catch(console.warn);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎬 Video Generator API running on port ${PORT}`);
  console.log(`Backend: ${process.env.BACKEND_URL || 'Not configured'}`);
});

// Export app for testing or modules that need it
module.exports = app;
