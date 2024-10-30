import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { ExpandMore, ChevronRight, Delete } from "@mui/icons-material";
import AddOrganizationUnitForm from './AddOrganizationUnitForm';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import FolderIcon from '@mui/icons-material/Folder';
import AppTheme from '../Authentification/AppTheme';
import { TextField } from '@mui/material';

// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// Centering style
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

// Additional tree container style to move it up
const treeContainerStyle = {
  width: '100%',
  padding: '0 20px',
  marginTop: '30px',
  marginLeft: '300px',// Added negative margin to reduce space below the image/text
};

const OrganizationUnit = () => {
  const [units, setUnits] = useState([]); // Store organization units fetched from the API
  const [selectedUnits, setSelectedUnits] = useState([]); // Store the selected unit IDs
  const [openModal, setOpenModal] = useState(false); // State to control the Add Unit modal

  // Fetch organization units from the backend when the component mounts.
  useEffect(() => {
    fetchOrganizationUnits();
  }, []);

  const fetchOrganizationUnits = () => {
    const token = localStorage.getItem("authToken");
    axios.get('http://localhost:8080/organization-units/withchildren', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setUnits(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  // Handle checkbox selection of nodes.
  const handleToggle = (unitId) => {
    setSelectedUnits((prevSelectedUnits) => {
      const isAlreadySelected = prevSelectedUnits.includes(unitId);
      if (isAlreadySelected) {
        return prevSelectedUnits.filter((id) => id !== unitId);
      } else {
        return [...prevSelectedUnits, unitId];
      }
    });
  };

  // Function to handle deletion of a unit
  const handleDelete = (unitId) => {
    const token = localStorage.getItem("authToken");
    axios.delete(`http://localhost:8080/organization-units/${unitId}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        setUnits((prevUnits) => prevUnits.filter((unit) => unit.unitId !== unitId));
      })
      .catch(error => console.error('Error deleting unit:', error));
  };


  // Recursive function to render each tree item and its children.
  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.unitId}
      itemId={nodes.unitId.toString()}
      label={
        <Box display="flex" alignItems="center">
          {/*<Checkbox
            checked={selectedUnits.includes(nodes.unitId)}
            onChange={() => handleToggle(nodes.unitId)}
            inputProps={{ 'aria-label': 'controlled' }}
          />*/}
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            <FolderIcon  sx={{ color:  '#68B884' }}/>
            <Delete sx={{ color: '#FFA07A', cursor: 'pointer' }} onClick={() => handleDelete(nodes.unitId)}  />
            <Tooltip title={<span style={{ fontSize: '1.2em' }}>{nodes.description}</span>}>
             <strong>{nodes.name}</strong>
            </Tooltip>
          </Box>
        </Box>
      }
    >
      {Array.isArray(nodes.childUnits) ? nodes.childUnits.map((childNode) => renderTree(childNode)) : null}
    </TreeItem>
  );

  // Function to handle adding a new unit from the form
  const handleAddUnit = (newUnit) => {
    // Add the new unit to the list of units
    setUnits((prevUnits) => [...prevUnits, newUnit]);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUnits, setFilteredUnits] = useState([]); // For search filtering

    // Search Bar handler
const handleSearch = (event) => {
  const query = event.target.value.toLowerCase();
  setSearchQuery(query);
  const filtered = units.filter((unit) =>
    unit.name.toLowerCase().includes(query)
  );
  setFilteredUnits(filtered);
};
  return (
    <AppTheme>
    <Box sx={containerStyle}>
      <Typography variant="h4" component="h2" style={{ fontWeight: 'bold', marginBottom: '10px', marginTop:'20px',fontFamily: 'medium' }}>
        Organization Units
      </Typography>
<br/>
      {/* Introductory paragraph and image */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} mx={2} width="100%">
        <Typography
          variant="body1"
          style={{
      
            maxWidth: '60%',
            textAlign: 'left',
            marginLeft: '100px',
            marginRight: '30px'
          }}
        >
          <strong>Welcome to the administrative dashboard of the Wilaya of Tanger-Tétouan-Al Hoceïma. Here, you can explore the various divisions and services within the Wilaya, including their responsibilities and organizational structure and also add new ones.</strong>
        </Typography>

      </Box>
      <br />
      <br />
      {/* Button to open the modal */}
      <Box display="flex" justifyContent="flex-start" mb={1} width="100%" >
      <TextField
          label="Search unit"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          style={{ width: '80%',marginRight: '20px',height:'' }} 
        />
        <Button
         
          variant="contained"
          sx={{ bgcolor: '#003366' }}
          onClick={() => setOpenModal(true)}
        >
          Add Organization Unit
        </Button>
      </Box>

      {/* Modal for adding organization unit */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-add-organization-unit"
        aria-describedby="modal-add-organization-unit-description"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}
          >
            Add Organization Unit
          </Typography>
          <AddOrganizationUnitForm onAddUnit={handleAddUnit} />
        </Box>
      </Modal>

      {/* Render the organization unit tree */}
      <SimpleTreeView
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
        sx={treeContainerStyle}
      >
        {units.map((unit) => renderTree(unit))}
      </SimpleTreeView>
    </Box>
    </AppTheme>
  );
};

export default OrganizationUnit;
