/**
 * Componente para el paso 4: Prompt Final
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import ProveedorSelector from './ProveedorSelector';

const PromptFinal = ({
  promptFinal,
  setPromptFinal,
  cargando,
  error,
  mensaje,
  guardarPrompt,
  irAlPaso,
  reiniciarProceso,
  proveedorSeleccionado,
  proveedoresDisponibles,
  cambiarProveedorIA
}) => {
  const [copiado, setCopiado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombrePrompt, setNombrePrompt] = useState('');
  const [verProveedores, setVerProveedores] = useState(false);

  // Función para copiar al portapapeles
  const copiarAlPortapapeles = () => {
    navigator.clipboard.writeText(promptFinal).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  };

  // Función para mostrar el modal de guardar
  const mostrarModalGuardar = () => {
    setNombrePrompt('');
    setModalVisible(true);
  };

  // Función para guardar el prompt
  const confirmarGuardar = () => {
    if (nombrePrompt.trim()) {
      guardarPrompt(nombrePrompt);
      setModalVisible(false);
    }
  };

  return (
    <>
      <Card>
        <CardBody>
          <CardTitle tag="h4" className="mb-4">Paso 4: Prompt Final Generado</CardTitle>
          
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
              <p className="mt-3">Generando prompt final...</p>
            </div>
          ) : (
            <>
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
              
              <FormGroup className="prompt-final-container">
                <Label for="promptFinal">
                  Prompt generado (puedes editarlo si lo deseas):
                </Label>
                <Button 
                  color={copiado ? "success" : "secondary"}
                  size="sm"
                  className="copy-btn"
                  onClick={copiarAlPortapapeles}
                >
                  {copiado ? "¡Copiado!" : "Copiar"}
                </Button>
                <Input
                  type="textarea"
                  id="promptFinal"
                  rows="15"
                  value={promptFinal}
                  onChange={(e) => setPromptFinal(e.target.value)}
                  className="mb-3"
                />
              </FormGroup>
              
              <div className="d-flex justify-content-between mt-4">
                <div>
                  <Button color="secondary" onClick={() => irAlPaso(3)} className="me-2">
                    Anterior
                  </Button>
                  <Button color="info" onClick={reiniciarProceso} className="me-2">
                    Nuevo Prompt
                  </Button>
                </div>
                <Button color="success" onClick={mostrarModalGuardar}>
                  Guardar Prompt
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
      
      {/* Modal para guardar el prompt */}
      <Modal isOpen={modalVisible} toggle={() => setModalVisible(!modalVisible)}>
        <ModalHeader toggle={() => setModalVisible(!modalVisible)}>
          Guardar Prompt
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="nombrePrompt">Nombre del prompt:</Label>
            <Input
              type="text"
              id="nombrePrompt"
              value={nombrePrompt}
              onChange={(e) => setNombrePrompt(e.target.value)}
              placeholder="Ej: Automatización de Backups"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalVisible(false)}>
            Cancelar
          </Button>
          <Button 
            color="primary" 
            onClick={confirmarGuardar}
            disabled={!nombrePrompt.trim()}
          >
            Guardar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default PromptFinal;