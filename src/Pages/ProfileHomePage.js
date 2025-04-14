import React, { useState, useEffect, use } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import { getTokenData, isTokenValid, getFilmData } from '../Network';
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
            console.log(`The profile from load watch later: ${JSON.stringify(profile)}`);
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
        <div>
            <h2>Profile Home Page</h2>
            <EditProfileForm loadProfile={loadProfileData} />
            <p>Profile for {displayName}</p>
            <button onClick={() => navigate('/profiles')}>Back to profiles</button>
            <button onClick={() => navigate(`/browse/${profileId}`)}>Browse Films</button>
            <FilmList bannerDisplay={'Favorite Films'} filmIds={favoriteFilmIds} isFilmBrowser={false} profileId={profileId}/>
            <FilmList bannerDisplay={'Films to Watch Later'} filmIds={watchLaterFilmIds} isFilmBrowser={false} profileId={profileId}/>
        </div>
    );

};

export default ProfileHomePage;