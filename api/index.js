const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const { validateVideoUpload, getValidationInfo } = require('./validators');
const { createJob, getJob, setJobStatus, listJobs, getStats, simulateProgress } = require('./database');

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

    // ✅ CREAR JOB EN BASE DE DATOS
    const job = createJob({
      title: title,
      description: description || '',
      style: style || 'profesional',
      fileName: file.originalname,
      fileSize: file.size,
      fileMimetype: file.mimetype
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
 * GET /
 * Serve main HTML page
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎬 Video Generator API running on port ${PORT}`);
  console.log(`Backend: ${process.env.BACKEND_URL || 'Not configured'}`);
});

module.exports = app;
