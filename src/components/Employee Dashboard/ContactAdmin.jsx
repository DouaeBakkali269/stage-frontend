import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Paper, Box, List, ListItem, ListItemText } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import NotificationsIcon from '@mui/icons-material/Notifications';

const ContactAdmin = () => {
    const [message, setMessage] = useState('');
    const [userNotifications, setUserNotifications] = useState([]); // Ensure it's initialized as an array
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");

    const displayNotifications = () => {
        axios.get(`http://localhost:8080/api/notifications/user/${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                // Ensure response data is an array
                if (Array.isArray(response.data)) {
                    setUserNotifications(response.data);
                } else {
                    console.error('Unexpected response format', response.data);
                    setUserNotifications([]); // Fallback to empty array if response isn't what you expect
                }
            })
            .catch(error => {
                console.error('There was an error fetching the user notifications!', error);
            });
    }

    // Fetch notifications when the component loads
    useEffect(() => {
        displayNotifications();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const notification = { message, sender: username, receiver: 'Admin', isRead: false };

        axios.post('http://localhost:8080/api/notifications/send', notification, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setUserNotifications((prevUserNotifications) => [...prevUserNotifications, response.data]);
                setMessage('');
            })
            .catch(error => {
                console.error('There was an error sending the notification!', error);
            });

        displayNotifications(); // Fetch the updated notifications
    };

    return (
        <Container>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Paper elevation={3} style={{ padding: '18px', width: '100%', maxWidth: '1000px' }}>
                <h2>Contact Admin</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            placeholder="Type your notification here..."
                            fullWidth
                            margin="normal"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            variant="outlined"
                            style={{
                                flex: 1,
                                width: 500,
                                marginRight: '8px',
                                backgroundColor: '#f0f0f0', // Light background color
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SendIcon />}
                        >
                            Send
                        </Button>
                    </form>
               <h2>Sent Notifications</h2>
                    <List>
                        {Array.isArray(userNotifications) && userNotifications.length > 0 ? (
                            userNotifications.map((notification) => (
                                <ListItem key={notification.id}>
                                    <NotificationsIcon color="secondary" />
                                    <ListItemText
                                        primary={notification.message}
                                        secondary={`To: ${notification.receiver}`}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <Typography align="center">No notifications sent yet</Typography>
                        )}
                    </List>
                </Paper>
            </Box>
        </Container>
    );
};

export default ContactAdmin;
