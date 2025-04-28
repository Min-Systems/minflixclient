import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTokenData } from '../Network';
import FilmList from '../Components/FilmList';
import GradientBackground from '../Components/GradientBackground';
import ActionButton from '../Components/ActionButton';
import Navbar from '../Components/Navbar';

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
            <Navbar />
            <FilmList bannerDisplay={'Favorited Films'} filmIds={favoriteFilmIds} isFilmBrowser={false}/>
        </GradientBackground>
    );
}

export default FavoritePage;