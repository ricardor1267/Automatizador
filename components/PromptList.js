import React, { useState } from "react";
import {
  Card,
  CardBody,
  Table,
  Button,
  Badge,
  Pagination,
  PaginationItem,
  PaginationLink,
  Input,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
import "../automatizador.css";

const PromptList = ({ prompts, onEdit, onDelete, onCopyPrompt }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;
  
  // Filtrar prompts por término de búsqueda
  const filteredPrompts = prompts.filter(prompt => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      prompt.nombrePrompt?.toLowerCase().includes(searchTermLower) ||
      prompt.prompt?.toLowerCase().includes(searchTermLower) ||
      prompt.prompt_type?.promptType?.toLowerCase().includes(searchTermLower) ||
      prompt.prompt_permiso?.Permiso?.toLowerCase().includes(searchTermLower)
    );
  });
  
  // Calcular paginación
  const indexOfLastPrompt = currentPage * rowsPerPage;
  const indexOfFirstPrompt = indexOfLastPrompt - rowsPerPage;
  const currentPrompts = filteredPrompts.slice(indexOfFirstPrompt, indexOfLastPrompt);
  const totalPages = Math.ceil(filteredPrompts.length / rowsPerPage);
  
  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Truncar texto largo para mostrar en la tabla
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };
  
  return (
    <Card className="prompt-list">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">Lista de Prompts</h5>
          <div className="d-flex">
            <Input
              type="search"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control-sm me-2"
              style={{ maxWidth: "200px" }}
            />
          </div>
        </div>
        
        <div className="table-responsive">
          <Table hover bordered className="align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>#</th>
                <th style={{ width: "20%" }}>Nombre</th>
                <th style={{ width: "40%" }}>Prompt</th>
                <th style={{ width: "10%" }}>Tipo</th>
                <th style={{ width: "10%" }}>Permiso</th>
                <th style={{ width: "15%" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentPrompts.length > 0 ? (
                currentPrompts.map((prompt, index) => (
                  <tr key={prompt.id}>
                    <td>{indexOfFirstPrompt + index + 1}</td>
                    <td>
                      <div className="fw-medium">{prompt.nombrePrompt}</div>
                    </td>
                    <td>
                      {/* Añadimos el id al div que contiene el texto truncado */}
                      <div id={`prompt-${prompt.id}`} className="prompt-text">
                        {truncateText(prompt.prompt)}
                      </div>
                      <UncontrolledTooltip target={`prompt-${prompt.id}`}>
                        {prompt.prompt}
                      </UncontrolledTooltip>
                    </td>
                    <td>
                      {prompt.prompt_type ? (
                        <Badge color="info" pill>
                          {prompt.prompt_type.promptType}
                        </Badge>
                      ) : (
                        <Badge color="light" pill>
                          Sin asignar
                        </Badge>
                      )}
                    </td>
                    <td>
                      {prompt.prompt_permiso ? (
                        <Badge color="success" pill>
                          {prompt.prompt_permiso.Permiso}
                        </Badge>
                      ) : (
                        <Badge color="light" pill>
                          Sin asignar
                        </Badge>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => onEdit(prompt)}
                          id={`edit-${prompt.id}`}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <UncontrolledTooltip target={`edit-${prompt.id}`}>
                          Editar prompt
                        </UncontrolledTooltip>
                        
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => onDelete(prompt.id)}
                          id={`delete-${prompt.id}`}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                        <UncontrolledTooltip target={`delete-${prompt.id}`}>
                          Eliminar prompt
                        </UncontrolledTooltip>
                        
                        <Button
                          color="info"
                          size="sm"
                          onClick={() => onCopyPrompt(prompt.prompt)}
                          id={`copy-${prompt.id}`}
                        >
                          <i className="bi bi-clipboard"></i>
                        </Button>
                        <UncontrolledTooltip target={`copy-${prompt.id}`}>
                          Copiar prompt
                        </UncontrolledTooltip>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    {searchTerm ? "No se encontraron prompts que coincidan con la búsqueda" : "No hay prompts disponibles"}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <Row className="mt-3">
            <Col className="d-flex justify-content-center">
              <Pagination>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink first onClick={() => paginate(1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink previous onClick={() => paginate(currentPage - 1)} />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem active={currentPage === pageNum} key={i}>
                      <PaginationLink onClick={() => paginate(pageNum)}>
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink next onClick={() => paginate(currentPage + 1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink last onClick={() => paginate(totalPages)} />
                </PaginationItem>
              </Pagination>
            </Col>
          </Row>
        )}
      </CardBody>
    </Card>
  );
};

export default PromptList;