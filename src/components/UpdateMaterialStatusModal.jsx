import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const UpdateMaterialStatusModal = ({ show, onHide, material, updateMaterialStatus }) => {
  const [status, setStatus] = useState(material ? material.status : '');

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/materials/${material.materialId}/status?status=${status}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Mettre à jour le statut dans l'état parent après la réussite
      updateMaterialStatus(material.materialId, status);

      onHide(); // Fermer la modale après la mise à jour réussie
    } catch (error) {
      console.error('There was a problem with the update request:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Material Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="reserved">Reserved</option>
              <option value="disposed">Disposed</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateMaterialStatusModal;
