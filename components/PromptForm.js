import React, { useState } from "react";
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Alert,
  FormFeedback,
} from "reactstrap";

const PromptForm = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  promptTypes,
  promptPermisos,
  isEditing,
  loading,
  error,
  tableName,
  setTableName,
  tableLimit,
  setTableLimit,
  fetchTableData,
  loadingTable,
  tableError,
  schemaText,
}) => {
  const [activeTab, setActiveTab] = useState("1");
  const [validated, setValidated] = useState(false);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    onSubmit();
  };

  return (
    <Card>
      <CardBody>
        <h5 className="card-title mb-4">
          {isEditing ? "Editar Prompt" : "Crear Nuevo Prompt"}
        </h5>

        {error && (
          <Alert color="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Nav tabs className="mb-4">
          <NavItem>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => toggleTab("1")}
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-1-circle me-1"></i> Datos Básicos
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "2" ? "active" : ""}
              onClick={() => toggleTab("2")}
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-2-circle me-1"></i> Estructura de Datos
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "3" ? "active" : ""}
              onClick={() => toggleTab("3")}
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-3-circle me-1"></i> Configuración Avanzada
            </NavLink>
          </NavItem>
        </Nav>

        <Form onSubmit={handleSubmit} noValidate validated={validated}>
          <TabContent activeTab={activeTab}>
            {/* Paso 1: Datos Básicos */}
            <TabPane tabId="1">
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="nombrePrompt" className="form-label">
                      Nombre del Prompt <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="nombrePrompt"
                      name="nombrePrompt"
                      value={formData.nombrePrompt}
                      onChange={onChange}
                      placeholder="Ingrese un nombre descriptivo"
                      required
                      invalid={validated && !formData.nombrePrompt}
                    />
                    <FormFeedback>
                      El nombre del prompt es obligatorio
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="prompt_type" className="form-label">
                          Tipo de Prompt
                        </Label>
                        <Input
                          type="select"
                          id="prompt_type"
                          name="prompt_type"
                          value={formData.prompt_type || ""}
                          onChange={onChange}
                        >
                          <option value="">Seleccionar tipo</option>
                          {promptTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.promptType}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="prompt_permiso" className="form-label">
                          Permiso
                        </Label>
                        <Input
                          type="select"
                          id="prompt_permiso"
                          name="prompt_permiso"
                          value={formData.prompt_permiso || ""}
                          onChange={onChange}
                        >
                          <option value="">Seleccionar permiso</option>
                          {promptPermisos.map((permiso) => (
                            <option key={permiso.id} value={permiso.id}>
                              {permiso.Permiso}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="prompt" className="form-label">
                      Texto del Prompt <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="textarea"
                      id="prompt"
                      name="prompt"
                      value={formData.prompt}
                      onChange={onChange}
                      placeholder="Ingrese el texto del prompt"
                      rows={6}
                      required
                      invalid={validated && !formData.prompt}
                    />
                    <FormFeedback>
                      El texto del prompt es obligatorio
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
              <div className="d-flex justify-content-between mt-3">
                <Button color="secondary" type="button" onClick={onCancel}>
                  Cancelar
                </Button>
                <div>
                  <Button
                    color="primary"
                    type="button"
                    onClick={() => toggleTab("2")}
                    className="ms-2"
                  >
                    Siguiente <i className="bi bi-arrow-right"></i>
                  </Button>
                </div>
              </div>
            </TabPane>

            {/* Paso 2: Estructura de Datos */}
            <TabPane tabId="2">
              <Row>
                <Col md={12}>
                  <Alert color="info" className="mb-4">
                    <i className="bi bi-info-circle me-2"></i>
                    Consulte la estructura de una tabla para incluirla en su prompt.
                  </Alert>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <FormGroup>
                    <Label for="tableName">Nombre de la Tabla</Label>
                    <Input
                      type="text"
                      id="tableName"
                      placeholder="Ej: prompts, prompt-types"
                      value={tableName}
                      onChange={(e) => setTableName(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="tableLimit">Cantidad de Registros</Label>
                    <Input
                      type="number"
                      id="tableLimit"
                      min="1"
                      max="50"
                      value={tableLimit}
                      onChange={(e) => setTableLimit(parseInt(e.target.value) || 1)}
                    />
                  </FormGroup>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button
                    color="primary"
                    onClick={fetchTableData}
                    disabled={!tableName || loadingTable}
                    className="w-100"
                  >
                    {loadingTable ? (
                      <span>
                        <i className="bi bi-hourglass-split me-1"></i> Cargando...
                      </span>
                    ) : (
                      <span>
                        <i className="bi bi-search me-1"></i> Consultar
                      </span>
                    )}
                  </Button>
                </Col>
              </Row>
              {tableError && (
                <Alert color="danger" className="mt-3">
                  {tableError}
                </Alert>
              )}
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="instrucciones">Estructura de Datos</Label>
                    <Input
                      type="textarea"
                      id="instrucciones"
                      name="instrucciones"
                      value={formData.instrucciones || schemaText}
                      onChange={onChange}
                      rows={10}
                      className="font-monospace"
                      placeholder="La estructura de los datos se mostrará aquí después de consultar una tabla..."
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="d-flex justify-content-between mt-3">
                <Button
                  color="secondary"
                  type="button"
                  onClick={() => toggleTab("1")}
                >
                  <i className="bi bi-arrow-left"></i> Anterior
                </Button>
                <div>
                  <Button
                    color="primary"
                    type="button"
                    onClick={() => toggleTab("3")}
                    className="ms-2"
                  >
                    Siguiente <i className="bi bi-arrow-right"></i>
                  </Button>
                </div>
              </div>
            </TabPane>

            {/* Paso 3: Configuración Avanzada */}
            <TabPane tabId="3">
              <Row>
                <Col md={12}>
                  <Alert color="info" className="mb-4">
                    Configuración adicional para el procesamiento del prompt.
                  </Alert>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <FormGroup check>
                    <Input
                      type="checkbox"
                      id="includeJson"
                      name="includeJson"
                      checked={formData.includeJson}
                      onChange={(e) =>
                        onChange({
                          target: {
                            name: "includeJson",
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                    <Label check for="includeJson">
                      Incluir formato JSON en la respuesta
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <FormGroup check>
                    <Input
                      type="checkbox"
                      id="formatSalida"
                      name="formatSalida"
                      checked={formData.formatSalida}
                      onChange={(e) =>
                        onChange({
                          target: {
                            name: "formatSalida",
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                    <Label check for="formatSalida">
                      Aplicar formato de salida especial
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
              <div className="d-flex justify-content-between mt-5">
                <Button
                  color="secondary"
                  type="button"
                  onClick={() => toggleTab("2")}
                >
                  <i className="bi bi-arrow-left"></i> Anterior
                </Button>
                <div>
                  <Button
                    color="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span>
                        <i className="bi bi-hourglass-split me-1"></i> Guardando...
                      </span>
                    ) : (
                      <span>
                        <i className="bi bi-check-circle me-1"></i> Guardar Prompt
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </TabPane>
          </TabContent>
        </Form>
      </CardBody>
    </Card>
  );
};

export default PromptForm;