import React, { useState, useEffect, use } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import { getTokenData, isTokenValid } from '../Network';
import FilmList from '../Components/FilmList';
import EditProfileForm from '../Components/EditProfileForm';
import FilmWatcher from './FilmWatcher';
import GradientBackground from '../Components/GradientBackground';
import ActionButton from '../Components/ActionButton';

/*
  This is the page that allows a user to view their favorite films
*/
const FavoritePage = () => {
    const navigate = useNavigate();
    const { profileId } = useParams();
    const [favoriteFilmIds, setFavoriteFilmIds] = useState([]);

    useEffect(() => {
        loadFavorites();        
    },[]);

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

    return (
        <GradientBackground>
            <FilmList bannerDisplay={'Favorited Films'} filmIds={favoriteFilmIds} isFilmBrowser={false}/>
            <ActionButton label='Return to profile' onClick={() => navigate(`/profile/${profileId}`) } />
        </GradientBackground>
    );
}

export default FavoritePage;