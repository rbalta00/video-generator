/**
 * Intelligent Caching - Almacena resultados para evitar reprocesar
 * Utiliza node-cache para almacenamiento en memoria con TTL
 */

const NodeCache = require('node-cache');
const crypto = require('crypto');

// Cache con TTL de 24 horas por defecto
const cache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

/**
 * Generar hash único para combinación de video + configuración
 * @param {object} config - { videoPath, style, quality, ... }
 * @returns {string} Hash SHA256
 */
function generateCacheKey(config) {
  const configStr = JSON.stringify(config);
  return crypto.createHash('sha256').update(configStr).digest('hex');
}

/**
 * Buscar en caché
 * @param {object} config - Configuración del procesamiento
 * @returns {object|null} Resultado en caché o null
 */
function getCached(config) {
  const key = generateCacheKey(config);
  const cached = cache.get(key);

  if (cached) {
    console.log(`✅ Cache hit para: ${key.substring(0, 8)}...`);
    cached.hits = (cached.hits || 0) + 1;
    cached.lastAccess = new Date().toISOString();
    return cached.result;
  }

  return null;
}

/**
 * Guardar en caché
 * @param {object} config - Configuración
 * @param {object} result - Resultado a cachear
 * @param {number} ttl - Tiempo de vida en segundos (opcional)
 * @returns {string} Cache key
 */
function setCached(config, result, ttl = 86400) {
  const key = generateCacheKey(config);

  const cacheEntry = {
    result: result,
    savedAt: new Date().toISOString(),
    hits: 0,
    lastAccess: new Date().toISOString(),
    config: config
  };

  cache.set(key, cacheEntry, ttl);
  console.log(`💾 Cache guardado: ${key.substring(0, 8)}... (TTL: ${ttl}s)`);

  return key;
}

/**
 * Limpiar caché expirado
 * @returns {number} Items eliminados
 */
function cleanExpired() {
  const initialSize = cache.keys().length;
  const stats = cache.getStats();
  console.log(`🧹 Cache limpiado. Antes: ${initialSize} items, Después: ${stats.keys} items`);
  return initialSize - stats.keys;
}

/**
 * Obtener estadísticas del caché
 * @returns {object} Stats detalladas
 */
function getCacheStats() {
  const stats = cache.getStats();
  const keys = cache.keys();

  const entries = keys.map(key => {
    const entry = cache.get(key);
    return {
      key: key.substring(0, 8) + '...',
      hits: entry.hits || 0,
      savedAt: entry.savedAt,
      lastAccess: entry.lastAccess,
      configSummary: {
        style: entry.config?.style,
        quality: entry.config?.quality
      }
    };
  });

  return {
    totalItems: stats.keys,
    totalHits: entries.reduce((sum, e) => sum + e.hits, 0),
    entries: entries,
    hitRate: entries.length > 0
      ? Math.round((entries.reduce((sum, e) => sum + e.hits, 0) / (entries.length * 5)) * 100)
      : 0
  };
}

/**
 * Invalidar entrada específica del caché
 * @param {object} config - Configuración a invalidar
 * @returns {boolean} True si se encontró y eliminó
 */
function invalidate(config) {
  const key = generateCacheKey(config);
  const deleted = cache.del(key);
  console.log(`🗑️ Cache invalidado: ${key.substring(0, 8)}...`);
  return deleted > 0;
}

/**
 * Invalidar todo el caché
 * @returns {number} Items eliminados
 */
function invalidateAll() {
  const keys = cache.keys().length;
  cache.flushAll();
  console.log(`🗑️ Cache completo invalidado. Items eliminados: ${keys}`);
  return keys;
}

/**
 * Validar si caché es válido (hit rate > 20%)
 * @returns {boolean} True si caché está funcionando bien
 */
function isCacheHealthy() {
  const stats = getCacheStats();
  return stats.entries.length > 0 && stats.hitRate > 20;
}

module.exports = {
  getCached,
  setCached,
  generateCacheKey,
  cleanExpired,
  getCacheStats,
  invalidate,
  invalidateAll,
  isCacheHealthy
};
