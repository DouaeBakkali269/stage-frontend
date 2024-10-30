import React, { useState, useEffect } from 'react'; 
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, TextField, TablePagination, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import UpdateMaterialStatusModal from './UpdateMaterialStatusModal';

const MaterialTable = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]); // For search filtering
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0); // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(8); // Pagination rows per page - set to 8

  // Fetching materials
  const fetchMaterials = () => {
    const token=localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found');
      return;
    }
    fetch('http://localhost:8080/api/materials',{
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setMaterials(data);
        setFilteredMaterials(data); // Initialize filtered materials
      });
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Update Status Handler
  const handleUpdateClick = (material) => {
    setSelectedMaterial(material);
    setShowModal(true);
  };

  // Delete Material Handler
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken'); 
      await fetch(`http://localhost:8080/api/materials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          'Content-Type': 'application/json'
        }
      });
      setMaterials(prevMaterials => prevMaterials.filter(material => material.materialId !== id));
      setFilteredMaterials(prevMaterials => prevMaterials.filter(material => material.materialId !== id)); // Update filtered list as well
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  // Update Material Status
  const updateMaterialStatus = (id, newStatus) => {
    setMaterials(prevMaterials =>
      prevMaterials.map(material =>
        material.materialId === id ? { ...material, status: newStatus } : material
      )
    );
    fetchMaterials();
  };

  // Search Bar handler
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = materials.filter((material) =>
      material.name.toLowerCase().includes(query)
    );
    setFilteredMaterials(filtered);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Materials List</h2>

      {/* Search Bar and Add Button Container */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        {/* Search Bar */}
        <TextField
          label="Search Materials"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          style={{ width: '100%',marginRight: '20px',height:'' }} 
        />

        {/* Add Button */}
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          Add
        </Button>
      </div>

      {/* Material Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Manufacturer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Local</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Display exactly 8 items per page */}
            {filteredMaterials
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((material) => (
                <TableRow key={material.materialId}>
                  <TableCell>{material.name}</TableCell>
                  <TableCell>{material.serialNumber}</TableCell>
                  <TableCell>{material.typeName}</TableCell>
                  <TableCell>{material.manufacturer}</TableCell>
                  <TableCell>{material.status}</TableCell>
                  <TableCell>{material.localId}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleUpdateClick(material)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(material.materialId)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredMaterials.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Update Modal */}
      {selectedMaterial && (
        <UpdateMaterialStatusModal
          show={showModal}
          onHide={() => setShowModal(false)}
          material={selectedMaterial}
          updateMaterialStatus={updateMaterialStatus}
        />
      )}
    </div>
  );
};

export default MaterialTable;
