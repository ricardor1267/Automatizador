/**
 * Componente para el paso 2: Estructura de Datos
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
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
  InputGroup,
  InputGroupText,
  Badge,
  Tooltip
} from 'reactstrap';
import useEsquemaBusqueda from '../hooks/useEsquemaBusqueda';

const EstructuraDatos = ({ 
  estructuraDatos, 
  setEstructuraDatos, 
  error, 
  irAlPaso,
  esquemasDisponibles,
  seleccionarEsquema
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState({});
  
  const toggle = () => setDropdownOpen(prevState => !prevState);
  
  const toggleTooltip = (id) => {
    setTooltipOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  
  // Utilizar el hook de búsqueda de esquemas
  const {
    nombreTabla,
    setNombreTabla,
    limitRegistros,
    setLimitRegistros,
    cargandoEsquema,
    errorEsquema,
    buscarEsquema
  } = useEsquemaBusqueda(setEstructuraDatos);
  
  // Estado para controlar la visualización del editor
  const [editorHeight, setEditorHeight] = useState("400px");
  const toggleEditorHeight = () => {
    setEditorHeight(editorHeight === "400px" ? "600px" : "400px");
  };

  // Función para mostrar nombre del esquema de forma segura
  const getNombreEsquema = (esquema) => {
    if (!esquema) return "Esquema desconocido";
    
    // Si tiene info con displayName o singularName, usamos eso
    if (esquema.info && (esquema.info.displayName || esquema.info.singularName)) {
      return esquema.info.displayName || esquema.info.singularName;
    }
    
    // Si no tiene info pero sí tiene nombre, usamos eso
    if (esquema.nombre) {
      return esquema.nombre;
    }
    
    // Si tiene uid, extraemos el nombre de allí
    if (esquema.uid) {
      const partes = esquema.uid.split('.');
      return partes[partes.length - 1];
    }
    
    // Si todo falla, usamos un nombre genérico
    return "Esquema " + Math.random().toString(36).substring(2, 7);
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4" className="mb-4">Paso 2: Estructura de Datos</CardTitle>
        
        {error && (
          <Alert color="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        {/* Buscador de esquemas */}
        <Card className="mb-4 bg-light-info">
          <CardBody>
            <CardTitle tag="h5" className="mb-3">
              <i className="bi bi-table me-2"></i>
              Consultar Esquema de Tabla
            </CardTitle>
            
            <Alert color="info" className="small mb-3">
              <i className="bi bi-info-circle me-2"></i>
              Esta herramienta te permite obtener automáticamente la estructura de una tabla de la base de datos, incluyendo sus relaciones y datos de ejemplo.
            </Alert>
            
            {errorEsquema && (
              <Alert color="danger" className="mb-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {errorEsquema}
              </Alert>
            )}
            
            <Row>
              <Col md={7}>
                <FormGroup>
                  <Label for="nombreTabla">
                    Nombre de la Tabla
                    <Badge color="primary" className="ms-2" id="tablaNombreHelp">
                      ?
                    </Badge>
                    <Tooltip
                      placement="top"
                      isOpen={tooltipOpen["tablaNombreHelp"]}
                      target="tablaNombreHelp"
                      toggle={() => toggleTooltip("tablaNombreHelp")}
                    >
                      Ingresa el nombre de la tabla como aparece en Strapi (ej: prompts, prompt-types, prompt-permisos)
                    </Tooltip>
                  </Label>
                  <InputGroup>
                    <InputGroupText>
                      <i className="bi bi-database"></i>
                    </InputGroupText>
                    <Input
                      type="text"
                      id="nombreTabla"
                      placeholder="Ej: prompts, prompt-types"
                      value={nombreTabla}
                      onChange={(e) => setNombreTabla(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Label for="limitRegistros">
                    Cantidad de Registros
                    <Badge color="primary" className="ms-2" id="registrosHelp">
                      ?
                    </Badge>
                    <Tooltip
                      placement="top"
                      isOpen={tooltipOpen["registrosHelp"]}
                      target="registrosHelp"
                      toggle={() => toggleTooltip("registrosHelp")}
                    >
                      Número de registros de ejemplo a incluir en el resultado
                    </Tooltip>
                  </Label>
                  <InputGroup>
                    <InputGroupText>
                      <i className="bi bi-list-ol"></i>
                    </InputGroupText>
                    <Input
                      type="number"
                      id="limitRegistros"
                      min="1"
                      max="100"
                      value={limitRegistros}
                      onChange={(e) => setLimitRegistros(parseInt(e.target.value) || 1)}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            
            <Button 
              color="primary" 
              onClick={buscarEsquema}
              disabled={cargandoEsquema || !nombreTabla.trim()}
              className="mt-2"
              id="consultarEsquemaBtn"
            >
              {cargandoEsquema ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Consultando...
                </>
              ) : (
                <>
                  <i className="bi bi-search me-2"></i>
                  Consultar Esquema
                </>
              )}
            </Button>
            <Tooltip
              placement="right"
              isOpen={tooltipOpen["consultarEsquemaBtn"]}
              target="consultarEsquemaBtn"
              toggle={() => toggleTooltip("consultarEsquemaBtn")}
            >
              Consultar la estructura de la tabla
            </Tooltip>
          </CardBody>
        </Card>
        
        {/* Esquemas disponibles (funcionalidad existente) */}
        {esquemasDisponibles && esquemasDisponibles.length > 0 && (
          <div className="mb-4">
            <Label>
              <i className="bi bi-list-check me-2"></i>
              Esquemas disponibles:
            </Label>
            <Dropdown isOpen={dropdownOpen} toggle={toggle} className="mb-3">
              <DropdownToggle caret color="primary">
                <i className="bi bi-database me-2"></i>
                Seleccionar esquema
              </DropdownToggle>
              <DropdownMenu>
                {esquemasDisponibles.map(esquema => (
                  <DropdownItem 
                    key={esquema.uid || Math.random().toString(36).substring(2, 7)} 
                    onClick={() => seleccionarEsquema(esquema.uid)}
                  >
                    {getNombreEsquema(esquema)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Alert color="info" className="small">
              <i className="bi bi-info-circle me-2"></i>
              Selecciona un esquema de la base de datos para usar su estructura como referencia
            </Alert>
          </div>
        )}
        
        <FormGroup>
          <div className="d-flex justify-content-between align-items-center">
            <Label for="estructuraDatos" className="mb-2">
              <i className="bi bi-code-square me-2"></i>
              Estructura de datos o texto descriptivo:
            </Label>
            <Button 
              color="link" 
              className="text-primary p-0"
              onClick={toggleEditorHeight}
              id="toggleEditorBtn"
            >
              <i className={`bi bi-arrows-${editorHeight === "400px" ? "expand" : "collapse"}`}></i>
              {editorHeight === "400px" ? " Expandir" : " Contraer"}
            </Button>
            <Tooltip
              placement="left"
              isOpen={tooltipOpen["toggleEditorBtn"]}
              target="toggleEditorBtn"
              toggle={() => toggleTooltip("toggleEditorBtn")}
            >
              {editorHeight === "400px" ? "Expandir editor" : "Contraer editor"}
            </Tooltip>
          </div>
          <Input
            type="textarea"
            id="estructuraDatos"
            rows="15"
            value={estructuraDatos}
            onChange={(e) => setEstructuraDatos(e.target.value)}
            placeholder='Puedes ingresar cualquier texto descriptivo o estructura de datos'
            className="font-monospace"
            style={{
              height: editorHeight,
              resize: "vertical",
              transition: "height 0.3s ease-in-out"
            }}
          />
          
          {estructuraDatos && (
            <div className="d-flex justify-content-end mt-2">
              <Button
                color="outline-danger"
                size="sm"
                className="me-2"
                onClick={() => setEstructuraDatos("")}
                id="limpiarBtn"
              >
                <i className="bi bi-trash me-1"></i> Limpiar
              </Button>
              <Tooltip
                placement="top"
                isOpen={tooltipOpen["limpiarBtn"]}
                target="limpiarBtn"
                toggle={() => toggleTooltip("limpiarBtn")}
              >
                Limpiar todo el contenido
              </Tooltip>
            </div>
          )}
        </FormGroup>
        
        <div className="d-flex justify-content-between mt-4">
          <Button color="secondary" onClick={() => irAlPaso(1)}>
            <i className="bi bi-arrow-left me-2"></i>
            Anterior
          </Button>
          <Button 
            color="primary" 
            onClick={() => irAlPaso(3)}
            disabled={!estructuraDatos.trim()}
          >
            Siguiente
            <i className="bi bi-arrow-right ms-2"></i>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default EstructuraDatos;