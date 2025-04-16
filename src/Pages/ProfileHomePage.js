import React, { useState, useEffect, use } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import { getTokenData, isTokenValid } from '../Network';
import FilmList from '../Components/FilmList';
import EditProfileForm from '../Components/EditProfileForm';
import FilmWatcher from './FilmWatcher';

/*
    Page that allows users to see everything about a specific profile
*/
const ProfileHomePage = () => {
    const navigate = useNavigate();
    const { profileId } = useParams();
    const [displayName, setDisplayName] = useState('');
    const [favoriteFilmIds, setFavoriteFilmIds] = useState([]);
    const [watchLaterFilmIds, setWatchLaterFilmIds] = useState([]);

    useEffect(() => {
        loadProfileData();
        loadFavorites();
        loadWatchLater();
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

    const loadFavorites = () => {
        try {
            // Get token data
            const tokenData = getTokenData();
            // Get the right profile object
            const profile = tokenData.profiles.find(profile => profile.id == profileId);
            // Get the list of favorites
            const favoriteFilmIds = profile.favorites.map(item => item.film_id);
            // Set the favorite film ids
            setFavoriteFilmIds(favoriteFilmIds);
        }
        catch (error) {
            console.log(`Error in loadFavorites: ${error.message}`);
        }
    };

    const loadWatchLater = () => {
        try {
            // Get token data
            const tokenData = getTokenData();
            // Get the right profile object
            const profile = tokenData.profiles.find(profile => profile.id == profileId);
            // Get the list of favorites
            const watchLaterFilmIds = profile.watch_later.map(item => item.film_id);
            // Set the favorite film ids
            setWatchLaterFilmIds(watchLaterFilmIds);
        }
        catch (error) {
            console.log(`Error in loadWatchLater: ${error.message}`);
        }
    };

    return (
        <GradientBackground>
          <div id ="overlay">
            <h2 c> {displayName}'s Home Page</h2>

              <EditProfileForm  loadProfile={loadProfileData} />
            
            <div className='buttonRow'>
              <ActionButton label="Back to Profiles" onClick={() => navigate('/profiles')} />
            { /*<FilmList filmIds={filmIds} isFilmBrowser={false}/> */ }
            <ActionButton label="Browser Films" onClick={() => navigate(`/browse/${profileId}`)} />
            </div>
          </div>
     </GradientBackground>
    );

};

export default ProfileHomePage;