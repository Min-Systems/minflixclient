import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTokenData, isTokenValid } from '../Network';
import EditProfileForm from '../Components/EditProfileForm';
import GradientBackground from '../Components/GradientBackground';
import ActionButton from '../Components/ActionButton';
import Navbar from '../Components/Navbar';
import '../Styling/ProfileHomePage.css';

/*
  Page that allows users to see everything about a specific profile
*/
const ProfileHomePage = () => {
    const navigate = useNavigate();
    const { profileId } = useParams();
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = () => {
        try {
            // Check token validity
            if (!isTokenValid()) {
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            // Get token data
            const tokenData = getTokenData();

            // Get and set display name
            for (let i = 0; i < tokenData.profiles.length; i++) {
                if (tokenData.profiles[i].id == profileId) {
                    setDisplayName(tokenData.profiles[i].displayname);
                }
            }

        } catch (error) {
            console.log(`Error in loadProfiles: ${error.message}`);
        }
    };

    return (
        <GradientBackground>
            <Navbar/>
            <div id='overlay'>
                <h2 className='content'> {displayName}'s Home Page</h2>
                <EditProfileForm loadProfile={loadProfileData} />
                <div className='buttonRow'>
                    
                </div>
            </div>
        </GradientBackground>
    );

};

export default ProfileHomePage;