import React, { useState } from 'react';
import { Modal, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const UpdateMaterialStatusModal = ({ show, onHide, material, updateMaterialStatus }) => {
  const [status, setStatus] = useState(material ? material.status : '');

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8080/api/materials/${material.materialId}/status?status=${status}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      updateMaterialStatus(material.materialId, status);
      onHide(); // Close modal after successful update
    } catch (error) {
      console.error('There was a problem with the update request:', error);
    }
  };

  return (
    <Modal open={show} onClose={onHide}>
      <div style={{ padding: '20px', backgroundColor: 'white', margin: '10% auto', width: '300px', borderRadius: '10px' }}>
        <h2>Update Material Status</h2>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="unavailable">Unavailable</MenuItem>
            <MenuItem value="reserved">Reserved</MenuItem>
            <MenuItem value="disposed">Disposed</MenuItem>
          </Select>
        </FormControl>
        <div style={{ marginTop: '20px' }}>
          <Button variant="contained" onClick={handleSubmit} style={{ marginRight: '10px' }}>
            Save
          </Button>
          <Button variant="outlined" onClick={onHide}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateMaterialStatusModal;
