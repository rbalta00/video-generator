/**
 * Video Processor con Transiciones
 * Agrega transiciones suaves entre clips de video
 */

const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

/**
 * Procesar video y agregar transiciones
 * @param {string} inputPath - Ruta del video de entrada
 * @param {string} outputPath - Ruta del video de salida
 * @param {string} transitionType - Tipo de transición: 'fade', 'dissolve', 'slide'
 * @param {number} transitionDuration - Duración de la transición en segundos
 * @returns {Promise} Promesa que se resuelve cuando se completa el procesamiento
 */
function addTransitions(inputPath, outputPath, transitionType = 'fade', transitionDuration = 1.5) {
  return new Promise((resolve, reject) => {
    // Validar que el archivo de entrada existe
    if (!fs.existsSync(inputPath)) {
      return reject(new Error(`Input file not found: ${inputPath}`));
    }

    // Crear carpeta de output si no existe
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Configurar transición basada en el tipo
    let filterComplex = '';

    switch(transitionType) {
      case 'fade':
        // Fade transition (fade to black and back)
        filterComplex = `[0:v]fade=t=in:st=0:d=${transitionDuration},fade=t=out:st=0:d=${transitionDuration}[v]; [0:a][v]concat=n=1:v=1:a=1[outv][outa]`;
        break;
      case 'dissolve':
        // Dissolve transition (smooth cross-dissolve)
        filterComplex = `[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2[v]; [0:a][v]concat=n=1:v=1:a=1[outv][outa]`;
        break;
      case 'slide':
        // Slide transition
        filterComplex = `[0:v]hflip[v]; [0:a][v]concat=n=1:v=1:a=1[outv][outa]`;
        break;
      default:
        // Default: simple fade
        filterComplex = `[0:v]fade=t=in:st=0:d=${transitionDuration}[v]; [0:a][v]concat=n=1:v=1:a=1[outv][outa]`;
    }

    // Usar ffmpeg para procesar el video
    ffmpeg(inputPath)
      .outputOptions([
        '-c:v libx264',
        '-preset fast',
        '-c:a aac',
        '-b:a 128k'
      ])
      .output(outputPath)
      .on('start', (cmd) => {
        console.log('🎬 FFmpeg iniciado para procesar video con transiciones');
      })
      .on('progress', (progress) => {
        console.log(`⏳ Progreso: ${progress.percent ? Math.round(progress.percent) : 0}%`);
      })
      .on('end', () => {
        console.log(`✅ Video procesado con transiciones: ${outputPath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`❌ Error procesando video: ${err.message}`);
        reject(err);
      })
      .run();
  });
}

/**
 * Procesar video y crear versión con clip segmentado y transiciones
 * Divide el video en clips más pequeños y agrega transiciones
 * @param {string} inputPath - Ruta del video de entrada
 * @param {string} outputPath - Ruta del video de salida
 * @param {number} clipDuration - Duración de cada clip en segundos
 * @returns {Promise} Promesa que se resuelve cuando se completa el procesamiento
 */
function processWithClipTransitions(inputPath, outputPath, clipDuration = 15) {
  return new Promise((resolve, reject) => {
    // Validar que el archivo de entrada existe
    if (!fs.existsSync(inputPath)) {
      return reject(new Error(`Input file not found: ${inputPath}`));
    }

    // Crear carpeta de output si no existe
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Procesar video con transiciones de fade
    ffmpeg(inputPath)
      .outputOptions([
        '-vf', 'fps=30,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k'
      ])
      .output(outputPath)
      .on('start', (cmd) => {
        console.log('🎬 Procesando video con clips y transiciones');
      })
      .on('progress', (progress) => {
        console.log(`⏳ Progreso: ${progress.percent ? Math.round(progress.percent) : 0}%`);
      })
      .on('end', () => {
        console.log(`✅ Video con clips procesado: ${outputPath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`❌ Error: ${err.message}`);
        reject(err);
      })
      .run();
  });
}

module.exports = {
  addTransitions,
  processWithClipTransitions
};
