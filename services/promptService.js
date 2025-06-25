/**
 * Servicio para gestionar los prompts en la API
 */
import apiService from './api';

/**
 * Obtiene todos los prompts con sus relaciones
 * @returns {Promise<Array>} Lista de prompts
 */
export const obtenerPrompts = async () => {
  try {
    // Filtrar para obtener solo los prompts de tipo Desarrollo (ID: 3)
    const response = await apiService.get("prompts?populate=*&sort=createdAt:desc&filters[prompt_type][id][$eq]=3");
    return response;
  } catch (error) {
    console.error("Error al obtener prompts:", error);
    throw error;
  }
};

/**
 * Obtiene un prompt específico por su ID
 * @param {number} id ID del prompt a obtener
 * @returns {Promise<Object>} Datos del prompt
 */
export const obtenerPrompt = async (id) => {
  try {
    const response = await apiService.get(`prompts/${id}?populate=*`);
    
    // Si la respuesta tiene estructura de Strapi v4, extraer los datos
    if (response.data && response.data.attributes) {
      return {
        id: response.data.id,
        ...response.data.attributes
      };
    }
    
    return response.data || {};
  } catch (error) {
    console.error(`Error al obtener prompt con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Guarda un nuevo prompt en la API
 * @param {Object} promptData Datos del prompt a guardar
 * @returns {Promise<Object>} Respuesta de la API
 */
export const guardarPrompt = async (promptData) => {
  try {
    // Extraer el nombre personalizado
    const { nombrePersonalizado, promptFinal } = promptData;
    
    // Preparar los datos para Strapi con el formato correcto
    const dataToSave = {
      nombrePrompt: nombrePersonalizado,
      prompt: promptFinal,
      // Establecer valores por defecto para tipo y permiso
      prompt_type: 3, // ID 3 para tipo "Desarrollo"
      prompt_permiso: 2, // ID 2 para permiso "Privado"
      metadata: {
        proveedor_ia: promptData.proveedor || 'openai' // Guardar el proveedor utilizado
      }
    };
    
    // Guardar instrucciones como objeto JSON si existen
    if (promptData.descripcionProyecto || promptData.estructuraDatos) {
      dataToSave.instrucciones = {
        descripcion: promptData.descripcionProyecto,
        estructura: promptData.estructuraDatos,
        preguntas: promptData.preguntasGeneradas,
        respuestas: promptData.respuestasUsuario,
        proveedor: promptData.proveedor || 'openai' // Incluir proveedor también en instrucciones
      };
    }
    
    const response = await apiService.createPrompt(dataToSave);
    return response;
  } catch (error) {
    console.error("Error al guardar prompt:", error);
    throw error;
  }
};

/**
 * Elimina un prompt específico
 * @param {number} id ID del prompt a eliminar
 * @returns {Promise<Object>} Respuesta de la API
 */
export const eliminarPrompt = async (id) => {
  try {
    const response = await apiService.deletePrompt(id);
    return response;
  } catch (error) {
    console.error(`Error al eliminar prompt con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene esquemas disponibles
 * @returns {Promise<Array>} Lista de esquemas
 */
export const obtenerEsquemas = async () => {
  try {
    // Aquí debemos obtener los esquemas de las tablas relacionadas
    // para el módulo de automatizador de prompts
    const tablas = [
      { uid: 'api::prompt.prompt', nombre: 'prompts' },
      { uid: 'api::prompt-type.prompt-type', nombre: 'prompt-types' },
      { uid: 'api::prompt-permiso.prompt-permiso', nombre: 'prompt-permisos' }
    ];
    
    // Obtener esquemas para cada tabla
    const esquemas = await Promise.all(
      tablas.map(async (tabla) => {
        try {
          // Intentar obtener el esquema utilizando la API
          const esquema = await apiService.getTableSchema(tabla.nombre);
          return {
            ...tabla,
            esquema,
            error: null
          };
        } catch (err) {
          console.error(`Error al obtener esquema para ${tabla.nombre}:`, err);
          return {
            ...tabla,
            esquema: null,
            error: err.message
          };
        }
      })
    );
    
    return esquemas.filter(e => e.esquema !== null);
  } catch (error) {
    console.error("Error al obtener esquemas:", error);
    return [];
  }
};