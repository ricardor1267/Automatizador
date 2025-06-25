import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiService from "../services/api";

const usePrompts = () => {
  // Estados para gestionar prompts, tipos y permisos
  const [prompts, setPrompts] = useState([]);
  const [promptTypes, setPromptTypes] = useState([]);
  const [promptPermisos, setPromptPermisos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado para el prompt seleccionado para edición
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  
  // Estado para el formulario de creación/edición
  const [formData, setFormData] = useState({
    nombrePrompt: "",
    prompt: "",
    prompt_type: null,
    prompt_permiso: null,
    instrucciones: null,
  });
  
  // Función para cargar los prompts desde la API
  const fetchPrompts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getPrompts();
      if (response && response.data) {
        // Procesar para un formato más fácil de usar
        const processedPrompts = response.data.map(item => ({
          id: item.id,
          ...item.attributes,
          prompt_type: item.attributes.prompt_type?.data ? {
            id: item.attributes.prompt_type.data.id,
            ...item.attributes.prompt_type.data.attributes
          } : null,
          prompt_permiso: item.attributes.prompt_permiso?.data ? {
            id: item.attributes.prompt_permiso.data.id,
            ...item.attributes.prompt_permiso.data.attributes
          } : null
        }));
        
        setPrompts(processedPrompts);
      } else {
        setPrompts([]);
      }
    } catch (err) {
      console.error("Error al cargar prompts:", err);
      setError(err.response?.data?.error?.message || err.message || "Error al cargar prompts");
      toast.error("Error al cargar prompts");
    } finally {
      setLoading(false);
    }
  };
  
  // Función para cargar los tipos de prompts
  const fetchPromptTypes = async () => {
    try {
      const response = await apiService.getPromptTypes();
      if (response && response.data) {
        const types = response.data.map(item => ({
          id: item.id,
          ...item.attributes
        }));
        setPromptTypes(types);
      } else {
        setPromptTypes([]);
      }
    } catch (err) {
      console.error("Error al cargar tipos de prompts:", err);
      toast.error("Error al cargar tipos de prompts");
    }
  };
  
  // Función para cargar los permisos de prompts
  const fetchPromptPermisos = async () => {
    try {
      const response = await apiService.getPromptPermisos();
      if (response && response.data) {
        const permisos = response.data.map(item => ({
          id: item.id,
          ...item.attributes
        }));
        setPromptPermisos(permisos);
      } else {
        setPromptPermisos([]);
      }
    } catch (err) {
      console.error("Error al cargar permisos de prompts:", err);
      toast.error("Error al cargar permisos de prompts");
    }
  };
  
  // Cargar datos iniciales
  useEffect(() => {
    fetchPrompts();
    fetchPromptTypes();
    fetchPromptPermisos();
  }, []);
  
  // Función para seleccionar un prompt para edición
  const selectPromptForEdit = (prompt) => {
    setSelectedPrompt(prompt);
    setFormData({
      nombrePrompt: prompt.nombrePrompt || "",
      prompt: prompt.prompt || "",
      prompt_type: prompt.prompt_type?.id || null,
      prompt_permiso: prompt.prompt_permiso?.id || null,
      instrucciones: prompt.instrucciones || null,
    });
  };
  
  // Función para limpiar el formulario
  const resetForm = () => {
    setSelectedPrompt(null);
    setFormData({
      nombrePrompt: "",
      prompt: "",
      prompt_type: null,
      prompt_permiso: null,
      instrucciones: null,
    });
  };
  
  // Función para manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Función para guardar un prompt (crear o actualizar)
  const savePrompt = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const promptData = {
        ...formData,
        // Convertir IDs de relaciones a formato adecuado para la API
        prompt_type: formData.prompt_type ? {
          connect: [formData.prompt_type]
        } : null,
        prompt_permiso: formData.prompt_permiso ? {
          connect: [formData.prompt_permiso]
        } : null,
      };
      
      let response;
      if (selectedPrompt) {
        // Actualizar existente
        response = await apiService.updatePrompt(selectedPrompt.id, promptData);
        toast.success("Prompt actualizado correctamente");
      } else {
        // Crear nuevo
        response = await apiService.createPrompt(promptData);
        toast.success("Prompt creado correctamente");
      }
      
      // Recargar la lista actualizada
      fetchPrompts();
      resetForm();
      
      return response;
    } catch (err) {
      console.error("Error al guardar prompt:", err);
      setError(err.response?.data?.error?.message || err.message || "Error al guardar prompt");
      toast.error("Error al guardar prompt");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Función para eliminar un prompt
  const deletePrompt = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiService.deletePrompt(id);
      toast.success("Prompt eliminado correctamente");
      fetchPrompts();
    } catch (err) {
      console.error("Error al eliminar prompt:", err);
      setError(err.response?.data?.error?.message || err.message || "Error al eliminar prompt");
      toast.error("Error al eliminar prompt");
    } finally {
      setLoading(false);
    }
  };
  
  // Función para cargar datos de esquema de tabla
  const [tableName, setTableName] = useState("");
  const [tableLimit, setTableLimit] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [tableSchema, setTableSchema] = useState(null);
  const [loadingTable, setLoadingTable] = useState(false);
  const [tableError, setTableError] = useState(null);
  
  const fetchTableData = async () => {
    if (!tableName) {
      return;
    }
    
    setLoadingTable(true);
    setTableError(null);
    
    try {
      const response = await apiService.getTableData(tableName, tableLimit);
      
      if (response && response.data) {
        // Procesar los datos para un formato más usable
        const processedData = response.data.map(item => ({
          id: item.id,
          ...item.attributes
        }));
        
        setTableData(processedData);
        
        // Inferir el esquema de la tabla
        if (processedData.length > 0) {
          const schema = {};
          Object.keys(processedData[0]).forEach(key => {
            if (key === 'id') {
              schema[key] = { type: 'number' };
              return;
            }
            
            const value = processedData[0][key];
            if (value && typeof value === 'object') {
              schema[key] = { 
                type: 'relation',
                relationTable: key 
              };
            } else {
              schema[key] = { type: typeof value };
            }
          });
          
          setTableSchema(schema);
        }
      } else {
        setTableData([]);
        setTableSchema(null);
      }
    } catch (err) {
      console.error("Error al cargar datos de la tabla:", err);
      setTableError(err.response?.data?.error?.message || err.message || "Error al cargar datos de la tabla");
      toast.error("Error al cargar datos de la tabla");
    } finally {
      setLoadingTable(false);
    }
  };
  
  // Función para generar texto con el esquema de la tabla
  const generateSchemaText = () => {
    if (!tableSchema) return "";
    
    let schemaText = `Tabla: ${tableName}\n`;
    schemaText += JSON.stringify(tableSchema, null, 2);
    
    // Agregar datos de ejemplo si hay disponibles
    if (tableData.length > 0) {
      schemaText += "\n\ndatos de ejemplo:\n\n";
      schemaText += JSON.stringify(tableData, null, 2);
    }
    
    return schemaText;
  };
  
  return {
    prompts,
    promptTypes,
    promptPermisos,
    loading,
    error,
    selectedPrompt,
    formData,
    fetchPrompts,
    selectPromptForEdit,
    resetForm,
    handleFormChange,
    savePrompt,
    deletePrompt,
    tableName,
    setTableName,
    tableLimit,
    setTableLimit,
    tableData,
    tableSchema,
    loadingTable,
    tableError,
    fetchTableData,
    generateSchemaText
  };
};

export default usePrompts;