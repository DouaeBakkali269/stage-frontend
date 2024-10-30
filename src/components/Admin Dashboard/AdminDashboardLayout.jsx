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
    Button
} from '@mui/material';
import { useNavigate, Outlet } from 'react-router-dom';
import NotificationComponent from './NotificationComponent';
import ListIcon from '@mui/icons-material/List';
import PeopleIcon from '@mui/icons-material/People';
import OrganizationIcon from '@mui/icons-material/Business';
import HistoryIcon from '@mui/icons-material/History';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LogoutIcon from '@mui/icons-material/Logout'; // Updated icon
import IconButton from '@mui/material/IconButton';
import wilayaLogo from '../../assets/logos/wilaya_logo.jpg';
import PersonIcon from '@mui/icons-material/Person'; 
import AppTheme from '../Authentification/AppTheme';


function AdminDashboardLayout() {
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
                        justifyContent: 'center', // Center the content
                        alignItems: 'center',      // Center vertically
                    },
                }}
            >
                <img
                    src={wilayaLogo}
                    alt="Wilaya Logo"
                    style={{ width: '200px', height: 'auto', marginTop: '0px',marginLeft:'0px', marginBottom:'60px' }}
                />
                <Divider />
                <List sx={{ width: '100%' }}>
                    <ListItem button onClick={() => handleNavigation('/admin/materialList')}>
                        <ListItemText primary="Material's List" />
                        <ListIcon />
                    </ListItem>
                    <ListItem button onClick={() => handleNavigation('/admin/organization')}>
                        <ListItemText primary="Organization Units" />
                        <OrganizationIcon />
                    </ListItem>
                    <ListItem button onClick={() => handleNavigation('/admin/user')}>
                        <ListItemText primary="Users Management" />
                        <PeopleIcon />
                    </ListItem>
                    <ListItem button onClick={() => handleNavigation('/admin/history')}>
                        <ListItemText primary="Discharge History" />
                        <HistoryIcon />
                    </ListItem>
                    <ListItem button onClick={() => handleNavigation('/admin/pendingDischarges')}>
                        <ListItemText primary="Pending Demands" />
                        <PendingActionsIcon />
                    </ListItem>
                    <ListItem button onClick={() => handleNavigation('/admin/profile')} sx={{ justifyContent: 'center' }}>
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
                            Admin's Dashboard
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <NotificationComponent />
                            <IconButton
                                color="primary"
                                onClick={handleLogout}
                                sx={{ borderColor: '#FFFFFF', color: '#FFFFFF', '&:hover': { borderColor: '##FFFFFF', color: '##FFFFFF' } }}
                            >
                                <LogoutIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>

                <Box >
                    <Outlet />
                </Box>
            </Box>
        </Box>
        </AppTheme>
    );
}

export default AdminDashboardLayout;
