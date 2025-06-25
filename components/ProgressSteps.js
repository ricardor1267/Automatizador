/**
 * Componente para mostrar el progreso de los pasos
 */
import React from 'react';
import { Row, Col } from 'reactstrap';

const ProgressSteps = ({ pasoActual, irAlPaso }) => {
  const pasos = [
    { 
      numero: 1, 
      titulo: 'Descripción del Proyecto',
      descripcion: 'Describe el objetivo y funcionalidades del proyecto'
    },
    { 
      numero: 2, 
      titulo: 'Estructura de Datos',
      descripcion: 'Ingresa la estructura o descripción de datos'
    },
    { 
      numero: 3, 
      titulo: 'Preguntas IA',
      descripcion: 'Responde preguntas generadas por la IA'
    },
    { 
      numero: 4, 
      titulo: 'Prompt Final',
      descripcion: 'Revisa y utiliza el prompt generado'
    },
  ];

  return (
    <div className="progress-steps mb-4">
      <Row>
        {pasos.map((paso) => (
          <Col md={3} key={paso.numero}>
            <div 
              className={`progress-step ${pasoActual === paso.numero ? 'active' : ''} ${pasoActual > paso.numero ? 'completed' : ''}`}
              onClick={() => pasoActual > paso.numero && irAlPaso(paso.numero)}
              style={{ cursor: pasoActual > paso.numero ? 'pointer' : 'default' }}
            >
              <div className="step-number">{paso.numero}</div>
              <div className="step-title">{paso.titulo}</div>
              <div className="step-description">{paso.descripcion}</div>
            </div>
          </Col>
        ))}
      </Row>
      
      {/* Estilos CSS insertados para simplificar el despliegue */}
      <style jsx>{`
        .progress-steps {
          margin: 30px 0;
        }
        
        .progress-step {
          text-align: center;
          position: relative;
          padding: 0 10px 20px;
        }
        
        .progress-step::after {
          content: '';
          position: absolute;
          top: 25px;
          right: -50%;
          width: 100%;
          height: 2px;
          background-color: #e9ecef;
          z-index: 1;
        }
        
        .progress-step:last-child::after {
          display: none;
        }
        
        .step-number {
          width: 50px;
          height: 50px;
          line-height: 50px;
          border-radius: 50%;
          background-color: #e9ecef;
          color: #6c757d;
          font-weight: bold;
          margin: 0 auto 15px;
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }
        
        .step-title {
          font-weight: bold;
          margin-bottom: 5px;
          color: #495057;
        }
        
        .step-description {
          font-size: 0.85rem;
          color: #6c757d;
        }
        
        /* Estilos para paso activo */
        .progress-step.active .step-number {
          background-color: #5d87ff;
          color: white;
        }
        
        .progress-step.active .step-title {
          color: #5d87ff;
        }
        
        /* Estilos para pasos completados */
        .progress-step.completed .step-number {
          background-color: #13deb9;
          color: white;
        }
        
        .progress-step.completed::after {
          background-color: #13deb9;
        }
      `}</style>
    </div>
  );
};

export default ProgressSteps;
