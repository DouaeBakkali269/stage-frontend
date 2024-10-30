import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const columns = [
    { field: "date", headerName: "Date", width: 180, editable: false },
    {
        field: "status",
        headerName: "Status",
        width: 130,
        renderCell: (params) => (
            <Typography>
                {params.value} {/* Display status value as text */}
            </Typography>
        )
    },
    {
        field: "organizationUnit",
        headerName: "Organization Unit",
        width: 300,
        renderCell: (params) => {
            const { row } = params;
            const organizationUnitName = row.organizationUnitName;
            const selectedChildName = row.selectedChildName;

            return (
                <Typography>
                    <span>
                        {`${organizationUnitName}:`} <br /> {` ${selectedChildName}`}
                    </span>
                </Typography>
            );
        }
    },
    {
        field: "materials",
        headerName: "Materials",
        width: 250,
        resizable: true,
        sortable: false,
        renderCell: (params) => {
            const { row } = params;

            // Check if materials is an array and render them as a list with line breaks
            if (!row || !Array.isArray(row.materials)) {
                return <Typography>No materials</Typography>;
            }

            return (
                <Box
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    {row.materials.map((material, index) => (
                        <Typography key={index}>
                            - {material.name} ({material.typeName})
                        </Typography>
                    ))}
                </Box>
            );
        },
        autoHeight: true,
    }
];

function EmployeeDischarges({ username }) {
    const [employeeDischarges, setEmployeeDischarges] = useState([]);

    useEffect(() => {
        fetchEmployeeDischarges();
    }, [username]);


    // Fetch employee's discharges
    const fetchEmployeeDischarges = () => {
        const token = localStorage.getItem("authToken");
        const username = localStorage.getItem("username");
        axios.get(`http://localhost:8080/api/discharges/username/${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                const discharges = response.data.map(discharge => ({
                    ...discharge,
                    id: discharge.dischargeId,
                    date: new Date(discharge.date).toLocaleString(),
                    materials: Array.isArray(discharge.materials) ? discharge.materials : [],
                    organizationUnitName: discharge.organizationUnit.name || {},
                    selectedChildName: discharge.selectedChild?.name ? discharge.selectedChild.name : " ",
                }));
                setEmployeeDischarges(discharges);
            })
            .catch(error => {
                console.error("Error fetching employee discharges:", error);
            });
    };

    return (
        <Box sx={{ height: 500, width: '85%',marginLeft:'70px' }}>
            <h2 style={{ marginTop: '40px' }}>My Discharges</h2>
            <DataGrid
                rows={employeeDischarges}
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

export default EmployeeDischarges;
