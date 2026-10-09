/**
 * Video Templates - Plantillas prediseñadas para procesamiento de videos
 * Presets con configuraciones específicas para diferentes casos de uso
 */

const templates = {
  // Redes Sociales
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    category: 'social',
    description: 'Optimizado para TikTok - Vertical, 9:16',
    config: {
      width: 1080,
      height: 1920,
      quality: 'high',
      fps: 30,
      bitrate: '3000k',
      watermark: false
    },
    metadata: {
      maxDuration: 600, // 10 minutos
      minDuration: 3,
      aspectRatio: '9:16'
    }
  },

  instagram_reels: {
    id: 'instagram_reels',
    name: 'Instagram Reels',
    category: 'social',
    description: 'Optimizado para Instagram Reels - Vertical, 9:16',
    config: {
      width: 1080,
      height: 1920,
      quality: 'high',
      fps: 30,
      bitrate: '3500k',
      watermark: true
    },
    metadata: {
      maxDuration: 90,
      minDuration: 3,
      aspectRatio: '9:16'
    }
  },

  youtube_short: {
    id: 'youtube_short',
    name: 'YouTube Shorts',
    category: 'social',
    description: 'Optimizado para YouTube Shorts - Vertical, 9:16',
    config: {
      width: 1080,
      height: 1920,
      quality: 'high',
      fps: 30,
      bitrate: '4000k',
      watermark: false
    },
    metadata: {
      maxDuration: 60,
      minDuration: 3,
      aspectRatio: '9:16'
    }
  },

  facebook: {
    id: 'facebook',
    name: 'Facebook',
    category: 'social',
    description: 'Optimizado para Facebook - Cuadrado, 1:1',
    config: {
      width: 1080,
      height: 1080,
      quality: 'medium',
      fps: 30,
      bitrate: '2500k',
      watermark: false
    },
    metadata: {
      maxDuration: 240,
      minDuration: 3,
      aspectRatio: '1:1'
    }
  },

  // Profesionales
  youtube_video: {
    id: 'youtube_video',
    name: 'YouTube Video',
    category: 'professional',
    description: 'Optimizado para YouTube - Horizontal, 16:9',
    config: {
      width: 1920,
      height: 1080,
      quality: 'high',
      fps: 30,
      bitrate: '5000k',
      watermark: true
    },
    metadata: {
      maxDuration: 43200, // 12 horas
      minDuration: 60,
      aspectRatio: '16:9'
    }
  },

  presentation: {
    id: 'presentation',
    name: 'Presentación',
    category: 'professional',
    description: 'Para presentaciones - Horizontal, 16:9, Alta calidad',
    config: {
      width: 2560,
      height: 1440,
      quality: 'high',
      fps: 30,
      bitrate: '6000k',
      watermark: false
    },
    metadata: {
      maxDuration: 3600,
      minDuration: 60,
      aspectRatio: '16:9'
    }
  },

  // Marketing
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp Status',
    category: 'marketing',
    description: 'Para WhatsApp Status - Vertical, comprimido',
    config: {
      width: 1080,
      height: 1920,
      quality: 'low',
      fps: 24,
      bitrate: '1500k',
      watermark: false
    },
    metadata: {
      maxDuration: 15,
      minDuration: 1,
      aspectRatio: '9:16'
    }
  },

  email_marketing: {
    id: 'email_marketing',
    name: 'Email Marketing',
    category: 'marketing',
    description: 'Para email - Horizontal, tamaño reducido',
    config: {
      width: 960,
      height: 540,
      quality: 'medium',
      fps: 24,
      bitrate: '1200k',
      watermark: false
    },
    metadata: {
      maxDuration: 120,
      minDuration: 5,
      aspectRatio: '16:9'
    }
  },

  // Editorial
  podcast_thumbnail: {
    id: 'podcast_thumbnail',
    name: 'Podcast (Video)',
    category: 'editorial',
    description: 'Para podcasts en video - Horizontal, estándar',
    config: {
      width: 1280,
      height: 720,
      quality: 'high',
      fps: 30,
      bitrate: '3000k',
      watermark: true
    },
    metadata: {
      maxDuration: 14400, // 4 horas
      minDuration: 300,
      aspectRatio: '16:9'
    }
  },

  streaming: {
    id: 'streaming',
    name: 'Streaming',
    category: 'editorial',
    description: 'Para Twitch/YouTube Live - Adaptable',
    config: {
      width: 1920,
      height: 1080,
      quality: 'high',
      fps: 60,
      bitrate: '6000k',
      watermark: false
    },
    metadata: {
      maxDuration: null, // Sin límite
      minDuration: 60,
      aspectRatio: '16:9'
    }
  }
};

/**
 * Obtener todas las plantillas
 * @param {string} category - Filtrar por categoría (opcional)
 * @returns {object} Plantillas disponibles
 */
function getTemplates(category = null) {
  if (category) {
    const filtered = {};
    Object.entries(templates).forEach(([key, template]) => {
      if (template.category === category) {
        filtered[key] = template;
      }
    });
    return filtered;
  }
  return templates;
}

/**
 * Obtener plantilla por ID
 * @param {string} templateId - ID de la plantilla
 * @returns {object|null} Plantilla o null
 */
function getTemplate(templateId) {
  return templates[templateId] || null;
}

/**
 * Obtener categorías disponibles
 * @returns {array} Lista de categorías
 */
function getCategories() {
  const categories = new Set();
  Object.values(templates).forEach(t => categories.add(t.category));
  return Array.from(categories).sort();
}

/**
 * Validar si video cumple requisitos de plantilla
 * @param {object} metadata - Metadata del video
 * @param {string} templateId - ID de plantilla
 * @returns {object} Validación con errores si hay
 */
function validateVideoForTemplate(metadata, templateId) {
  const template = getTemplate(templateId);
  if (!template) {
    return {
      valid: false,
      errors: ['Template not found']
    };
  }

  const errors = [];
  const meta = template.metadata;

  // Validar duración
  if (meta.minDuration && metadata.duration < meta.minDuration) {
    errors.push(`Video too short. Minimum: ${meta.minDuration}s, Got: ${metadata.duration}s`);
  }

  if (meta.maxDuration && metadata.duration > meta.maxDuration) {
    errors.push(`Video too long. Maximum: ${meta.maxDuration}s, Got: ${metadata.duration}s`);
  }

  return {
    valid: errors.length === 0,
    errors: errors,
    template: template.name,
    requirements: meta
  };
}

/**
 * Obtener info de templates para UI
 * @returns {object} Templates organizados por categoría
 */
function getTemplatesForUI() {
  const organized = {};

  Object.entries(templates).forEach(([key, template]) => {
    if (!organized[template.category]) {
      organized[template.category] = [];
    }
    organized[template.category].push({
      id: template.id,
      name: template.name,
      description: template.description,
      aspectRatio: template.metadata.aspectRatio,
      maxDuration: template.metadata.maxDuration
    });
  });

  return organized;
}

module.exports = {
  templates,
  getTemplates,
  getTemplate,
  getCategories,
  validateVideoForTemplate,
  getTemplatesForUI
};
