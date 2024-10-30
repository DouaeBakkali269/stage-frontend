import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function PendingDischarges() {
    const [pendingDischarges, setPendingDischarges] = useState([]);

    useEffect(() => {
        fetchPendingDischarges();
    }, []);

    const fetchPendingDischarges = () => {
        const token = localStorage.getItem("authToken");
        axios.get("http://localhost:8080/api/discharges", {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            const pending = response.data.filter(discharge => discharge.status === "pending")
                .map(discharge => ({
                    ...discharge,
                    id: discharge.dischargeId, // Adding id here
                    materials: Array.isArray(discharge.materials) ? discharge.materials : [], // Ensure materials is an array
                    organizationUnitName: discharge.organizationUnit.name || "Unknown",
                    selectedChildName: discharge.selectedChild?.name || " "
                }));
            setPendingDischarges(pending);
        })
        .catch(error => {
            console.error("Error fetching discharges:", error);
        });
    };

    const updateStatus = (dischargeId, newStatus) => {
        const token = localStorage.getItem("authToken");
        axios.put(`http://localhost:8080/api/discharges/${dischargeId}/status`, null, {
            params: { status: newStatus },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Status updated successfully:', response.data);
            fetchPendingDischarges(); // Refresh the list after updating status
        })
        .catch(error => {
            console.error('Error updating status:', error);
        });
    };

    const columns = [
        { field: "dischargeId", headerName: "ID", width: 50 },
        { field: "date", headerName: "Date", width: 150, editable: false },
        { field: "username", headerName: "User's Name", width: 200, editable: false },
        {
            field: "organizationUnit",
            headerName: "Organization Unit",
            width: 300,
            renderCell: (params) => (
                <Typography>
                    {`${params.row.organizationUnitName}:`}<br/>{` ${params.row.selectedChildName}`}
                </Typography>
            )
        },
        {
            field: "materials",
            headerName: "Materials",
            width: 200,
            renderCell: (params) => {
                if (!Array.isArray(params.row.materials) || params.row.materials.length === 0) {
                    return <Typography>No materials</Typography>;
                }

                return (
                    <Box display="flex" flexDirection="column">
                        {params.row.materials.map((material, index) => (
                            <Typography key={index}>
                                - {material.name} ({material.typeName})
                            </Typography>
                        ))}
                    </Box>
                );
            },
            autoHeight: true,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (params) => (
                <Box display="flex" justifyContent="center" alignItems="center" gap={1} marginTop="5px">
                    <Button variant="contained" color="primary" onClick={() => updateStatus(params.row.dischargeId, "approved")}>
                        Confirm
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => updateStatus(params.row.dischargeId, "canceled")}>
                        Cancel
                    </Button>
                </Box>
            )
        }
    ];

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <h2 style={{ marginTop: '40px' }}>Pending Demands</h2>
            <DataGrid
                rows={pendingDischarges}
                columns={columns}
                getRowId={(row) => row.dischargeId}
                rowHeight={60} 
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                slots={{
                    Toolbar: GridToolbar,
                }}
                pageSizeOptions={[5, 10, 25]}
            />
        </Box>
    );
}

export default PendingDischarges;
