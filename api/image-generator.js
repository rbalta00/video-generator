/**
 * Image Generator - Obtener imágenes de APIs gratuitas
 * Soporta: Unsplash (libre), Pixabay (libre)
 *
 * Nota: Requiere API keys en .env para máxima capacidad
 */

const axios = require('axios');

// Configuración de APIs
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY || '';
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || '';

/**
 * Buscar imágenes en Unsplash
 * @param {string} query - Término de búsqueda
 * @param {number} count - Cantidad de imágenes (1-30, default 5)
 * @returns {Promise<array>} Array de imágenes con urls
 */
async function searchUnsplash(query, count = 5) {
  try {
    const baseUrl = 'https://api.unsplash.com/search/photos';

    const response = await axios.get(baseUrl, {
      params: {
        query: query,
        per_page: Math.min(count, 30),
        order_by: 'relevant'
      },
      headers: UNSPLASH_API_KEY ? {
        'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
      } : {}
    });

    return response.data.results.map(img => ({
      id: img.id,
      url: img.urls.regular,
      thumb: img.urls.thumb,
      author: img.user.name,
      source: 'unsplash',
      downloadUrl: img.links.download_location
    }));
  } catch (error) {
    console.error('Unsplash search error:', error.message);
    return [];
  }
}

/**
 * Buscar imágenes en Pixabay
 * @param {string} query - Término de búsqueda
 * @param {number} count - Cantidad de imágenes (1-50, default 5)
 * @returns {Promise<array>} Array de imágenes con urls
 */
async function searchPixabay(query, count = 5) {
  try {
    if (!PIXABAY_API_KEY) {
      console.warn('⚠️ PIXABAY_API_KEY no configurada. Usando búsqueda de Unsplash...');
      return [];
    }

    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: PIXABAY_API_KEY,
        q: query,
        per_page: Math.min(count, 50),
        safesearch: 'true',
        order: 'popular'
      }
    });

    return response.data.hits.map(img => ({
      id: img.id.toString(),
      url: img.largeImageURL,
      thumb: img.previewURL,
      author: img.user,
      source: 'pixabay',
      downloads: img.downloads
    }));
  } catch (error) {
    console.error('Pixabay search error:', error.message);
    return [];
  }
}

/**
 * Buscar imágenes en múltiples fuentes
 * @param {string} query - Término de búsqueda
 * @param {string} source - 'unsplash'|'pixabay'|'all' (default)
 * @param {number} count - Cantidad total de imágenes
 * @returns {Promise<array>} Array combinado de imágenes
 */
async function searchImages(query, source = 'all', count = 10) {
  if (!query || query.trim().length === 0) {
    return {
      error: 'Query is required',
      images: []
    };
  }

  let results = [];

  try {
    if (source === 'unsplash' || source === 'all') {
      const unsplashResults = await searchUnsplash(query, count);
      results = results.concat(unsplashResults);
    }

    if (source === 'pixabay' || source === 'all') {
      const pixabayResults = await searchPixabay(query, count);
      results = results.concat(pixabayResults);
    }

    return {
      success: true,
      query: query,
      source: source,
      count: results.length,
      images: results.slice(0, count)
    };
  } catch (error) {
    return {
      error: 'Failed to search images',
      message: error.message,
      images: []
    };
  }
}

/**
 * Obtener imagen aleatoria
 * @param {string} query - Tema/búsqueda
 * @param {string} source - Fuente preferida
 * @returns {Promise<object>} Una imagen aleatoria
 */
async function getRandomImage(query, source = 'unsplash') {
  try {
    const results = await searchImages(query, source, 1);

    if (results.images && results.images.length > 0) {
      return {
        success: true,
        image: results.images[0]
      };
    }

    return {
      success: false,
      error: 'No images found'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obtener información sobre APIs disponibles
 * @returns {object} Estado de APIs
 */
function getImageSourcesInfo() {
  return {
    sources: [
      {
        name: 'Unsplash',
        status: 'available',
        limit: '50 requests/hour (sin API key)',
        apiConfigured: Boolean(UNSPLASH_API_KEY),
        description: 'Imágenes de alta calidad y gratuitas'
      },
      {
        name: 'Pixabay',
        status: PIXABAY_API_KEY ? 'available' : 'available_without_key',
        limit: '100 requests/day (sin API key)',
        apiConfigured: Boolean(PIXABAY_API_KEY),
        description: 'Imágenes y videos sin copyright'
      }
    ],
    recommended: 'unsplash',
    note: 'Configure UNSPLASH_API_KEY y PIXABAY_API_KEY en .env para límites más altos'
  };
}

module.exports = {
  searchImages,
  searchUnsplash,
  searchPixabay,
  getRandomImage,
  getImageSourcesInfo
};
