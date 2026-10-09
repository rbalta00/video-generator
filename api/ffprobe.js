/**
 * FFprobe - Extraer metadata de videos
 * Obtiene información detallada sobre archivos de video
 */

const ffmpeg = require('fluent-ffmpeg');

// Intentar encontrar ffprobe en el sistema
const ffprobePath = process.env.FFPROBE_PATH || 'ffprobe';

try {
  const fs = require('fs');
  if (fs.existsSync(ffprobePath)) {
    ffmpeg.setFfprobePath(ffprobePath);
  }
} catch (error) {
  console.warn('⚠️ FFprobe no encontrado. Metadata será simulada.');
}

/**
 * Obtener metadata completa de un video
 * @param {string} filePath - Ruta del archivo de video
 * @returns {Promise<object>} Metadata del video
 */
function getVideoMetadata(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        // Retornar metadata simulada si FFprobe falla
        return resolve(getSimulatedMetadata(filePath));
      }

      try {
        const format = metadata.format || {};
        const videoStream = metadata.streams.find(s => s.codec_type === 'video') || {};
        const audioStream = metadata.streams.find(s => s.codec_type === 'audio') || {};

        const result = {
          filename: format.filename || 'unknown',
          duration: Math.round(format.duration || 0),
          size: parseInt(format.size || 0),
          bitrate: parseInt(format.bit_rate || 0),
          format: {
            name: format.format_name || 'unknown',
            longName: format.format_long_name || 'unknown'
          },
          video: {
            codec: videoStream.codec_name || 'unknown',
            codecLong: videoStream.codec_long_name || 'unknown',
            width: videoStream.width || 0,
            height: videoStream.height || 0,
            fps: parseFloat(videoStream.r_frame_rate) || 0,
            bitrate: parseInt(videoStream.bit_rate || 0),
            pixelFormat: videoStream.pix_fmt || 'unknown'
          },
          audio: audioStream.codec_name ? {
            codec: audioStream.codec_name,
            codecLong: audioStream.codec_long_name || 'unknown',
            sampleRate: parseInt(audioStream.sample_rate || 0),
            channels: audioStream.channels || 0,
            channelLayout: audioStream.channel_layout || 'unknown',
            bitrate: parseInt(audioStream.bit_rate || 0)
          } : null,
          metadata: {
            creationTime: format.tags?.creation_time || null,
            title: format.tags?.title || null,
            comment: format.tags?.comment || null
          }
        };

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Metadata simulada cuando FFprobe no está disponible
 * @param {string} filePath - Ruta del archivo
 * @returns {object} Metadata simulada
 */
function getSimulatedMetadata(filePath) {
  const filename = filePath.split('/').pop() || filePath.split('\\').pop();

  return {
    filename: filename,
    duration: 120, // 2 minutos default
    size: 52428800, // 50MB default
    bitrate: 5000000, // 5 Mbps default
    format: {
      name: 'mov,mp4,m4a,3gp,3g2,mj2',
      longName: 'QuickTime / MOV'
    },
    video: {
      codec: 'h264',
      codecLong: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10',
      width: 1920,
      height: 1080,
      fps: 30,
      bitrate: 4500000,
      pixelFormat: 'yuv420p'
    },
    audio: {
      codec: 'aac',
      codecLong: 'AAC (Advanced Audio Coding)',
      sampleRate: 48000,
      channels: 2,
      channelLayout: 'stereo',
      bitrate: 128000
    },
    metadata: {
      creationTime: new Date().toISOString(),
      title: null,
      comment: 'Metadata simulada - FFprobe no disponible'
    }
  };
}

/**
 * Formatear metadata para UI
 * @param {object} metadata - Metadata del video
 * @returns {object} Metadata formateada
 */
function formatMetadataForUI(metadata) {
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatBitrate = (bits) => {
    if (bits === 0) return '0 bps';
    return Math.round(bits / 1000000) + ' Mbps';
  };

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return {
    filename: metadata.filename,
    duration: {
      seconds: metadata.duration,
      formatted: formatDuration(metadata.duration)
    },
    size: {
      bytes: metadata.size,
      formatted: formatBytes(metadata.size)
    },
    bitrate: {
      bps: metadata.bitrate,
      formatted: formatBitrate(metadata.bitrate)
    },
    video: {
      ...metadata.video,
      resolution: `${metadata.video.width}x${metadata.video.height}`,
      bitrate: formatBitrate(metadata.video.bitrate)
    },
    audio: metadata.audio ? {
      ...metadata.audio,
      bitrate: formatBitrate(metadata.audio.bitrate),
      sampleRateKHz: Math.round(metadata.audio.sampleRate / 1000)
    } : null,
    format: metadata.format,
    metadata: metadata.metadata,
    isSimulated: metadata.metadata?.comment?.includes('simulada') || false
  };
}

module.exports = {
  getVideoMetadata,
  getSimulatedMetadata,
  formatMetadataForUI
};
