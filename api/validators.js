/**
 * Video File Validators
 * Validaciones para archivos de video
 */

// Extensiones permitidas
const ALLOWED_EXTENSIONS = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', 'wmv'];

// MIME types permitidos
const ALLOWED_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
  'video/x-matroska',
  'video/x-flv',
  'video/x-ms-wmv'
];

// Límites
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const MIN_FILE_SIZE = 1024 * 1024; // 1MB

/**
 * Validar extensión del archivo
 * @param {string} filename - Nombre del archivo
 * @returns {object} { valid: boolean, error?: string }
 */
function validateExtension(filename) {
  if (!filename) {
    return { valid: false, error: 'Filename is required' };
  }

  const ext = filename.split('.').pop().toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Invalid extension: .${ext}. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Validar tamaño del archivo
 * @param {number} fileSize - Tamaño en bytes
 * @returns {object} { valid: boolean, error?: string }
 */
function validateFileSize(fileSize) {
  if (!fileSize || typeof fileSize !== 'number') {
    return { valid: false, error: 'File size is required and must be a number' };
  }

  if (fileSize < MIN_FILE_SIZE) {
    return {
      valid: false,
      error: `File too small: ${(fileSize / 1024 / 1024).toFixed(2)}MB. Minimum: ${MIN_FILE_SIZE / 1024 / 1024}MB`
    };
  }

  if (fileSize > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(fileSize / 1024 / 1024).toFixed(2)}MB. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB`
    };
  }

  return { valid: true };
}

/**
 * Validar MIME type
 * @param {string} mimetype - MIME type del archivo
 * @returns {object} { valid: boolean, error?: string }
 */
function validateMimeType(mimetype) {
  if (!mimetype) {
    return { valid: false, error: 'MIME type is required' };
  }

  if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
    return {
      valid: false,
      error: `Invalid MIME type: ${mimetype}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Validar campo de texto (título, descripción)
 * @param {string} text - Texto a validar
 * @param {string} fieldName - Nombre del campo
 * @param {object} options - { minLength, maxLength, required }
 * @returns {object} { valid: boolean, error?: string }
 */
function validateTextField(text, fieldName = 'Field', options = {}) {
  const { minLength = 1, maxLength = 500, required = false } = options;

  if (!text && required) {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (!text) {
    return { valid: true };
  }

  if (typeof text !== 'string') {
    return { valid: false, error: `${fieldName} must be a string` };
  }

  if (text.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }

  if (text.length > maxLength) {
    return { valid: false, error: `${fieldName} must not exceed ${maxLength} characters` };
  }

  return { valid: true };
}

/**
 * Validar formulario completo
 * @param {object} file - Objeto de archivo (multer)
 * @param {object} body - Datos del formulario
 * @returns {object} { valid: boolean, errors: [] }
 */
function validateVideoUpload(file, body) {
  const errors = [];

  // Validar archivo
  if (!file) {
    errors.push('Video file is required');
  } else {
    // Validar extensión
    const extValidation = validateExtension(file.originalname);
    if (!extValidation.valid) {
      errors.push(extValidation.error);
    }

    // Validar tamaño
    const sizeValidation = validateFileSize(file.size);
    if (!sizeValidation.valid) {
      errors.push(sizeValidation.error);
    }

    // Validar MIME type
    const mimeValidation = validateMimeType(file.mimetype);
    if (!mimeValidation.valid) {
      errors.push(mimeValidation.error);
    }
  }

  // Validar título
  const titleValidation = validateTextField(body.title, 'Title', {
    minLength: 3,
    maxLength: 100,
    required: true
  });
  if (!titleValidation.valid) {
    errors.push(titleValidation.error);
  }

  // Validar descripción (opcional)
  if (body.description) {
    const descValidation = validateTextField(body.description, 'Description', {
      minLength: 0,
      maxLength: 500,
      required: false
    });
    if (!descValidation.valid) {
      errors.push(descValidation.error);
    }
  }

  // Validar estilo
  const validStyles = ['profesional', 'casual', 'dinamico', 'editorial'];
  if (body.style && !validStyles.includes(body.style)) {
    errors.push(`Invalid style. Allowed: ${validStyles.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

/**
 * Obtener información de validación (para la UI)
 * @returns {object} Información sobre límites y formatos permitidos
 */
function getValidationInfo() {
  return {
    allowedFormats: ALLOWED_EXTENSIONS,
    allowedMimeTypes: ALLOWED_MIME_TYPES,
    maxFileSize: {
      bytes: MAX_FILE_SIZE,
      mb: MAX_FILE_SIZE / 1024 / 1024,
      formatted: `${MAX_FILE_SIZE / 1024 / 1024}MB`
    },
    minFileSize: {
      bytes: MIN_FILE_SIZE,
      mb: MIN_FILE_SIZE / 1024 / 1024,
      formatted: `${MIN_FILE_SIZE / 1024 / 1024}MB`
    },
    titleLengthRange: { min: 3, max: 100 },
    descriptionLengthRange: { min: 0, max: 500 },
    validStyles: ['profesional', 'casual', 'dinamico', 'editorial']
  };
}

module.exports = {
  validateExtension,
  validateFileSize,
  validateMimeType,
  validateTextField,
  validateVideoUpload,
  getValidationInfo,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  MIN_FILE_SIZE
};
