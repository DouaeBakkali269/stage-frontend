import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import UpdateMaterialStatusModal from './UpdateMaterialStatusModal';
import './materialTable.css';

const MaterialTable = () => {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/materials')
      .then(response => response.json())
      .then(data => setMaterials(data));
  }, []);

  const handleUpdateClick = (material) => {
    setSelectedMaterial(material);
    setShowModal(true);
  };

  const updateMaterialStatus = (id, newStatus) => {
    setMaterials(prevMaterials =>
      prevMaterials.map(material =>
        material.id === id ? { ...material, status: newStatus } : material
      )
    );
  };

  return (
    <div className="table-container">
      <h2>Materials List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Serial Number</th>
            <th>Description</th>
            <th>Type</th>
            <th>Manufacturer</th>
            <th>Status</th>
            <th>Local</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {materials.map(material => (
            <tr key={material.materialId}>
              <td>{material.materialId}</td>
              <td>{material.name}</td>
              <td>{material.serialNumber}</td>
              <td>{material.description}</td>
              <td>{material.type}</td>
              <td>{material.manufacturer}</td>
              <td>{material.status}</td>
              <td>{material.local}</td>
              <td className="table-actions">
                <Button variant="primary" onClick={() => handleUpdateClick(material)}>
                  Update Status
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedMaterial && (
        <UpdateMaterialStatusModal
          show={showModal}
          onHide={() => setShowModal(false)}
          material={selectedMaterial}
          updateMaterialStatus={updateMaterialStatus} // Passer la fonction de mise à jour
        />
      )}
    </div>
  );
};

export default MaterialTable;
