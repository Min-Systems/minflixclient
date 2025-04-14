import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../Components/LogoutButton';
import { addProfile, editProfile, getTokenData, isTokenValid } from '../Network';
import './ProfilePickerPage.css';
import ActionButton from '../Components/ActionButton';
import GradientBackground from '../Components/GradientBackground';

/*
    Page that allows the user to edit and choose profiles
*/
const ProfilePickerPage = () => {
    const [profiles, setProfiles] = useState([]);
    const [displayName, setDisplayName] = useState('');
    const [newDisplayName, setNewDisplayName] = useState('');
    const [showEditProfileForm, setShowEditProfileForm] = useState(false);
    const [showAddProfileForm, setShowAddProfileForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = () => {
        try {
            // Check token validity
            if (!isTokenValid()) {
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            // Get token data
            const tokenData = getTokenData();

            // Set the profile data
            setProfiles(tokenData.profiles);
            // Close the form

        } catch (error) {
            console.log(`Error in loadProfiles: ${error.message}`);
        }
    };

    const handleAddProfileSubmit = async (event) => {
        event.preventDefault();

        try {
            // Check token validity before attempting request
            if (!isTokenValid()) {
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            // Use the API function from network.js
            const newToken = await addProfile(displayName);

            // Success!
            localStorage.setItem('authToken', newToken);

            setDisplayName('');
            loadProfiles();
            setShowAddProfileForm(false);
        } catch (error) {
            console.log(`Error in loadProfiles: ${error.message}`);
        }

    };

    const handleEditProfileSubmit = async (event) => {
        event.preventDefault();

        try {
            // Check token validity before attempting request
            if (!isTokenValid()) {
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            // Use the API function from network.js
            const newToken = await editProfile(displayName, newDisplayName);

            // Success!
            localStorage.setItem('authToken', newToken);

            setDisplayName('');
            setNewDisplayName('');
            loadProfiles();
            setShowEditProfileForm(false);
        } catch (error) {
            console.log(`Error in loadProfiles: ${error.message}`);
        }

    };

    const handleProfileSelect = (profileId) => {
       navigate(`/profile/${profileId}`);
    };

    return (
        <GradientBackground>
            <div id='overlay'>
                <h2>Profile Dashboard</h2>

                <div id='profileListContainer'>
                    {profiles.length === 0 ? (
                        <p>No profiles yet. Click 'Add Profile' to create one.</p>
                    ) : (
                        <ul id='profileList'>
                            {profiles.map(profile => (
                                <li key={profile.id} id='profileListItem'>
                                    <button
                                        id='profileButton'
                                        onClick={() => handleProfileSelect(profile.id)}
                                    >
                                        {profile.displayname}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="buttonRow">
                    <ActionButton label="Edit Profile" onClick={() => setShowEditProfileForm(true)} />
                    <ActionButton label="Add Profile" id="showAddProfileButton" onClick={() => setShowAddProfileForm(true)} />
                </div>

                <div id='editProfileFormContainer'>
                    {showEditProfileForm && (
                        <form id='editProfileForm' className='profile-form' onSubmit={handleEditProfileSubmit}>
                            <input
                                type='text'
                                placeholder='Enter display name'
                                name='displayname'
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                            />
                            <input
                                type='text'
                                placeholder='Enter new display name'
                                name='newDisplayName'
                                value={newDisplayName}
                                onChange={(e) => setNewDisplayName(e.target.value)}
                                required
                            />
                            <ActionButton label="Submit" type='submit' />
                            <ActionButton label="Close" onClick={() => setShowEditProfileForm(false)} id='closeButton' />
                        </form>
                    )}
                </div>

                <div id='addProfileFormContainer'>
                    {showAddProfileForm && (
                        <form id='addProfileForm' className='profile-form' onSubmit={handleAddProfileSubmit}>
                            <input
                                type='text'
                                placeholder='Enter display name'
                                name='displayname'
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                            />
                            <ActionButton label="Submit" type='submit' />
                            <ActionButton label="Close" onClick={() => setShowAddProfileForm(false)} id='closeButton' />
                        </form>
                    )}
                </div> 
                    <div id="logoutButtonContainer">
                        <LogoutButton />
                    </div>
            </div>
        </GradientBackground>
    );
};

export default ProfilePickerPage;