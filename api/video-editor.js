/**
 * Video Editor - Editar y procesar videos
 * Usa fluent-ffmpeg para manipulación de videos
 *
 * Nota: FFmpeg debe estar instalado localmente
 * En Vercel, usa backend remoto (Railway)
 */

const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

// Intentar encontrar ffmpeg en el sistema
const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
const ffprobePath = process.env.FFPROBE_PATH || 'ffprobe';

// Configurar rutas si están disponibles
try {
  if (fs.existsSync(ffmpegPath)) {
    ffmpeg.setFfmpegPath(ffmpegPath);
  }
  if (fs.existsSync(ffprobePath)) {
    ffmpeg.setFfprobePath(ffprobePath);
  }
} catch (error) {
  console.warn('⚠️ FFmpeg no encontrado en el sistema. Video editing será simulado.');
}

// Directorio de salida
const OUTPUT_DIR = process.env.NODE_ENV === 'production' ? '/tmp' : './tmp/videos';

// Crear directorio si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Obtener información del video
 * @param {string} inputPath - Ruta del video
 * @returns {Promise<object>} Información del video
 */
function getVideoInfo(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const video = metadata.streams.find(s => s.codec_type === 'video') || {};
      const audio = metadata.streams.find(s => s.codec_type === 'audio') || {};

      resolve({
        duration: metadata.format.duration,
        bitrate: metadata.format.bit_rate,
        size: metadata.format.size,
        video: {
          width: video.width,
          height: video.height,
          fps: eval(video.r_frame_rate),
          codec: video.codec_name
        },
        audio: {
          codec: audio.codec_name,
          sampleRate: audio.sample_rate,
          channels: audio.channels
        }
      });
    });
  });
}

/**
 * Cortar video (trim)
 * @param {string} inputPath - Video original
 * @param {number} startTime - Tiempo inicio (segundos)
 * @param {number} duration - Duración (segundos)
 * @param {string} outputPath - Ruta salida
 * @returns {Promise<string>} Ruta del video cortado
 */
function trimVideo(inputPath, startTime, duration, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startTime)
      .duration(duration)
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}

/**
 * Comprimir video
 * @param {string} inputPath - Video original
 * @param {string} quality - 'low'|'medium'|'high'
 * @param {string} outputPath - Ruta salida
 * @returns {Promise<string>} Ruta del video comprimido
 */
function compressVideo(inputPath, quality = 'medium', outputPath) {
  const presets = {
    low: { videoBitrate: '500k', videoCodec: 'libx264', preset: 'fast' },
    medium: { videoBitrate: '1500k', videoCodec: 'libx264', preset: 'medium' },
    high: { videoBitrate: '3000k', videoCodec: 'libx264', preset: 'slow' }
  };

  const preset = presets[quality] || presets.medium;

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoBitrate(preset.videoBitrate)
      .videoCodec(preset.videoCodec)
      .preset(preset.preset)
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}

/**
 * Redimensionar video
 * @param {string} inputPath - Video original
 * @param {number} width - Ancho (ej: 1280)
 * @param {number} height - Alto (ej: 720)
 * @param {string} outputPath - Ruta salida
 * @returns {Promise<string>} Ruta del video redimensionado
 */
function resizeVideo(inputPath, width, height, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .size(`${width}x${height}`)
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}

/**
 * Agregar watermark
 * @param {string} inputPath - Video original
 * @param {string} watermarkPath - Imagen del watermark
 * @param {string} position - 'top-left'|'top-right'|'bottom-left'|'bottom-right'
 * @param {string} outputPath - Ruta salida
 * @returns {Promise<string>} Ruta del video con watermark
 */
function addWatermark(inputPath, watermarkPath, position = 'bottom-right', outputPath) {
  const positions = {
    'top-left': '10:10',
    'top-right': 'W-w-10:10',
    'bottom-left': '10:H-h-10',
    'bottom-right': 'W-w-10:H-h-10'
  };

  const placement = positions[position] || positions['bottom-right'];

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .input(watermarkPath)
      .complexFilter(`[0:v][1:v]overlay=${placement}[outv]`, {
        inputs: ['[outv]'],
        outputs: ['v:out']
      })
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}

/**
 * Convertir formato de video
 * @param {string} inputPath - Video original
 * @param {string} format - 'mp4'|'webm'|'avi'|'mov'
 * @param {string} outputPath - Ruta salida
 * @returns {Promise<string>} Ruta del video convertido
 */
function convertFormat(inputPath, format, outputPath) {
  const codecs = {
    mp4: { codec: 'libx264', format: 'mp4' },
    webm: { codec: 'libvpx', format: 'webm' },
    avi: { codec: 'mpeg4', format: 'avi' },
    mov: { codec: 'libx264', format: 'mov' }
  };

  const config = codecs[format] || codecs.mp4;

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec(config.codec)
      .format(config.format)
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}

/**
 * Editar video completo (todas las operaciones)
 * @param {object} options - { inputPath, startTime?, duration?, quality?, width?, height?, watermark?, format?, outputPath }
 * @returns {Promise<string>} Ruta del video final
 */
function editVideo(options) {
  const {
    inputPath,
    startTime = 0,
    duration = null,
    quality = 'medium',
    width = null,
    height = null,
    watermark = null,
    format = 'mp4',
    outputPath
  } = options;

  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath);

    // Trim si se especifica
    if (startTime > 0 || duration) {
      command = command.setStartTime(startTime);
      if (duration) command = command.duration(duration);
    }

    // Compression
    const presets = {
      low: { videoBitrate: '500k', preset: 'fast' },
      medium: { videoBitrate: '1500k', preset: 'medium' },
      high: { videoBitrate: '3000k', preset: 'slow' }
    };
    const preset = presets[quality] || presets.medium;
    command = command.videoBitrate(preset.videoBitrate).preset(preset.preset);

    // Resize si se especifica
    if (width && height) {
      command = command.size(`${width}x${height}`);
    }

    // Output
    command
      .format(format)
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}

/**
 * Procesar video según el estilo
 * @param {object} options - { inputPath, style, outputPath }
 * @returns {Promise<object>} { outputPath, message, processedAt }
 */
async function processVideoByStyle(options) {
  const { inputPath, style, outputPath } = options;

  console.log(`📹 Procesando video con estilo: ${style}`);

  try {
    const styleConfigs = {
      profesional: {
        quality: 'high',
        width: 1920,
        height: 1080,
        watermark: true
      },
      casual: {
        quality: 'medium',
        width: 1280,
        height: 720,
        watermark: false
      },
      dinamico: {
        quality: 'medium',
        width: 1080,
        height: 1080,
        watermark: true
      },
      editorial: {
        quality: 'high',
        width: 1280,
        height: 720,
        watermark: true
      }
    };

    const config = styleConfigs[style] || styleConfigs.profesional;

    // Editar video
    const result = await editVideo({
      inputPath,
      quality: config.quality,
      width: config.width,
      height: config.height,
      format: 'mp4',
      outputPath
    });

    return {
      outputPath: result,
      message: `Video procesado en estilo ${style}`,
      processedAt: new Date().toISOString(),
      style: style,
      resolution: `${config.width}x${config.height}`,
      quality: config.quality
    };
  } catch (error) {
    console.error('Error procesando video:', error);
    throw error;
  }
}

/**
 * Generar nombre único para output
 * @param {string} jobId - ID del job
 * @param {string} style - Estilo del video
 * @returns {string} Nombre del archivo
 */
function generateOutputFilename(jobId, style) {
  return path.join(OUTPUT_DIR, `video-${jobId}-${style}-${Date.now()}.mp4`);
}

module.exports = {
  getVideoInfo,
  trimVideo,
  compressVideo,
  resizeVideo,
  addWatermark,
  convertFormat,
  editVideo,
  processVideoByStyle,
  generateOutputFilename,
  OUTPUT_DIR
};
