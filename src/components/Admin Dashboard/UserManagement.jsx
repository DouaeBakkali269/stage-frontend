import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, IconButton, TableRow, Button, Modal, TextField, Select, MenuItem, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ResetPasswordIcon from '@mui/icons-material/LockReset'; // Add icon for password reset

const UserManagement = () => {
    const [users, setUsers] = useState([]); // Initialize users as an empty array
    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [emailForReset, setEmailForReset] = useState(''); // New state for password reset email

    // Fetch users
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        axios.get('http://localhost:8080/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data); // Log the response to check its structure
                setUsers(response.data);    // Set users from the response
            })
            .catch(error => console.log(error));
    }, []);

    // Open modal for adding or editing user
    const handleOpen = (user) => {
        setSelectedUser(user || {}); // Set the selected user or create an empty object for new user
        setOpen(true);
    };

    // Close modal
    const handleClose = () => {
        setSelectedUser(null);
        setOpen(false);
    };

    // Save user details (modified for new user logic)
    const handleSave = () => {
        const token = localStorage.getItem("authToken");
        const method = selectedUser.id ? 'put' : 'post'; // Use POST for new users, PUT for updating existing users
        const url = selectedUser.id
            ? `http://localhost:8080/api/users/${selectedUser.id}`
            : `http://localhost:8080/api/users`;

        const userData = {
            nom: selectedUser.nom,
            prenom: selectedUser.prenom,
            email: selectedUser.email,
            phoneNumber: selectedUser.phoneNumber,
            address: selectedUser.address,
            role: selectedUser.role,
            nationality: selectedUser.nationality,
            position: selectedUser.position,
            cin: selectedUser.cin,
            discharges : selectedUser.discharges|| []
        };

        axios({
            method: method,
            url: url,
            data: userData, // Only send necessary fields for user creation
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                handleClose();
                // Refresh user list
                axios.get('http://localhost:8080/api/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => setUsers(response.data));
            });
    };

    // Delete user
    const handleDelete = (userId) => {
        const token = localStorage.getItem("authToken");
        axios.delete(`http://localhost:8080/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => setUsers(users.filter(user => user.id !== userId)));
    };

    // Handle password reset request
    const handlePasswordReset = (email) => {
        const token = localStorage.getItem("authToken");
        axios.post('http://localhost:8080/api/users/reset-password-request', null, {
            params: { email },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => alert('Password set email sent.'))
            .catch(err => console.log(err));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>User Management</h2>

            <Button onClick={() => handleOpen(null)} variant="contained" color="primary" style={{ marginBottom: '20px', marginLeft: '900px' }}>
                Add User
            </Button>

            {/* User Table */}
            {Array.isArray(users) && users.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{`${user.nom} ${user.prenom}`}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phoneNumber}</TableCell>
                                    <TableCell>{user.address}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleOpen(user)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDelete(user.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton color="default" onClick={() => handlePasswordReset(user.email)}>
                                            <ResetPasswordIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <p>No users found or loading...</p>
            )}

            {/* Add/Edit User Modal */}
            <Modal open={open} onClose={handleClose} style={{ overflow: 'auto' }}>
                <div style={{ padding: '20px', backgroundColor: 'white', margin: '100px auto', maxWidth: '500px' }}>
                    <h2>{selectedUser?.id ? 'Edit User' : 'Add User'}</h2>
                    {/* Removed Username and Password Fields */}
                    <TextField
                        label="First Name"
                        value={selectedUser?.nom || ''}
                        onChange={e => setSelectedUser({ ...selectedUser, nom: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Last Name"
                        value={selectedUser?.prenom || ''}
                        onChange={e => setSelectedUser({ ...selectedUser, prenom: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        value={selectedUser?.email || ''}
                        onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Phone Number"
                        value={selectedUser?.phoneNumber || ''}
                        onChange={e => setSelectedUser({ ...selectedUser, phoneNumber: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Address"
                        value={selectedUser?.address || ''}
                        onChange={e => setSelectedUser({ ...selectedUser, address: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <Select
                        value={selectedUser?.role || 'EMPLOYEE'}
                        onChange={e => setSelectedUser({ ...selectedUser, role: e.target.value })}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="EMPLOYEE">Employee</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                    </Select>
                    <Button onClick={handleSave} variant="contained" color="primary" style={{ marginTop: '20px' }}>
                        Save
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default UserManagement;
