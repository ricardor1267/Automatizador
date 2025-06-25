/**
 * Componente para el paso 3: Generación de Preguntas por IA
 */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner,
  Row,
  Col
} from 'reactstrap';
import ProveedorSelector from './ProveedorSelector';

const GeneracionPreguntas = ({
  preguntasGeneradas,
  respuestasUsuario,
  manejarRespuesta,
  cargando,
  error,
  mensaje,
  irAlPaso,
  generarPreguntasIA,
  proveedorSeleccionado,
  proveedoresDisponibles,
  cambiarProveedorIA
}) => {
  const [verProveedores, setVerProveedores] = useState(false);

  // Verificar si todas las preguntas han sido respondidas
  const todasRespondidas = preguntasGeneradas.every(
    pregunta => respuestasUsuario[pregunta.id]
  );

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4" className="mb-4">Paso 3: Preguntas Generadas por IA</CardTitle>
        
        {error && (
          <Alert color="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        {mensaje && (
          <Alert color="info" className="mb-4">
            {mensaje}
          </Alert>
        )}
        
        {cargando ? (
          <div className="text-center py-5">
            <Spinner color="primary" size="lg" />
            <p className="mt-3">Generando preguntas inteligentes...</p>
          </div>
        ) : (
          <>
            {preguntasGeneradas.length > 0 ? (
              <>
                <p className="text-muted mb-4">
                  Responde las siguientes preguntas para refinar el prompt final. 
                  Estas preguntas han sido generadas automáticamente por {proveedorSeleccionado === 'openai' ? 'OpenAI' : 
                    proveedorSeleccionado === 'anthropic' ? 'Anthropic Claude' : 
                    proveedorSeleccionado === 'gemini' ? 'Google Gemini' : 'IA'}.
                </p>
                
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-2">Proveedor utilizado:</span>
                    <span className="badge bg-primary">
                      {proveedoresDisponibles.find(p => p.id === proveedorSeleccionado)?.nombre || 'IA'}
                    </span>
                    <Button 
                      color="link" 
                      size="sm" 
                      className="ms-2" 
                      onClick={() => setVerProveedores(!verProveedores)}
                    >
                      {verProveedores ? 'Ocultar opciones' : 'Cambiar'}
                    </Button>
                  </div>
                  
                  {verProveedores && (
                    <ProveedorSelector 
                      proveedores={proveedoresDisponibles}
                      seleccionado={proveedorSeleccionado}
                      onChange={cambiarProveedorIA}
                    />
                  )}
                </div>
                
                {preguntasGeneradas.map((pregunta) => (
                  <div key={pregunta.id} className="pregunta-card mb-4">
                    <div className="p-3 bg-light">
                      <strong>{pregunta.texto}</strong>
                    </div>
                    <div className="p-3">
                      <FormGroup>
                        <Input
                          type="textarea"
                          rows="3"
                          value={respuestasUsuario[pregunta.id] || ''}
                          onChange={(e) => manejarRespuesta(pregunta.id, e.target.value)}
                          placeholder="Tu respuesta..."
                        />
                      </FormGroup>
                    </div>
                  </div>
                ))}
                
                <div className="d-flex justify-content-between mt-4">
                  <div>
                    <Button color="secondary" onClick={() => irAlPaso(2)} className="me-2">
                      Anterior
                    </Button>
                    <Button color="warning" onClick={generarPreguntasIA} disabled={cargando}>
                      Regenerar preguntas
                    </Button>
                  </div>
                  <Button 
                    color="primary" 
                    onClick={() => irAlPaso(4)}
                    disabled={!todasRespondidas || cargando}
                  >
                    {!todasRespondidas ? 'Responde todas las preguntas' : 'Siguiente'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <p>No hay preguntas generadas aún.</p>
                <Button color="primary" onClick={generarPreguntasIA} disabled={cargando}>
                  Generar preguntas
                </Button>
              </div>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default GeneracionPreguntas;