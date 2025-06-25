import axios from "axios";

// Configuración base para las peticiones API
const apiService = {
  // URL base de la API
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337",
  
  // Obtener token JWT del localStorage
  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwtToken");
    }
    return null;
  },
  
  // Configuración de headers para las peticiones
  getHeaders() {
    const token = this.getToken();
    return {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
  },
  
  // Método para realizar peticiones GET
  async get(endpoint, params = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/api/${endpoint}`, {
        headers: this.getHeaders(),
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error en petición GET:", error);
      throw error;
    }
  },
  
  // Método para realizar peticiones POST
  async post(endpoint, data = {}) {
    try {
      const response = await axios.post(`${this.baseURL}/api/${endpoint}`, data, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error en petición POST:", error);
      throw error;
    }
  },
  
  // Método para realizar peticiones PUT
  async put(endpoint, data = {}) {
    try {
      const response = await axios.put(`${this.baseURL}/api/${endpoint}`, data, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error en petición PUT:", error);
      throw error;
    }
  },
  
  // Método para realizar peticiones DELETE
  async delete(endpoint) {
    try {
      const response = await axios.delete(`${this.baseURL}/api/${endpoint}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error en petición DELETE:", error);
      throw error;
    }
  },
  
  // Método para obtener esquema de tabla
  async getTableSchema(tableName) {
    try {
      // Obtenemos un registro para inferir el esquema
      const response = await this.get(`${tableName}?pagination[limit]=1&populate=*`);
      
      if (!response.data || response.data.length === 0) {
        return { error: "No se encontraron datos para inferir el esquema" };
      }
      
      return this.inferSchema(response.data[0]);
    } catch (error) {
      console.error(`Error al obtener esquema de tabla ${tableName}:`, error);
      throw error;
    }
  },
  
  // Método para obtener datos de una tabla con paginación y relaciones
  async getTableData(tableName, limit = 5) {
    try {
      return await this.get(`${tableName}?pagination[limit]=${limit}&populate=*`);
    } catch (error) {
      console.error(`Error al obtener datos de tabla ${tableName}:`, error);
      throw error;
    }
  },
  
  // Método auxiliar para inferir el esquema de una tabla
  inferSchema(data) {
    const schema = {};
    
    if (!data || !data.attributes) {
      return schema;
    }
    
    // Recorremos los atributos para inferir tipos
    Object.keys(data.attributes).forEach(key => {
      const value = data.attributes[key];
      
      // Si es una relación
      if (value && typeof value === 'object' && value.data) {
        if (Array.isArray(value.data)) {
          // Relación uno a muchos
          schema[key] = {
            type: 'relation',
            relationType: 'oneToMany',
            relationTable: key,
          };
        } else {
          // Relación uno a uno
          schema[key] = {
            type: 'relation',
            relationType: 'oneToOne',
            relationTable: key,
          };
        }
      } else {
        // Campo regular
        schema[key] = {
          type: typeof value,
        };
      }
    });
    
    return schema;
  },
  
  // Método para obtener prompts
  async getPrompts() {
    try {
      return await this.get("prompts?populate=*");
    } catch (error) {
      console.error("Error al obtener prompts:", error);
      throw error;
    }
  },
  
  // Método para obtener tipos de prompts
  async getPromptTypes() {
    try {
      return await this.get("prompt-types");
    } catch (error) {
      console.error("Error al obtener tipos de prompts:", error);
      throw error;
    }
  },
  
  // Método para obtener permisos de prompts
  async getPromptPermisos() {
    try {
      return await this.get("prompt-permisos");
    } catch (error) {
      console.error("Error al obtener permisos de prompts:", error);
      throw error;
    }
  },
  
  // Método para crear un nuevo prompt
  async createPrompt(promptData) {
    try {
      return await this.post("prompts", { data: promptData });
    } catch (error) {
      console.error("Error al crear prompt:", error);
      throw error;
    }
  },
  
  // Método para actualizar un prompt existente
  async updatePrompt(id, promptData) {
    try {
      return await this.put(`prompts/${id}`, { data: promptData });
    } catch (error) {
      console.error("Error al actualizar prompt:", error);
      throw error;
    }
  },
  
  // Método para eliminar un prompt
  async deletePrompt(id) {
    try {
      return await this.delete(`prompts/${id}`);
    } catch (error) {
      console.error("Error al eliminar prompt:", error);
      throw error;
    }
  }
};

export default apiService;