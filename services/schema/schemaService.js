/**
 * Servicio para obtener el esquema de datos de una tabla
 */
import axios from 'axios';

// URL base de la API
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

/**
 * Obtiene el esquema de una tabla específica
 * @param {string} nombreTabla - Nombre de la tabla a consultar
 * @param {number} limit - Límite de registros a obtener (por defecto 1)
 * @returns {Promise<Object>} - Datos del esquema y registros de ejemplo
 */
export const obtenerEsquemaTabla = async (nombreTabla, limit = 1) => {
  try {
    // Obtener token JWT del localStorage
    const token = localStorage.getItem("jwtToken");
    
    if (!token) {
      throw new Error("No se encontró token de autenticación");
    }
    
    // Consultar la API para obtener registros
    const response = await axios.get(
      `${apiUrl}/api/${nombreTabla}?pagination[limit]=${limit}&populate=*`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    // Procesar los datos para obtener relaciones
    const relationTables = new Set(); // Usar Set para evitar duplicados
    const dataSchema = {};
    
    if (response.data.data && response.data.data.length > 0) {
      const firstItem = response.data.data[0];
      
      // Procesar atributos regulares
      Object.keys(firstItem.attributes).forEach(key => {
        const value = firstItem.attributes[key];
        
        // Si es un objeto con propiedad data, es una relación
        if (value && typeof value === 'object' && value.data) {
          if (Array.isArray(value.data)) {
            // Relación uno a muchos
            dataSchema[key] = {
              type: 'relation',
              relationType: 'oneToMany',
              relationTable: key,
            };
            
            // Añadir variantes del nombre de la tabla
            addTableNameVariants(relationTables, key);
            
          } else if (value.data) {
            // Relación uno a uno
            dataSchema[key] = {
              type: 'relation',
              relationType: 'oneToOne',
              relationTable: key,
            };
            
            // Añadir variantes del nombre de la tabla
            addTableNameVariants(relationTables, key);
          }
        } else {
          // Campo regular
          dataSchema[key] = {
            type: typeof value,
          };
        }
      });
      
      // Función para añadir diferentes variantes del nombre de la tabla
      function addTableNameVariants(tableSet, tableName) {
        // Variante original
        tableSet.add(tableName);
        
        // Variante con plural (agregar 's')
        tableSet.add(tableName + 's');
        
        // Si tiene guiones bajos, reemplazarlos por guiones y añadir 's'
        if (tableName.includes('_')) {
          const transformedName = tableName.replace(/_/g, '-') + 's';
          tableSet.add(transformedName);
        }
      }
      
      // Obtener esquemas de las tablas relacionadas
      const relationSchemasData = {};
      
      // Convertir el Set a Array para poder mapearlo
      const relationTablesArray = Array.from(relationTables);
      
      const fetchRelationSchemas = async () => {
        // Usamos Promise.allSettled para no bloquear si falla alguna consulta
        const relationPromises = relationTablesArray.map(async (tableName) => {
          try {
            // Intentamos obtener al menos un registro para inferir el esquema
            const relationResponse = await axios.get(
              `${apiUrl}/api/${tableName}?pagination[limit]=1`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            
            if (relationResponse.data.data && relationResponse.data.data.length > 0) {
              const relationSchema = {};
              const relationItem = relationResponse.data.data[0];
              
              // Extraer esquema de los atributos
              Object.keys(relationItem.attributes).forEach(attrKey => {
                const attrValue = relationItem.attributes[attrKey];
                
                if (attrValue && typeof attrValue === 'object' && attrValue.data) {
                  // Es una relación anidada
                  relationSchema[attrKey] = {
                    type: 'relation',
                    relationType: Array.isArray(attrValue.data) ? 'oneToMany' : 'oneToOne',
                    relationTable: attrKey,
                  };
                } else {
                  // Campo regular
                  relationSchema[attrKey] = {
                    type: typeof attrValue,
                  };
                }
              });
              
              relationSchemasData[tableName] = relationSchema;
            }
          } catch (err) {
            console.error(`Error al obtener esquema de tabla relacionada ${tableName}:`, err);
            // Simplemente registramos el error pero continuamos con las demás tablas
            relationSchemasData[tableName] = { error: "No se pudo obtener el esquema" };
          }
        });
        
        await Promise.allSettled(relationPromises);
        return relationSchemasData;
      };
      
      const relationSchemas = relationTables.size > 0 
        ? await fetchRelationSchemas() 
        : {};
      
      // Procesar los datos para una vista legible
      const processedData = response.data.data.map(item => {
        const result = {
          id: item.id,
        };
        
        // Procesar atributos regulares
        Object.keys(item.attributes).forEach(key => {
          const value = item.attributes[key];
          
          // Si es una relación
          if (value && typeof value === 'object' && value.data) {
            if (Array.isArray(value.data)) {
              // Relación uno a muchos
              result[key] = value.data.map(rel => ({
                id: rel.id,
                ...rel.attributes,
              }));
            } else if (value.data) {
              // Relación uno a uno
              result[key] = {
                id: value.data.id,
                ...value.data.attributes,
              };
            }
          } else {
            // Campo regular
            result[key] = value;
          }
        });
        
        return result;
      });
      
      // Preparar el resultado completo
      return {
        schema: dataSchema,
        relationSchemas,
        data: processedData
      };
    }
    
    return {
      schema: {},
      relationSchemas: {},
      data: []
    };
    
  } catch (err) {
    console.error("Error al obtener el esquema:", err);
    throw new Error(
      err.response?.data?.error?.message || 
      err.message || 
      "Error al cargar datos desde la API"
    );
  }
};

/**
 * Formatea el esquema y los datos para mostrarlos en un formato JSON legible
 * @param {Object} resultado - Resultado de obtenerEsquemaTabla
 * @param {string} nombreTabla - Nombre de la tabla consultada
 * @returns {string} - Texto formateado en JSON
 */
export const formatearEsquema = (resultado, nombreTabla) => {
  if (!resultado || !resultado.schema) {
    return "";
  }
  
  let contenido = `Tabla: ${nombreTabla}\n`;
  contenido += JSON.stringify(resultado.schema, null, 2);
  
  // Agregar las tablas relacionadas si existen
  if (Object.keys(resultado.relationSchemas).length > 0) {
    contenido += "\n\n--- Esquemas de Tablas Relacionadas ---\n";
    Object.keys(resultado.relationSchemas)
      .filter(tableName => !resultado.relationSchemas[tableName].error)
      .forEach(tableName => {
        contenido += `\n\nTabla: ${tableName}\n`;
        contenido += JSON.stringify(resultado.relationSchemas[tableName], null, 2);
      });
  }
  
  // Agregar datos de ejemplo
  if (resultado.data && resultado.data.length > 0) {
    contenido += "\n\ndatos de ejemplo:\n\n";
    contenido += JSON.stringify(resultado.data, null, 2);
  }
  
  return contenido;
};
