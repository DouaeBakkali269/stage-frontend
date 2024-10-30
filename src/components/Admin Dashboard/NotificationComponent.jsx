import React, { useEffect, useState } from 'react';
import { Badge, IconButton, Snackbar, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import axios from 'axios';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch notifications when component mounts
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get('http://localhost:8080/api/notifications/admin', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const fetchedNotifications = response.data;
      setNotifications(fetchedNotifications);

      // Calculate and set the unread notifications count
      const unreadNotifications = fetchedNotifications.filter(notification => !notification.read); // Change to read
      setUnreadCount(unreadNotifications.length); // Set the count of unread notifications
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };


  useEffect(() => {
    fetchNotifications();  // Fetch notifications when component mounts
  }, []);

  // Function to mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // Get the IDs of unread notifications
      const unreadNotificationIds = notifications
        .filter(notification => !notification.Read) // Accessing property directly
        .map(notification => notification.id);

      // Send the unread notification IDs to the backend to mark them as read
      await axios.put('http://localhost:8080/api/notifications/markAsRead', unreadNotificationIds, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Update local state to mark all notifications as read
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, Read: true })) // Directly updating property
      );

      // Reset unread count to 0
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleNotificationIconClick = () => {
    if (unreadCount > 0) {
      markAllAsRead();  // Mark all notifications as read
      setSnackbarMessage(`You had ${unreadCount} new notifications`);
      setOpenSnackbar(true);
    }

    // Open the dialog to display notifications
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUnreadCount(0);
  };

  return (
    <div>
      {/* Notification Icon with Unread Count Badge */}
      <IconButton color="inherit" onClick={handleNotificationIconClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Snackbar to show unread notification count after click */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />

      {/* Dialog to show the list of notifications */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent>
          <List>
            {notifications.map(notification => (
              <ListItem key={notification.id}>
                <ListItemIcon>
                  <MailIcon color={notification.isRead ? "disabled" : "primary"} />
                </ListItemIcon>
                <ListItemText
                  primary={notification.sender}
                  secondary={notification.message}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationComponent;
