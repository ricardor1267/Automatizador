/**
 * Componente para el paso 1: Descripción del Proyecto
 */
import React from 'react';
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
  Col
} from 'reactstrap';

const DescripcionProyecto = ({ 
  descripcionProyecto, 
  setDescripcionProyecto, 
  error, 
  irAlPaso 
}) => {
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4" className="mb-4">Paso 1: Descripción del Proyecto</CardTitle>
        
        {error && (
          <Alert color="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        <FormGroup>
          <Label for="descripcionProyecto">
            Describe tu proyecto lo más detalladamente posible:
          </Label>
          <Input
            type="textarea"
            id="descripcionProyecto"
            rows="10"
            value={descripcionProyecto}
            onChange={(e) => setDescripcionProyecto(e.target.value)}
            placeholder="Incluye el objetivo principal, funcionalidades clave y cualquier contexto relevante..."
          />
        </FormGroup>
        
        <div className="d-flex justify-content-between mt-4">
          <div></div> {/* Espacio vacío para alinear a la derecha */}
          <Button 
            color="primary" 
            onClick={() => irAlPaso(2)}
            disabled={!descripcionProyecto.trim()}
          >
            Siguiente
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default DescripcionProyecto;
