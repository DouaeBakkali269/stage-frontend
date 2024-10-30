import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';  // Import the new CSS
import AppTheme from '../Authentification/AppTheme';
const UserProfile = () => {
    const [user, setUser] = useState({
        nom: '',
        prenom: '',
        cin: '',
        email: '',
        role: '',
        phoneNumber: '',
        address: '',
        nationality: '',
        position: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });


    useEffect(() => {
        const storedId = localStorage.getItem('id'); // Fetch the stored user ID
        const token = localStorage.getItem('authToken'); // Fetch the stored token
        const role = localStorage.getItem('role').replace('ROLE_', '');

        // Fetch user data by ID
        axios.get(`http://localhost:8080/api/users/${storedId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                const userData = response.data;
                setUser({
                    nom: userData.nom || '',
                    prenom: userData.prenom || '',
                    cin: userData.cin || '',
                    email: userData.email || '',
                    role: role,
                    phoneNumber: userData.phoneNumber || '',
                    address: userData.address || '',
                    nationality: userData.nationality || '',
                    position: userData.position || ''
                });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []); // Fetch once when the component mounts


    // Handle profile update form submission
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
        const storedId = localStorage.getItem('id');

        axios.put(`http://localhost:8080/api/users/${storedId}`, user, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data);
                alert('Profile updated successfully');
            })
            .catch(error => {
                console.error('Error updating profile', error);
            });
    };

    // Handle password change form submission
    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New password and confirmation do not match');
            return;
        }
        const token = localStorage.getItem("authToken");
        axios.post('http://localhost:8080/api/users/update-password', {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                alert('Password updated successfully');
            })
            .catch(error => {
                console.error('Error updating password', error);
            });

    };

    return (
        <AppTheme>
        <section className="container">
            <header>
                <h2 >
                  <span> <strong>Personnal information</strong> </span>
                </h2>
                <hr />
            </header>


            <form onSubmit={handleProfileUpdate}>
                <div className="row" >
                    <div className="col">
                        <div>
                            <label htmlFor="firstName"><strong>First Name:</strong></label>
                            <input
                                id="firstName"
                                type="text"
                                value={user.prenom}
                                onChange={(e) => setUser({ ...user, prenom: e.target.value })}
                                required
                            />
                        </div>
                        <div >
                            <label htmlFor="lastName"><strong>Last Name:</strong></label>
                            <input
                                id="lastName"
                                type="text"
                                value={user.nom}
                                onChange={(e) => setUser({ ...user, nom: e.target.value })}
                                required
                            />
                        </div>
                        <div >
                            <label htmlFor="email"><strong>Email:</strong></label>
                            <input
                                id="email"
                                type="email"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber"><strong>Phone Number:</strong></label>
                            <input
                                id="phoneNumber"
                                type="text"
                                value={user.phoneNumber}
                                onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="col">
                        <div >
                            <label htmlFor="nationality"><strong>Nationality:</strong></label>
                            <input
                                id="nationality"
                                type="text"
                                value={user.nationality}
                                onChange={(e) => setUser({ ...user, nationality: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="cin"><strong>CIN:</strong></label>
                            <input
                                id="cin"
                                type="text"
                                value={user.cin}
                                onChange={(e) => setUser({ ...user, cin: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="address"><strong>Address:</strong></label>
                            <input
                                id="address"
                                type="text"
                                value={user.address}
                                onChange={(e) => setUser({ ...user, address: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="position"><strong>Position:</strong></label>
                            <input
                                id="position"
                                type="text"
                                value={user.position}
                                onChange={(e) => setUser({ ...user, position: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn">Update Profile</button>
            </form>

            <br />
            <div className='change-password'>
                <h1><strong>change password</strong></h1>
                <hr />
                <form onSubmit={handlePasswordChange}>
                    <div>
                        <label sx={{color:'# DDA0DD'}}><strong>Current Password:</strong></label>
                        <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label><strong>New Password:  </strong></label>
                        <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label><strong>Confirm Password:</strong></label>
                        <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Update Password</button>
                </form>
            </div>
        </section>
        </AppTheme>
    );
};

export default UserProfile;
