/**
 * Hook personalizado para gestionar el estado y la lógica del automatizador
 */

import { useState, useEffect } from 'react';
import { 
  guardarPrompt,
  obtenerPrompts,
  obtenerPrompt,
  eliminarPrompt,
  obtenerEsquemas
} from '../services/promptService';
import {
  generarPreguntasIA,
  generarPromptFinalIA,
  proveedoresIA
} from '../services/iaProviders';

const useAutomatizador = () => {
  // Estado para el proceso de 4 pasos
  const [paso, setPaso] = useState(1);
  
  // Estado para cada paso
  const [descripcionProyecto, setDescripcionProyecto] = useState('');
  const [estructuraDatos, setEstructuraDatos] = useState('');
  const [esquemaJSON, setEsquemaJSON] = useState('');
  const [esquemasDisponibles, setEsquemasDisponibles] = useState([]);
  const [preguntasGeneradas, setPreguntasGeneradas] = useState([]);
  const [respuestasUsuario, setRespuestasUsuario] = useState({});
  const [promptFinal, setPromptFinal] = useState('');
  
  // Estado para el proveedor de IA seleccionado
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('openai');
  const [proveedoresDisponibles, setProveedoresDisponibles] = useState(proveedoresIA);
  
  // Estado de carga y errores
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  
  // Estado para prompts guardados
  const [promptsGuardados, setPromptsGuardados] = useState([]);

  // Manejar el cambio de paso
  const irAlPaso = (numeroPaso) => {
    if (numeroPaso === 2 && !descripcionProyecto.trim()) {
      setError('Por favor, ingresa una descripción del proyecto');
      return;
    }
    
    if (numeroPaso === 3) {
      if (!estructuraDatos.trim()) {
        setError('Por favor, ingresa alguna estructura o descripción');
        return;
      }
      
      generarPreguntasIAWithProveedor();
    }
    
    if (numeroPaso === 4) {
      const todasRespondidas = preguntasGeneradas.every(
        pregunta => respuestasUsuario[pregunta.id]
      );
      
      if (!todasRespondidas) {
        setError('Por favor, responde todas las preguntas');
        return;
      }
      
      generarPromptFinalIAWithProveedor();
    }
    
    setError(null);
    setMensaje(null);
    setPaso(numeroPaso);
  };

  // Función para generar preguntas usando IA con manejo de errores y fallback a otros proveedores
  const generarPreguntasIAWithProveedor = async () => {
    setCargando(true);
    setError(null);
    setMensaje(null);
    
    // Lista de proveedores a intentar en orden
    const proveedoresAIntentar = [
      proveedorSeleccionado, // Primero el seleccionado por el usuario
      ...proveedoresIA
        .filter(p => p.id !== proveedorSeleccionado)
        .map(p => p.id) // Luego el resto de proveedores
    ];
    
    let preguntasObtenidas = null;
    let proveedorExitoso = null;
    
    // Intentar con cada proveedor hasta que uno funcione
    for (const proveedor of proveedoresAIntentar) {
      try {
        const preguntas = await generarPreguntasIA(proveedor, descripcionProyecto, estructuraDatos);
        
        if (preguntas && preguntas.length > 0) {
          preguntasObtenidas = preguntas;
          proveedorExitoso = proveedor;
          break; // Salir del bucle si se obtuvieron preguntas exitosamente
        }
      } catch (err) {
        console.error(`Error al generar preguntas con ${proveedor}:`, err);
        // Continuar con el siguiente proveedor
      }
    }
    
    if (preguntasObtenidas) {
      // Si tuvimos éxito, actualizar el proveedor seleccionado si cambió
      if (proveedorExitoso !== proveedorSeleccionado) {
        setProveedorSeleccionado(proveedorExitoso);
        setMensaje(`Se utilizó ${proveedorExitoso} como alternativa para generar las preguntas`);
      }
      
      // Convertir a formato interno
      setPreguntasGeneradas(preguntasObtenidas.map((pregunta, index) => ({
        id: `pregunta_${index + 1}`,
        texto: pregunta
      })));
      
      // Reiniciar respuestas
      setRespuestasUsuario({});
      
      setMensaje(`Se generaron ${preguntasObtenidas.length} preguntas exitosamente con ${proveedorExitoso}`);
    } else {
      setError('No se pudieron generar preguntas con ningún proveedor de IA. Por favor, intenta de nuevo más tarde.');
    }
    
    setCargando(false);
  };

  // Función para generar el prompt final con manejo de errores y fallback a otros proveedores
  const generarPromptFinalIAWithProveedor = async () => {
    setCargando(true);
    setError(null);
    setMensaje(null);
    
    // Lista de proveedores a intentar en orden
    const proveedoresAIntentar = [
      proveedorSeleccionado, // Primero el seleccionado por el usuario
      ...proveedoresIA
        .filter(p => p.id !== proveedorSeleccionado)
        .map(p => p.id) // Luego el resto de proveedores
    ];
    
    let promptGenerado = null;
    let proveedorExitoso = null;
    
    // Intentar con cada proveedor hasta que uno funcione
    for (const proveedor of proveedoresAIntentar) {
      try {
        const prompt = await generarPromptFinalIA(
          proveedor,
          descripcionProyecto,
          estructuraDatos,
          respuestasUsuario
        );
        
        if (prompt) {
          promptGenerado = prompt;
          proveedorExitoso = proveedor;
          break; // Salir del bucle si se generó el prompt exitosamente
        }
      } catch (err) {
        console.error(`Error al generar prompt final con ${proveedor}:`, err);
        // Continuar con el siguiente proveedor
      }
    }
    
    if (promptGenerado) {
      // Si tuvimos éxito, actualizar el proveedor seleccionado si cambió
      if (proveedorExitoso !== proveedorSeleccionado) {
        setProveedorSeleccionado(proveedorExitoso);
        setMensaje(`Se utilizó ${proveedorExitoso} como alternativa para generar el prompt final`);
      }
      
      setPromptFinal(promptGenerado);
      setMensaje(`Prompt final generado exitosamente con ${proveedorExitoso}`);
    } else {
      setError('No se pudo generar el prompt final con ningún proveedor de IA. Por favor, intenta de nuevo más tarde.');
    }
    
    setCargando(false);
  };

  // Manejar las respuestas del usuario
  const manejarRespuesta = (preguntaId, respuesta) => {
    setRespuestasUsuario(prev => ({
      ...prev,
      [preguntaId]: respuesta
    }));
  };

  // Función para guardar el prompt generado
  const guardarPromptGenerado = async (nombrePersonalizado) => {
    setCargando(true);
    setError(null);
    setMensaje(null);
    
    try {
      await guardarPrompt({
        nombrePersonalizado,
        descripcionProyecto,
        estructuraDatos,
        preguntasGeneradas,
        respuestasUsuario,
        promptFinal,
        esquemaJSON,
        proveedor: proveedorSeleccionado
      });
      
      // Recargar prompts guardados después de guardar
      await cargarPromptsGuardados();
      
      setMensaje(`Prompt "${nombrePersonalizado}" guardado exitosamente`);
      return true;
    } catch (err) {
      setError('Error al guardar el prompt. Por favor, intenta de nuevo.');
      console.error('Error al guardar prompt:', err);
      return false;
    } finally {
      setCargando(false);
    }
  };

  // Cargar prompts guardados
  const cargarPromptsGuardados = async () => {
    try {
      const respuesta = await obtenerPrompts();
      
      if (respuesta && respuesta.data) {
        // Transformar los datos al formato esperado por el componente
        const prompts = respuesta.data.map(item => {
          // Para compatibilidad con diferentes versiones de la API
          if (item.attributes) {
            return {
              id: item.id,
              ...item.attributes
            };
          }
          return item;
        });
        
        setPromptsGuardados(prompts);
      } else {
        setPromptsGuardados([]);
      }
    } catch (err) {
      console.error('Error al cargar prompts guardados:', err);
      setPromptsGuardados([]);
    }
  };

  // Cargar un prompt específico
  const cargarPrompt = async (id) => {
    setCargando(true);
    setError(null);
    
    try {
      const prompt = await obtenerPrompt(id);
      
      // En este caso, solo necesitamos el texto del prompt
      setPromptFinal(prompt.prompt || '');
      
      // Ir al paso final
      setPaso(4);
      
      setMensaje(`Prompt "${prompt.nombrePrompt}" cargado exitosamente`);
    } catch (err) {
      setError('Error al cargar el prompt. Por favor, intenta de nuevo.');
      console.error('Error al cargar el prompt:', err);
    } finally {
      setCargando(false);
    }
  };

  // Eliminar un prompt
  const eliminarPromptGuardado = async (id) => {
    setCargando(true);
    setError(null);
    
    try {
      await eliminarPrompt(id);
      
      // Recargar prompts guardados
      await cargarPromptsGuardados();
      
      setMensaje('Prompt eliminado exitosamente');
    } catch (err) {
      setError('Error al eliminar el prompt. Por favor, intenta de nuevo.');
      console.error('Error al eliminar el prompt:', err);
    } finally {
      setCargando(false);
    }
  };

  // Cargar esquemas disponibles
  const cargarEsquemas = async () => {
    try {
      const esquemas = await obtenerEsquemas();
      setEsquemasDisponibles(esquemas || []);
    } catch (err) {
      console.error('Error al cargar esquemas:', err);
    }
  };

  // Seleccionar un esquema para usar como estructura de datos
  const seleccionarEsquema = (esquemaId) => {
    const esquemaSeleccionado = esquemasDisponibles.find(e => e.uid === esquemaId);
    
    if (esquemaSeleccionado) {
      const esquemaFormateado = JSON.stringify(esquemaSeleccionado, null, 2);
      setEsquemaJSON(esquemaFormateado);
      setEstructuraDatos(esquemaFormateado);
    }
  };

  // Reiniciar el proceso
  const reiniciarProceso = () => {
    setPaso(1);
    setDescripcionProyecto('');
    setEstructuraDatos('');
    setEsquemaJSON('');
    setPreguntasGeneradas([]);
    setRespuestasUsuario({});
    setPromptFinal('');
    setError(null);
    setMensaje(null);
    setProveedorSeleccionado('openai'); // Volver al proveedor predeterminado
  };
  
  // Cambiar proveedor de IA
  const cambiarProveedorIA = (nuevoProveedor) => {
    setProveedorSeleccionado(nuevoProveedor);
  };

  // Cargar prompts guardados y esquemas al montar el componente
  useEffect(() => {
    cargarPromptsGuardados();
    cargarEsquemas();
  }, []);

  return {
    paso,
    descripcionProyecto,
    setDescripcionProyecto,
    estructuraDatos,
    setEstructuraDatos,
    esquemaJSON,
    setEsquemaJSON,
    esquemasDisponibles,
    preguntasGeneradas,
    respuestasUsuario,
    promptFinal,
    setPromptFinal,
    cargando,
    error,
    mensaje,
    promptsGuardados,
    irAlPaso,
    manejarRespuesta,
    guardarPromptGenerado,
    cargarPrompt,
    eliminarPromptGuardado,
    seleccionarEsquema,
    reiniciarProceso,
    generarPreguntasIA: generarPreguntasIAWithProveedor,
    proveedorSeleccionado,
    proveedoresDisponibles,
    cambiarProveedorIA
  };
};

export default useAutomatizador;