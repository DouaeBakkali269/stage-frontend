import React, { useState, useEffect } from 'react';
import { Modal, TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, TablePagination, Paper, Button } from '@mui/material';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import FolderIcon from '@mui/icons-material/Folder';
import wilayaLogo from '../../assets/logos/wilaya_tanger_logo.jpg';
import regionLogo from '../../assets/logos/region_tanger_logo.jpg';

// Centering style
const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
};

const MaterialAssignmentForm = () => {
    const [materials, setMaterials] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [units, setUnits] = useState([]);
    const [selectedUnits, setSelectedUnits] = useState([]);
    const [open, setOpen] = useState(false); // Modal open/close
    const [date, setDate] = useState('');
    const [signature, setSignature] = useState('');
    const [local, setLocal] = useState(0);

    const [pdfButtonEnabled, setPdfButtonEnabled] = useState(false);
    const [page, setPage] = useState(0); // Pagination state
    const [rowsPerPage, setRowsPerPage] = useState(8); // Pagination rows per page - set to 8

    const fetchMaterials = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get("http://localhost:8080/api/materials/available", {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            setMaterials(response.data);
        } catch (error) {
            console.log('Error fetching materials:', error);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle material checkbox selection
    const handleCheckboxChange = (materialId) => {
        setSelectedMaterials((prevSelected) =>
            prevSelected.includes(materialId)
                ? prevSelected.filter((id) => id !== materialId)
                : [...prevSelected, materialId]
        );
    };

    // Fetch organization units
    useEffect(() => {
        fetchOrganizationUnits();
    }, []);

    const fetchOrganizationUnits = () => {
        const token = localStorage.getItem("authToken");
        axios.get('http://localhost:8080/organization-units/withchildren', {
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setUnits(response.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    // Handle unit checkbox selection with clear separation between parent and child units
    const handleToggle = (unitId) => {
        const unit = units.find(u => u.unitId === unitId);
        if (unit && !unit.parentUnitId) { // If it's a parent unit
            setSelectedUnits([unitId]); // Clear other selections and set the parent
        } else {
            setSelectedUnits((prevSelectedUnits) =>
                prevSelectedUnits.includes(unitId)
                    ? prevSelectedUnits.filter(id => id !== unitId)
                    : [...prevSelectedUnits, unitId]
            );
        }
    };

    // Render organization unit tree with unique id generation
    const renderTree = (nodes) => (
        <TreeItem
            key={nodes.unitId}
            itemId={nodes.unitId.toString()}
            label={
                <Box display="flex" alignItems="center">
                    <Checkbox
                        checked={selectedUnits.includes(nodes.unitId)}
                        onChange={() => handleToggle(nodes.unitId)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
                        <FolderIcon style={{ color: '#555555' }} />
                        <span style={{ marginLeft: '8px' }}>
                            ({nodes.type} :) <strong>{nodes.name}</strong>
                        </span>
                    </Box>
                </Box>
            }
        >
            {Array.isArray(nodes.childUnits) ? nodes.childUnits.map((childNode) => renderTree(childNode)) : null}
        </TreeItem>
    );

    // Handle modal open/close
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(new Error('Image failed to load: ' + src));
        });
    };
    const generatePDF = async (dischargeDTO, materials, authenticatedUser) => {
        const doc = new jsPDF();

        try {
            const wilayaLogoImage = await loadImage(wilayaLogo);
            const regionLogoImage = await loadImage(regionLogo);
            // Add logos to PDF
            doc.addImage(regionLogoImage, 'JPEG', 10, 13, 40, 30); // Region logo
            doc.addImage(wilayaLogoImage, 'JPEG', 150, 13, 40, 30); // Wilaya logo
            doc.setLineWidth(0.5);
        } catch (imageError) {
            console.error("Failed to load image:", imageError.message);
        }

        // Add a title for the sheet
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Material Discharge Sheet', 105, 63, null, null, 'center');
        doc.line(20, 70, 200, 70); // Line below paragraph


        // Professional paragraph - Material Discharge Details
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        <br />
        const assignmentText = `
        I, Mr./Ms. ${authenticatedUser.fullName}, confirm having taken the following material(s):
        ${materials.map(material => `\n- ${material.name} (${material.typeName})`).join('')}, 
        on ${dischargeDTO.date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}, 
        for the service ${dischargeDTO.organizationUnit.childUnits[0].name} 
        in the division ${dischargeDTO.organizationUnit.name}, 
        and the local number ${local}.
        `;
        doc.text(assignmentText, 20, 83, { maxWidth: 200 });

        doc.setFont('helvetica', 'bold');
        doc.text(`Signature: ${dischargeDTO.signature}`, 120, 130);
        doc.text('Generated by the Material Management System', 105, 290, null, null, 'center');

        // Save the document
        doc.save('material_assignment_sheet.pdf');
    };

    // Inside the handleAssign function, trigger the PDF generation after a successful assignment
    const handleAssign = async () => {
        if (!date || !signature || selectedMaterials.length === 0 || selectedUnits.length === 0) {
            alert("Please fill all fields and select at least one material and one unit.");
            return;
        }

        const parentUnitId = selectedUnits[0];
        const parentUnit = units.find(unit => unit.unitId === parentUnitId);
        const filteredChildUnits = parentUnit.childUnits.filter(child => selectedUnits.includes(child.unitId));
        const username = localStorage.getItem('username');

        const dischargeDTO = {
            date: new Date(date),
            signature: signature,
            username: username,
            status: "pending",
            organizationUnit: {
                unitId: parentUnit.unitId,
                name: parentUnit.name,
                description: parentUnit.description,
                type: parentUnit.type,
                parentUnitId: parentUnit.parentUnitId,
                childUnits: filteredChildUnits,
            },
            selectedChild: filteredChildUnits[0],
            materials: selectedMaterials.map(materialId => {
                const material = materials.find(material => material.materialId === materialId);
                return {
                    materialId: material.materialId,
                    name: material.name,
                    description: material.description,
                    serialNumber: material.serialNumber,
                    manufacturer: material.manufacturer,
                    status: material.status,
                    typeName: material.typeName,
                    localId: material.localId,
                    dischargeId: material.dischargeId
                };
            })
        };
        console.log(dischargeDTO);

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch('http://localhost:8080/api/discharges', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dischargeDTO),
            });

            if (response.ok) {
                const responseData = await response.json(); // Parse the JSON response
                const createdDischargeId = responseData.dischargeId;

                // Update materials with the discharge ID
                const updatedMaterials = dischargeDTO.materials.map(material => ({
                    ...material,
                    localId: local,
                    dischargeId: createdDischargeId,
                    status: "unavailable"
                }));

                await axios.post('http://localhost:8080/api/materials/update', updatedMaterials, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                // Clear the form and enable PDF generation
                setSelectedMaterials([]);
                setSelectedUnits([]);
                setDate('');
                setSignature('');
                setLocal(0);

                setPdfButtonEnabled(false);
                const username = localStorage.getItem('username');
                const authenticatedUser = { fullName: username };

                generatePDF(dischargeDTO, dischargeDTO.materials, authenticatedUser); // Generate the PDF here after assignment
                handleClose();
            } else {
                console.error('Failed to save assignment');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div style={{ padding: '20px' }}>
            <h2>Available Materials</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Select</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Serial Number</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Manufacturer</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {materials
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((material) => (
                                <TableRow key={material.materialId}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedMaterials.includes(material.materialId)}
                                            onChange={() => handleCheckboxChange(material.materialId)}
                                        />
                                    </TableCell>
                                    <TableCell>{material.name}</TableCell>
                                    <TableCell>{material.serialNumber}</TableCell>
                                    <TableCell>{material.typeName}</TableCell>
                                    <TableCell>{material.manufacturer}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            <Button onClick={handleOpen} variant='contained' color="primary">Assign Selected Materials</Button>
            <Modal open={open} onClose={handleClose} style={{ overflow: 'auto' }}>
                <Box p={3} bgcolor="white" borderRadius={2} boxShadow={3} display="flex" flexDirection="column" width={400} mx="auto" mt={10}>
                    <SimpleTreeView
                        defaultCollapseIcon={<ExpandMore />}
                        defaultExpandIcon={<ChevronRight />}
                    >
                        {units.map((unit) => renderTree(unit))}
                    </SimpleTreeView>

                    <TextField
                        label="Local"
                        value={local}
                        onChange={(e) => setLocal(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Signature"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        margin="normal"
                    />
                    <Button onClick={handleAssign} variant="contained" color="primary">
                        Assign
                    </Button>
                    {pdfButtonEnabled && (
                        <Button onClick={generatePDF} variant="contained" color="secondary" style={{ marginTop: '10px' }}>
                            Generate PDF
                        </Button>
                    )}
                </Box>
            </Modal>
            <TablePagination
                component="div"
                count={materials.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default MaterialAssignmentForm;
