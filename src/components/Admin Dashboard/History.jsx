import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import axios from "axios";
import AppTheme from "../Authentification/AppTheme";

const columns = [
    { field: "dischargeId", headerName: "ID", width: 50 },
    { field: "date", headerName: "Date", width: 180, editable: false },
    { field: "username", headerName: "User's name", width: 150, editable: false },
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

export default function History() {
    const [rows, setRows] = useState([]);

    // In the useEffect for fetching data
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        axios.get("http://localhost:8080/api/discharges", {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            const data = response.data
                .filter(discharge => discharge.status !== "pending")  // Filter out pending discharges
                .map((discharge) => {
                    console.log(discharge);

                    return {
                        ...discharge,
                        id: discharge.dischargeId, // Ensure ID is assigned
                        date: new Date(discharge.date).toLocaleString(),
                        materials: Array.isArray(discharge.materials) ? discharge.materials : [], // Ensure materials is an array
                        organizationUnitName: discharge.organizationUnit.name || {},
                        selectedChildName: discharge.selectedChild?.name ? discharge.selectedChild.name : " ",
                    };
                });
            console.log(data);
            setRows(data);
        }).catch(error => {
            console.error("Error fetching discharge data:", error);
        });
    }, []);

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Discharges Data Export", 20, 10);
        doc.autoTable({
            head: [["Discharge ID", "Date", "Username", "Status", "Organization Unit", "Materials"]],
            body: rows.map((row) => [
                row.dischargeId,
                row.date,
                row.username,
                row.status,
                row.organizationUnitName,
                row.materials.map((m) => `${m.name} (${m.typeName})`).join(", "),
            ]),
        });
        doc.save("discharges_data.pdf");
    };

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            rows.map((row) => ({
                Discharge_ID: row.dischargeId,
                Date: row.date,
                Username: row.username,
                Status: row.status,
                Organization_Unit: row.organizationUnitName,
                Materials: row.materials.map((m) => `${m.name} (${m.typeName})`).join(", "),
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Discharges");
        XLSX.writeFile(workbook, "discharges_data.xlsx");
    };

    return (
        <AppTheme >
            <Box sx={{ height: 500, width: "98%" }}>
                <h2 style={{ marginTop: '30px' }}> Discharge History</h2>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={exportPDF} sx={{ mr: 1 }}>
                        Export as PDF
                    </Button>
                    <Button variant="contained" onClick={exportExcel} sx={{ mr: 1 }}>
                        Export as Excel
                    </Button>
                </Box>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowHeight={() => 80} // Adjust if needed based on number of materials
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
                    checkboxSelection
                    disableSelectionOnClick
                />
            </Box>
        </AppTheme>
    );
}
