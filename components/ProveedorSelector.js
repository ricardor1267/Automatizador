/**
 * Componente para seleccionar proveedor de IA
 */
import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

const ProveedorSelector = ({ proveedores, seleccionado, onChange }) => {
  return (
    <div className="mb-4">
      <p className="text-muted mb-3">
        Selecciona el proveedor de IA que deseas utilizar. Si uno falla, el sistema intentará con los demás automáticamente.
      </p>
      
      <Row className="g-3">
        {proveedores.map((proveedor) => (
          <Col md={4} key={proveedor.id}>
            <Card 
              className={`proveedor-card ${seleccionado === proveedor.id ? 'proveedor-selected' : ''}`}
              onClick={() => onChange(proveedor.id)}
            >
              <CardBody>
                <h6 className="mb-1">{proveedor.nombre}</h6>
                <div className="small text-secondary mb-2">
                  Modelo: {proveedor.modelo}
                </div>
                <p className="small mb-0">
                  {proveedor.descripcion}
                </p>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProveedorSelector;