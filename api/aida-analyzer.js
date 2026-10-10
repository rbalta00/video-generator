/**
 * AIDA Analyzer
 * Analiza videos y determina qué parte corresponde a cada fase del método AIDA
 *
 * AIDA = Atención, Interés, Deseo, Acción
 */

const path = require('path');
const fs = require('fs');

/**
 * Analizar video según método AIDA
 * @param {string} videoDuration - Duración del video en segundos
 * @param {string} title - Título del video
 * @param {string} description - Descripción del video
 * @returns {object} Análisis AIDA con timestamps
 */
function analyzeVideoAIDA(videoDuration, title = '', description = '') {
  // Convertir duración a segundos si es necesario
  const totalSeconds = typeof videoDuration === 'string'
    ? parseTimeToSeconds(videoDuration)
    : videoDuration;

  // Calcular distribución AIDA basada en duración
  const analysis = calculateAIDADistribution(totalSeconds);

  // Determinar el mensaje según el contenido
  const messages = generateAIDAMessages(title, description, analysis);

  return {
    totalDuration: totalSeconds,
    totalDurationFormatted: formatSeconds(totalSeconds),
    phases: analysis.phases,
    distribution: analysis.distribution,
    messages: messages,
    suggestions: generateSuggestions(analysis, title, description),
    timestamp: new Date().toISOString()
  };
}

/**
 * Calcular distribución de fases AIDA
 */
function calculateAIDADistribution(totalSeconds) {
  // Distribución recomendada para videos de marketing
  const distribution = {
    atencion: 0.15,      // 15% - Primeros segundos
    interes: 0.35,       // 35% - Problema/Beneficio
    deseo: 0.35,         // 35% - Características/Prueba
    accion: 0.15         // 15% - Call to action
  };

  const phases = {
    atencion: {
      phase: 'ATENCIÓN',
      description: 'Captar la atención del espectador',
      startTime: 0,
      endTime: Math.round(totalSeconds * distribution.atencion),
      duration: Math.round(totalSeconds * distribution.atencion),
      percentage: 15,
      tips: [
        'Hook potente en los primeros 3 segundos',
        'Pregunta provocadora',
        'Dato sorprendente',
        'Promesa clara'
      ]
    },
    interes: {
      phase: 'INTERÉS',
      description: 'Mantener el interés - Problema/Beneficio',
      startTime: Math.round(totalSeconds * distribution.atencion),
      endTime: Math.round(totalSeconds * (distribution.atencion + distribution.interes)),
      duration: Math.round(totalSeconds * distribution.interes),
      percentage: 35,
      tips: [
        'Explicar el problema del cliente',
        'Mostrar dolor/frustración',
        'Presentar beneficios clave',
        'Crear empatía'
      ]
    },
    deseo: {
      phase: 'DESEO',
      description: 'Crear deseo - Características/Prueba',
      startTime: Math.round(totalSeconds * (distribution.atencion + distribution.interes)),
      endTime: Math.round(totalSeconds * (1 - distribution.accion)),
      duration: Math.round(totalSeconds * distribution.deseo),
      percentage: 35,
      tips: [
        'Mostrar cómo funciona',
        'Demostración del producto',
        'Testimonios/Prueba social',
        'Casos de éxito',
        'Crear urgencia'
      ]
    },
    accion: {
      phase: 'ACCIÓN',
      description: 'Llamada a la acción',
      startTime: Math.round(totalSeconds * (1 - distribution.accion)),
      endTime: totalSeconds,
      duration: Math.round(totalSeconds * distribution.accion),
      percentage: 15,
      tips: [
        'CTA clara y directa',
        'Botón visible',
        'Link o número de teléfono',
        'Crear urgencia (limitado, descuento)',
        'Facilitar la acción'
      ]
    }
  };

  return {
    phases: phases,
    distribution: distribution
  };
}

/**
 * Generar mensajes basados en el análisis
 */
function generateAIDAMessages(title, description, analysis) {
  const messages = {
    atencion: generatePhaseMessage('ATENCIÓN', title, analysis.phases.atencion),
    interes: generatePhaseMessage('INTERÉS', description, analysis.phases.interes),
    deseo: generatePhaseMessage('DESEO', title, analysis.phases.deseo),
    accion: generatePhaseMessage('ACCIÓN', description, analysis.phases.accion)
  };

  return messages;
}

function generatePhaseMessage(phase, content, phaseData) {
  const messages = {
    'ATENCIÓN': `En los primeros ${phaseData.duration} segundos, necesitas un hook potente. "${content.substring(0, 50)}..." debe captar atención inmediatamente.`,
    'INTERÉS': `${phaseData.duration}s para mantener el interés. Enfócate en el problema y los beneficios principales.`,
    'DESEO': `${phaseData.duration}s para crear deseo. Muestra cómo funciona, demuestra el valor, trae testimonios.`,
    'ACCIÓN': `Últimos ${phaseData.duration}s son críticos. CTA clara: "Haz clic ahora", "Compra hoy", "Registrate gratis", etc.`
  };

  return messages[phase] || '';
}

/**
 * Generar sugerencias de mejora
 */
function generateSuggestions(analysis, title, description) {
  const suggestions = [];

  // Verificar duración total
  const totalDuration = analysis.phases.atencion.endTime;
  if (totalDuration < 30) {
    suggestions.push('🎯 Video muy corto - Considera 30-60 segundos para AIDA completo');
  } else if (totalDuration > 180) {
    suggestions.push('⏱️ Video largo - Considera dividir en clips más cortos');
  }

  // Verificar si hay título
  if (!title || title.length < 5) {
    suggestions.push('📝 Título muy corto - Crea un hook más impactante');
  }

  // Sugerencias por fase
  suggestions.push('✨ ATENCIÓN: Usa cambios de escena rápidos o música dinámica');
  suggestions.push('💡 INTERÉS: Mantén ritmo constante, evita pausas largas');
  suggestions.push('🔥 DESEO: Agrega subtítulos y gráficos para enfatizar beneficios');
  suggestions.push('🎬 ACCIÓN: Texto grande y color contrastante para CTA');

  return suggestions;
}

/**
 * Formatear segundos a MM:SS
 */
function formatSeconds(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Convertir tiempo en formato MM:SS a segundos
 */
function parseTimeToSeconds(timeString) {
  const parts = timeString.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return parseInt(timeString);
}

/**
 * Generar reporte HTML
 */
function generateAIDAReport(analysis, videoTitle) {
  const phases = analysis.phases;

  let html = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h1>📊 Análisis AIDA - ${videoTitle}</h1>
      <p>Duración total: <strong>${analysis.totalDurationFormatted}</strong></p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
  `;

  // Crear tarjeta para cada fase
  Object.values(phases).forEach(phase => {
    html += `
      <div style="border-left: 4px solid #667eea; padding: 15px; background: #f5f7ff;">
        <h3 style="margin: 0; color: #667eea;">🎯 ${phase.phase}</h3>
        <p style="margin: 10px 0; color: #666;">${phase.description}</p>
        <p><strong>${formatSeconds(phase.startTime)}</strong> → <strong>${formatSeconds(phase.endTime)}</strong></p>
        <p style="margin: 5px 0; font-weight: bold; color: #333;">${phase.percentage}% del video</p>
        <p style="margin: 10px 0; font-size: 12px; color: #666;">💡 ${phase.tips[0]}</p>
      </div>
    `;
  });

  html += `
      </div>

      <h2>📋 Sugerencias de Mejora</h2>
      <ul style="color: #666; line-height: 1.8;">
  `;

  analysis.suggestions.forEach(suggestion => {
    html += `<li>${suggestion}</li>`;
  });

  html += `
      </ul>

      <div style="background: #f0f4ff; padding: 20px; border-radius: 8px; margin-top: 30px;">
        <h3>📈 Próximos Pasos</h3>
        <ol style="color: #666;">
          <li>Revisa cada fase del video</li>
          <li>Aplica las sugerencias de mejora</li>
          <li>Re-procesa el video optimizado</li>
          <li>Compara resultados antes/después</li>
        </ol>
      </div>
    </div>
  `;

  return html;
}

module.exports = {
  analyzeVideoAIDA,
  generateAIDAReport,
  formatSeconds,
  parseTimeToSeconds
};
