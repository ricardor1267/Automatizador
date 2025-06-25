/**
 * Servicio para interactuar con la API de OpenAI
 */

const OPENAI_API_KEY = "";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/**
 * Función para enviar una solicitud a OpenAI
 * @param {Array} messages - Array de mensajes para enviar a OpenAI
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const enviarSolicitudOpenAI = async (messages) => {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 3000 // Aumentado a 3000 tokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error en la petición a OpenAI');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en la petición a OpenAI:', error);
    throw error;
  }
};

/**
 * Función para generar preguntas basadas en la descripción del proyecto y estructura de datos
 * @param {string} descripcionProyecto - Descripción del proyecto
 * @param {string} estructuraDatos - Estructura de datos JSON
 * @returns {Promise<Array>} - Array de preguntas generadas
 */
export const generarPreguntasIA = async (descripcionProyecto, estructuraDatos) => {
  const messages = [
    {
      role: "system",
      content: "Eres un asistente especializado en el desarrollo de software. Tu tarea es generar preguntas clave para clarificar los requisitos de un proyecto basándote en una descripción inicial y una estructura de datos."
    },
    {
      role: "user",
      content: `Necesito desarrollar el siguiente proyecto:\n\n${descripcionProyecto}\n\nLa estructura de datos es la siguiente:\n\n${estructuraDatos}\n\nPor favor, genera entre 5 y 8 preguntas clave que necesitarías que te respondan para clarificar los requisitos y poder desarrollar este proyecto adecuadamente. Estas preguntas deben abarcar aspectos técnicos, funcionales y de experiencia de usuario.`
    }
  ];

  try {
    const response = await enviarSolicitudOpenAI(messages);
    console.log("Respuesta de OpenAI (preguntas):", response);
    const contenido = response.choices[0].message.content;
    
    // Extraer preguntas del texto (asumiendo que están numeradas o en formato de lista)
    const preguntas = contenido
      .split('\n')
      .filter(linea => linea.trim().match(/^(\d+[\.]|\-|\*|\•)\s+/) || linea.includes('?'))
      .map(linea => linea.replace(/^(\d+[\.]|\-|\*|\•)\s+/, '').trim())
      .filter(pregunta => pregunta.length > 0);
    
    console.log("Preguntas extraídas:", preguntas);
    
    // Si no se detectaron preguntas en formato de lista, dividimos el texto en oraciones
    // que terminen con signo de interrogación
    if (preguntas.length === 0) {
      const preguntasAlternativas = contenido
        .split(/(?<=\?)\s+/)
        .filter(oracion => oracion.trim().endsWith('?'))
        .map(oracion => oracion.trim());
      
      console.log("Preguntas alternativas:", preguntasAlternativas);
      return preguntasAlternativas.length > 0 ? preguntasAlternativas : [contenido];
    }
    
    return preguntas;
  } catch (error) {
    console.error('Error al generar preguntas con OpenAI:', error);
    throw error;
  }
};

/**
 * Función para generar el prompt final basado en todas las respuestas
 * @param {string} descripcionProyecto - Descripción del proyecto
 * @param {string} estructuraDatos - Estructura de datos JSON
 * @param {Object} respuestasUsuario - Objeto con las respuestas del usuario
 * @returns {Promise<string>} - Prompt final generado
 */
export const generarPromptFinalIA = async (descripcionProyecto, estructuraDatos, respuestasUsuario) => {
  // Convertir el objeto de respuestas a un formato de texto
  const respuestasTexto = Object.entries(respuestasUsuario)
    .map(([id, respuesta]) => `${id.replace('pregunta_', 'Pregunta ')}: ${respuesta}`)
    .join('\n\n');

  const messages = [
    {
      role: "system",
      content: "Eres un asistente especializado en crear prompts en español, detallados para el desarrollo de software con IA. Tu tarea es generar un prompt completo y estructurado basado en una descripción de proyecto, una estructura de datos y respuestas a preguntas clave. Al comienzo del prompt, siempre incluye esta información específica como texto de conocimiento delimitado por guiones."
    },
    {
      role: "user",
      content: `Por favor, genera un prompt detallado para una IA de desarrollo de software basado en la siguiente información:\n\n` +
        `## Descripción del proyecto:\n${descripcionProyecto}\n\n` +
        `## Estructura de datos:\n${estructuraDatos}\n\n` +
        `## Respuestas a preguntas clave:\n${respuestasTexto}\n\n` +
        `Crea un prompt completo, detallado y bien estructurado que pueda ser utilizado para guiar a una IA en el desarrollo de este proyecto. El prompt debe incluir todos los requisitos, limitaciones técnicas, consideraciones de diseño y cualquier otra información relevante extraída de los datos proporcionados.\n\n` +
        `Además, agrega al comienzo del prompt el siguiente texto como texto de conocimiento, delimitado por guiones:\n` +
        `-------------------------------------------------------------\n` +
        `Este es un módulo desarrollado en Next.js que se conecta a un backend de Strapi y consulta su API.\n` +
        `La URL base de la API está definida como:\n` +
        `const apiUrl = process.env.NEXT_PUBLIC_API_URL;\n` +
        `El token de autenticación se obtiene desde:\n` +
        `const token = localStorage.getItem("jwtToken");\n` +
        `Debes seguir las buenas prácticas de desarrollo, manteniendo la lógica de negocio separada del diseño. Intenta mantener todo el módulo dentro de una sola carpeta para simplificar el despliegue: el objetivo es que la migración a producción sea tan simple como copiar la carpeta del punto A al punto B.\n` +
        `Cada vez que realices una modificación, crea un archivo de texto con un resumen de los cambios realizados y una lista de los archivos modificados en esa iteración. Además, trata cada modificación como una nueva versión del módulo. Comienza con la versión v1 y aumenta el número de versión con cada cambio (v2, v3, etc.). Incluye el número de versión en el nombre del archivo de texto.\n` +
        `-------------------------------------------------------------`
    }
  ];

  try {
    const response = await enviarSolicitudOpenAI(messages);
    console.log("Respuesta de OpenAI (prompt final):", response);
    return `${response.choices[0].message.content}\n\n## Estructura de datos:\n${estructuraDatos}\n\n`;

  } catch (error) {
    console.error('Error al generar prompt final con OpenAI:', error);
    throw error;
  }
};
