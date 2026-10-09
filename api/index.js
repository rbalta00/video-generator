const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const { validateVideoUpload, getValidationInfo } = require('./validators');

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
 * POST /api/generate
 * Create a new video
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

    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return res.json({
        status: 'pending',
        message: 'Backend not configured - video accepted but not processed',
        jobId: Date.now().toString(),
        file: {
          name: file.originalname,
          size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
          mimetype: file.mimetype
        },
        input: {
          title: title,
          description: description,
          style: style
        },
        hint: 'Configure BACKEND_URL environment variable to connect to processing backend'
      });
    }

    // Llamar al backend (cuando esté listo)
    // const backendResponse = await axios.post(`${backendUrl}/generate`, formData);

    res.json({
      status: 'processing',
      jobId: Date.now().toString(),
      message: 'Video generation started',
      file: {
        name: file.originalname,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        mimetype: file.mimetype
      },
      input: {
        title: title,
        description: description || 'No description',
        style: style || 'profesional'
      }
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
 * Check status of a video generation job
 */
app.get('/api/status/:jobId', (req, res) => {
  const { jobId } = req.params;

  // Placeholder - en producción, buscarías en base de datos
  res.json({
    jobId: jobId,
    status: 'processing',
    progress: 45,
    message: 'Generating video variant 2/3',
    estimatedTime: '2 minutes'
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
