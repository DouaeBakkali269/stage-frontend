import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Modal, Typography } from '@mui/material';
import axios from 'axios';

const AddOrganizationUnitForm = ({ onAddUnit }) => {
    const [nextId, setNextId] = useState(30); // Counter for auto-generating IDs
    const [unitName, setUnitName] = useState('');
    const [unitDescription, setUnitDescription] = useState('');
    const [unitType, setUnitType] = useState('');
    const [childUnits, setChildUnits] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [childNextId, setChildNextId] = useState(31); // Counter for child unit IDs
    const [childUnitName, setChildUnitName] = useState('');
    const [childUnitDescription, setChildUnitDescription] = useState('');
    const [childUnitType, setChildUnitType] = useState('');

    // Handle form submission for the main unit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (unitName && unitDescription && unitType) {
        
            const newUnit = {
                unitId: nextId,
                name: unitName,
                description: unitDescription,
                type: unitType,
                parentUnitId: null,
                childUnits, // This includes all added child units
            };

            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.post('http://localhost:8080/organization-units', newUnit, {
                    headers: {
                      'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                      'Content-Type': 'application/json'
                    }
                  });
                console.log('Organization unit added:', response.data);
                onAddUnit(response.data);

                // Clear the form and increment the nextId
                setNextId(childUnits.length + 1);
                setUnitName('');
                setUnitDescription('');
                setUnitType('');
                setChildUnits([]);
            } catch (error) {
                console.error('Error during POST request:', error);
            }
        } else {
            alert('Please fill in all the fields.');
        }
    };

    // Handle modal open/close
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Handle adding child unit
    const handleAddChildUnit = () => {
        if (childUnitName && childUnitDescription && childUnitType) {
          
            const newChildUnit = {
                unitId: childNextId, // Unique ID for each child unit
                name: childUnitName,
                description: childUnitDescription,
                type: childUnitType,
                parentUnitId: nextId, // Parent ID of the main unit
                childUnits: [], // Child units for the child can be empty or filled later
            };

            setChildUnits([...childUnits, newChildUnit]);
            setChildNextId(childNextId + 1);
         // Increment childNextId for the next unit

            // Clear modal fields and close the modal
            setChildUnitName('');
            setChildUnitDescription('');
            setChildUnitType('');
            handleCloseModal();
        } else {
            alert('Please fill in all the fields for the child unit.');
        }
    };


    return (
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2} p={2} bgcolor="#f7f7f7" borderRadius={2}>
            <TextField label="Organization Unit Name" value={unitName} onChange={(e) => setUnitName(e.target.value)} required />
            <TextField label="Description" value={unitDescription} onChange={(e) => setUnitDescription(e.target.value)} required />
            <FormControl required>
                <InputLabel>Type</InputLabel>
                <Select value={unitType} onChange={(e) => setUnitType(e.target.value)} label="Type">
                    <MenuItem value="DIVISION">DIVISION</MenuItem>
                    <MenuItem value="DISTRICT">DISTRICT</MenuItem>
                    <MenuItem value="CAIDAT">CAIDAT</MenuItem>
                </Select>
            </FormControl>

            {/* Button to open modal for adding child units */}
            <Button variant="contained" onClick={handleOpenModal}>
                Add Child Unit
            </Button>

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary">
                Add Unit
            </Button>

            {/* Modal for adding child unit */}
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box p={3} bgcolor="white" borderRadius={2} boxShadow={3} display="flex" flexDirection="column" width={400} mx="auto" mt={10}>
                    <Typography variant="h6" mb={2}>
                        Add Child Unit
                    </Typography>
                    <TextField label="Child Unit Name" value={childUnitName} onChange={(e) => setChildUnitName(e.target.value)} required margin="normal" />
                    <TextField label="Description" value={childUnitDescription} onChange={(e) => setChildUnitDescription(e.target.value)} required margin="normal" />
                    <FormControl required margin="normal">
                        <InputLabel>Type</InputLabel>
                        <Select value={childUnitType} onChange={(e) => setChildUnitType(e.target.value)} label="Type">
                            <MenuItem value="SERVICE">SERVICE</MenuItem>
                            <MenuItem value="CIRCLE">CIRCLE</MenuItem>
                            <MenuItem value="ANNEX">ANNEX</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={handleAddChildUnit}>
                        Save Child Unit
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default AddOrganizationUnitForm;
