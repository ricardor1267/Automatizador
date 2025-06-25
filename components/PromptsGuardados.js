/**
 * Componente para mostrar la lista de prompts guardados
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Alert,
  ListGroup,
  ListGroupItem,
  InputGroup,
  InputGroupText,
  FormGroup
} from 'reactstrap';

const PromptsGuardados = ({ 
  promptsGuardados, 
  cargarPrompt, 
  eliminarPromptGuardado 
}) => {
  const [modalPrompt, setModalPrompt] = useState(false);
  const [modalConfirmEliminar, setModalConfirmEliminar] = useState(false);
  const [promptSeleccionado, setPromptSeleccionado] = useState(null);
  const [promptsFiltrados, setPromptsFiltrados] = useState([]);
  const [filtro, setFiltro] = useState('');
  
  // Aplicar filtro cuando cambie la lista de prompts o el texto de búsqueda
  useEffect(() => {
    if (!filtro.trim()) {
      setPromptsFiltrados(promptsGuardados || []);
    } else {
      const terminoBusqueda = filtro.toLowerCase().trim();
      const promptsFiltrados = promptsGuardados.filter(prompt => 
        prompt.nombrePrompt.toLowerCase().includes(terminoBusqueda) ||
        prompt.prompt.toLowerCase().includes(terminoBusqueda)
      );
      setPromptsFiltrados(promptsFiltrados);
    }
  }, [promptsGuardados, filtro]);
  
  const toggleModal = () => setModalPrompt(!modalPrompt);
  const toggleModalEliminar = () => setModalConfirmEliminar(!modalConfirmEliminar);
  
  const verPrompt = (prompt) => {
    setPromptSeleccionado(prompt);
    toggleModal();
  };
  
  const confirmarEliminar = (prompt, e) => {
    e.stopPropagation(); // Evitar que se abra el modal del prompt
    setPromptSeleccionado(prompt);
    toggleModalEliminar();
  };
  
  const eliminarPrompt = async () => {
    if (promptSeleccionado) {
      await eliminarPromptGuardado(promptSeleccionado.id);
      toggleModalEliminar();
    }
  };
  
  const cargarPromptSeleccionado = () => {
    if (promptSeleccionado) {
      cargarPrompt(promptSeleccionado.id);
      toggleModal();
    }
  };
  
  const copiarAlPortapapeles = () => {
    if (promptSeleccionado) {
      const textarea = document.createElement('textarea');
      textarea.value = promptSeleccionado.prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('¡Prompt copiado al portapapeles!');
    }
  };
  
  // Formatear fecha
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'Sin fecha';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Obtener tipo y permiso de las relaciones
  const getTipoPrompt = (prompt) => {
    if (!prompt) return "-";
    
    // Intentar obtener el tipo de diferentes maneras según la estructura de la respuesta
    if (prompt.prompt_type && prompt.prompt_type.data && prompt.prompt_type.data.attributes) {
      return prompt.prompt_type.data.attributes.promptType;
    } else if (prompt.prompt_type && prompt.prompt_type.promptType) {
      return prompt.prompt_type.promptType;
    } else {
      return "Desarrollo"; // Valor por defecto
    }
  };
  
  const getPermisoPrompt = (prompt) => {
    if (!prompt) return "-";
    
    // Intentar obtener el permiso de diferentes maneras según la estructura de la respuesta
    if (prompt.prompt_permiso && prompt.prompt_permiso.data && prompt.prompt_permiso.data.attributes) {
      return prompt.prompt_permiso.data.attributes.Permiso;
    } else if (prompt.prompt_permiso && prompt.prompt_permiso.Permiso) {
      return prompt.prompt_permiso.Permiso;
    } else {
      return "Privado"; // Valor por defecto
    }
  };

  return (
    <Card className="mb-4">
      <CardBody>
        <CardTitle tag="h4" className="mb-3">Prompts Guardados</CardTitle>
        
        {/* Buscador de prompts */}
        <FormGroup className="mb-3">
          <InputGroup>
            <InputGroupText>
              <i className="bi bi-search"></i>
            </InputGroupText>
            <Input
              type="text"
              placeholder="Buscar prompt..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            {filtro && (
              <Button color="secondary" onClick={() => setFiltro('')}>
                <i className="bi bi-x"></i>
              </Button>
            )}
          </InputGroup>
        </FormGroup>
        
        {promptsFiltrados && promptsFiltrados.length > 0 ? (
          <div className="prompts-guardados-container" style={{maxHeight: '500px', overflowY: 'auto'}}>
            <ListGroup flush>
              {promptsFiltrados.map((prompt) => (
              <ListGroupItem 
                key={prompt.id}
                action
                className="d-flex justify-content-between align-items-center"
              >
                <div style={{cursor: 'pointer'}} onClick={() => verPrompt(prompt)}>
                  <div className="fw-bold">{prompt.nombrePrompt}</div>
                  <small className="text-muted">{formatearFecha(prompt.createdAt)}</small>
                </div>
                <div>
                  <Badge color="primary" pill className="me-2">
                    {getTipoPrompt(prompt)}
                  </Badge>
                  <Button 
                    color="danger" 
                    size="sm" 
                    outline
                    onClick={(e) => confirmarEliminar(prompt, e)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </ListGroupItem>
              ))}
            </ListGroup>
          </div>
        ) : (
          <Alert color="info" className="text-center my-4">
            <p className="mb-0">
              {filtro 
                ? 'No se encontraron prompts con ese término.' 
                : 'No hay prompts guardados.'}
            </p>
          </Alert>
        )}
        
        {/* Modal para ver el prompt */}
        <Modal isOpen={modalPrompt} toggle={toggleModal} size="lg">
          <ModalHeader toggle={toggleModal}>
            {promptSeleccionado?.nombrePrompt}
          </ModalHeader>
          <ModalBody>
            <div className="d-flex justify-content-between mb-3">
              <Badge color="primary" pill>
                {getTipoPrompt(promptSeleccionado)}
              </Badge>
              <Badge color={getPermisoPrompt(promptSeleccionado) === 'Privado' ? 'danger' : 'success'} pill>
                {getPermisoPrompt(promptSeleccionado)}
              </Badge>
            </div>
            
            <h5 className="mt-4">Contenido del Prompt:</h5>
            <Input
              type="textarea"
              rows="15"
              value={promptSeleccionado?.prompt || ''}
              readOnly
            />
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={cargarPromptSeleccionado}>
              <i className="bi bi-upload me-1"></i> Cargar Prompt
            </Button>
            <Button color="info" onClick={copiarAlPortapapeles}>
              <i className="bi bi-clipboard me-1"></i> Copiar al Portapapeles
            </Button>
            <Button color="danger" onClick={() => toggleModalEliminar()}>
              <i className="bi bi-trash me-1"></i> Eliminar
            </Button>
            <Button color="secondary" onClick={toggleModal}>
              Cerrar
            </Button>
          </ModalFooter>
        </Modal>
        
        {/* Modal de confirmación para eliminar */}
        <Modal isOpen={modalConfirmEliminar} toggle={toggleModalEliminar}>
          <ModalHeader toggle={toggleModalEliminar}>
            Confirmar Eliminación
          </ModalHeader>
          <ModalBody>
            <p>¿Estás seguro de que deseas eliminar el prompt <strong>"{promptSeleccionado?.nombrePrompt}"</strong>?</p>
            <Alert color="warning">
              Esta acción no se puede deshacer.
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModalEliminar}>
              Cancelar
            </Button>
            <Button color="danger" onClick={eliminarPrompt}>
              Eliminar
            </Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default PromptsGuardados;