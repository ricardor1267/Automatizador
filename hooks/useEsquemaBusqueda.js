/**
 * Hook personalizado para gestionar la búsqueda de esquemas de tablas
 */
import { useState } from 'react';
import { toast } from 'react-toastify';
import useTablaData from "@/app/(DashboardLayout)/mining/esquemas/hooks/useTablaData";

const useEsquemaBusqueda = (setEstructuraDatos) => {
  // Usar el hook existente de useTablaData
  const {
    nombreTabla,
    setNombreTabla,
    limit,
    setLimit,
    loading: cargandoEsquema,
    error: errorEsquema,
    fetchData: buscarDatos,
    formatearEsquemaYDatos
  } = useTablaData('', 1);
  
  /**
   * Busca el esquema de la tabla y actualiza el campo de estructura de datos
   */
  const buscarEsquema = async () => {
    if (!nombreTabla) {
      toast.error('Por favor, ingresa el nombre de la tabla');
      return;
    }
    
    try {
      // Buscar datos en la API
      await buscarDatos();
      
      // Formatear el esquema y los datos para el campo de estructura
      const esquemaFormateado = formatearEsquemaYDatos();
      
      if (esquemaFormateado) {
        // Actualizar el campo de estructura de datos con el esquema obtenido
        setEstructuraDatos(esquemaFormateado);
        toast.success(`Esquema de la tabla ${nombreTabla} obtenido exitosamente`);
      } else {
        toast.warning(`No se encontraron datos para la tabla ${nombreTabla}`);
      }
    } catch (err) {
      console.error('Error al obtener esquema:', err);
      toast.error(`Error al obtener el esquema: ${err.message}`);
    }
  };
  
  return {
    nombreTabla,
    setNombreTabla,
    limitRegistros: limit,
    setLimitRegistros: setLimit,
    cargandoEsquema,
    errorEsquema,
    buscarEsquema
  };
};

export default useEsquemaBusqueda;