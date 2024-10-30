import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    Box,
    IconButton
} from '@mui/material';
import { useNavigate, Outlet } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment'; 
import PersonIcon from '@mui/icons-material/Person'; 
import ContactMailIcon from '@mui/icons-material/ContactMail'; 
import DoneIcon from '@mui/icons-material/Done';
import AppTheme from '../Authentification/AppTheme';



function EmployeeLayout() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    // Define the handleLogout function
    const handleLogout = () => {
        localStorage.removeItem('authToken'); 
        localStorage.removeItem('id');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <AppTheme>
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center', // Center content vertically
                    },
                }}
            >
                <Divider />
                <List sx={{ width: '100%' }}>
                    <ListItem button onClick={() => handleNavigation('/employee/assignment')} sx={{ justifyContent: 'center' }}>
                        <ListItemText primary="Material's List" />
                        <AssignmentIcon />
                    </ListItem>
                    <ListItem button onClick={() => handleNavigation('/employee/discharge')} sx={{ justifyContent: 'center' }}>
                        <ListItemText primary="My discharges" />
                        <DoneIcon/>
                    </ListItem>
                    <ListItem button onClick={() => handleNavigation('/employee/notification')} sx={{ justifyContent: 'center' }}>
                        <ListItemText primary="Contact Admin" />
                        <ContactMailIcon />
                    </ListItem>
                    <ListItem button onClick={() => handleNavigation('/employee/profile')} sx={{ justifyContent: 'center' }}>
                        <ListItemText primary="Profile" />
                        <PersonIcon />
                    </ListItem>
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: '#eaeff1',
                    padding: 3,
                    minHeight: '100vh',
                }}
            >
                <AppBar position="static" sx={{ zIndex: 1201 }}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Employee's Dashboard
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                color="primary"
                                onClick={handleLogout}
                                sx={{ color: '#FFFFFF', '&:hover': { color: '#FFFFFF' } }}
                            >
                                <LogoutIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>

                <Box sx={{ marginTop: 2 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
        </AppTheme>
    );
}

export default EmployeeLayout;
