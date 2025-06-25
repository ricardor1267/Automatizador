import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Alert,
} from "reactstrap";
import PromptForm from "./PromptForm";
import PromptList from "./PromptList";

const StepWizard = ({
  prompts,
  promptTypes,
  promptPermisos,
  loading,
  error,
  selectedPrompt,
  formData,
  onEdit,
  onDelete,
  onCopyPrompt,
  resetForm,
  handleFormChange,
  savePrompt,
  tableName,
  setTableName,
  tableLimit,
  setTableLimit,
  fetchTableData,
  loadingTable,
  tableError,
  schemaText,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handlePrev = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleCancel = () => {
    resetForm();
    setActiveStep(1);
  };
  
  const handleSubmit = async () => {
    try {
      await savePrompt();
      setActiveStep(1); // Volver al primer paso después de guardar
    } catch (err) {
      // El error se manejará en el hook usePrompts
    }
  };
  
  return (
    <div className="step-wizard">
      <Card className="mb-4">
        <CardBody>
          <div className="wizard-progress mb-4">
            <div className="wizard-progress-bar">
              <div
                className="wizard-progress-fill"
                style={{ width: `${((activeStep - 1) / 2) * 100}%` }}
              ></div>
            </div>
            <div className="wizard-steps">
              <div
                className={`wizard-step ${
                  activeStep >= 1 ? "active" : ""
                }`}
                onClick={() => setActiveStep(1)}
              >
                <div className="wizard-step-icon">
                  <i className="bi bi-list-check"></i>
                </div>
                <div className="wizard-step-label">Listado</div>
              </div>
              <div
                className={`wizard-step ${
                  activeStep >= 2 ? "active" : ""
                }`}
                onClick={() => setActiveStep(2)}
              >
                <div className="wizard-step-icon">
                  <i className="bi bi-pencil-square"></i>
                </div>
                <div className="wizard-step-label">Editor</div>
              </div>
              <div
                className={`wizard-step ${
                  activeStep >= 3 ? "active" : ""
                }`}
                onClick={() => setActiveStep(3)}
              >
                <div className="wizard-step-icon">
                  <i className="bi bi-check-circle"></i>
                </div>
                <div className="wizard-step-label">Confirmación</div>
              </div>
            </div>
          </div>
          
          <div className="step-content">
            {activeStep === 1 && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Listado de Prompts</h4>
                  <Button
                    color="primary"
                    onClick={() => {
                      resetForm();
                      setActiveStep(2);
                    }}
                  >
                    <i className="bi bi-plus-circle me-1"></i> Nuevo Prompt
                  </Button>
                </div>
                <PromptList
                  prompts={prompts}
                  onEdit={(prompt) => {
                    onEdit(prompt);
                    setActiveStep(2);
                  }}
                  onDelete={onDelete}
                  onCopyPrompt={onCopyPrompt}
                />
              </div>
            )}
            
            {activeStep === 2 && (
              <div>
                <PromptForm
                  formData={formData}
                  onChange={handleFormChange}
                  onSubmit={() => setActiveStep(3)}
                  onCancel={handleCancel}
                  promptTypes={promptTypes}
                  promptPermisos={promptPermisos}
                  isEditing={!!selectedPrompt}
                  loading={loading}
                  error={error}
                  tableName={tableName}
                  setTableName={setTableName}
                  tableLimit={tableLimit}
                  setTableLimit={setTableLimit}
                  fetchTableData={fetchTableData}
                  loadingTable={loadingTable}
                  tableError={tableError}
                  schemaText={schemaText}
                />
              </div>
            )}
            
            {activeStep === 3 && (
              <div>
                <h4 className="mb-4">Confirmación</h4>
                <Alert color="info">
                  <h5>Revise los datos antes de guardar</h5>
                  <p>
                    Por favor verifique que toda la información es correcta antes de
                    guardar el prompt.
                  </p>
                </Alert>
                
                <div className="preview-section mb-4">
                  <h5 className="border-bottom pb-2">Información Básica</h5>
                  <Row className="mb-3">
                    <Col md={3} className="fw-bold">
                      Nombre del Prompt:
                    </Col>
                    <Col md={9}>{formData.nombrePrompt}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={3} className="fw-bold">
                      Tipo:
                    </Col>
                    <Col md={9}>
                      {promptTypes.find(t => t.id == formData.prompt_type)?.promptType || 'Sin tipo'}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={3} className="fw-bold">
                      Permiso:
                    </Col>
                    <Col md={9}>
                      {promptPermisos.find(p => p.id == formData.prompt_permiso)?.Permiso || 'Sin permiso'}
                    </Col>
                  </Row>
                </div>
                
                <div className="preview-section mb-4">
                  <h5 className="border-bottom pb-2">Contenido del Prompt</h5>
                  <div className="bg-light p-3 rounded">
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {formData.prompt}
                    </pre>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between mt-4">
                  <Button color="secondary" onClick={handlePrev}>
                    <i className="bi bi-arrow-left me-1"></i> Regresar
                  </Button>
                  <Button
                    color="success"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <span>
                        <i className="bi bi-hourglass me-1"></i> Guardando...
                      </span>
                    ) : (
                      <span>
                        <i className="bi bi-check-circle me-1"></i> Confirmar y Guardar
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default StepWizard;