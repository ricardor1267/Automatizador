"use client";

import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importar componentes
import ProgressSteps from './components/ProgressSteps';
import DescripcionProyecto from './components/DescripcionProyecto';
import EstructuraDatos from './components/EstructuraDatos';
import GeneracionPreguntas from './components/GeneracionPreguntas';
import PromptFinal from './components/PromptFinal';
import PromptsGuardados from './components/PromptsGuardados';

// Importar hook personalizado
import useAutomatizador from './hooks/useAutomatizador';

// Importar estilos personalizados
import './automatizador.css';

const Automatizador = () => {
  const {
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
    generarPreguntasIA,
    proveedorSeleccionado,
    proveedoresDisponibles,
    cambiarProveedorIA
  } = useAutomatizador();

  // Función para mostrar mensajes toast
  const mostrarMensaje = (mensaje, tipo = 'success') => {
    if (tipo === 'success') {
      toast.success(mensaje);
    } else if (tipo === 'error') {
      toast.error(mensaje);
    } else {
      toast.info(mensaje);
    }
  };

  // Función para guardar prompt con nombre personalizado
  const guardarPrompt = async (nombrePersonalizado) => {
    const resultado = await guardarPromptGenerado(nombrePersonalizado);
    if (resultado) {
      mostrarMensaje(`Prompt "${nombrePersonalizado}" guardado correctamente`);
    }
  };

  return (
    <div className="automatizador-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Container fluid>
        <Row>
          <Col>
            <Card className="mb-4">
              <CardBody>
                <h2 className="card-title mb-0">Automatizador de Prompts para IA</h2>
                <p className="text-muted mt-2">
                  Crea prompts optimizados para IA en 4 sencillos pasos
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
        
        <Row>
          <Col>
            <ProgressSteps 
              pasoActual={paso}
              irAlPaso={irAlPaso}
            />
          </Col>
        </Row>
        
        <Row className="gx-4">
          <Col lg={8}>
            {/* Contenido principal basado en el paso actual */}
            {paso === 1 && (
              <DescripcionProyecto
                descripcionProyecto={descripcionProyecto}
                setDescripcionProyecto={setDescripcionProyecto}
                error={error}
                irAlPaso={irAlPaso}
              />
            )}
            
            {paso === 2 && (
              <EstructuraDatos
                estructuraDatos={estructuraDatos}
                setEstructuraDatos={setEstructuraDatos}
                esquemaJSON={esquemaJSON}
                setEsquemaJSON={setEsquemaJSON}
                esquemasDisponibles={esquemasDisponibles}
                seleccionarEsquema={seleccionarEsquema}
                error={error}
                irAlPaso={irAlPaso}
              />
            )}
            
            {paso === 3 && (
              <GeneracionPreguntas
                preguntasGeneradas={preguntasGeneradas}
                respuestasUsuario={respuestasUsuario}
                manejarRespuesta={manejarRespuesta}
                cargando={cargando}
                error={error}
                mensaje={mensaje}
                irAlPaso={irAlPaso}
                generarPreguntasIA={generarPreguntasIA}
                proveedorSeleccionado={proveedorSeleccionado}
                proveedoresDisponibles={proveedoresDisponibles}
                cambiarProveedorIA={cambiarProveedorIA}
              />
            )}
            
            {paso === 4 && (
              <PromptFinal
                promptFinal={promptFinal}
                setPromptFinal={setPromptFinal}
                cargando={cargando}
                error={error}
                mensaje={mensaje}
                guardarPrompt={guardarPrompt}
                irAlPaso={irAlPaso}
                reiniciarProceso={reiniciarProceso}
                proveedorSeleccionado={proveedorSeleccionado}
                proveedoresDisponibles={proveedoresDisponibles}
                cambiarProveedorIA={cambiarProveedorIA}
              />
            )}
          </Col>
          
          <Col lg={4}>
            <PromptsGuardados
              promptsGuardados={promptsGuardados}
              cargarPrompt={cargarPrompt}
              eliminarPromptGuardado={eliminarPromptGuardado}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Automatizador;