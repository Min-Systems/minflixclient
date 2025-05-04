import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getTokenData } from '../Network';
import FilmList from '../Components/FilmList';
import GradientBackground from '../Components/GradientBackground';
import ActionButton from '../Components/ActionButton';
import Navbar from '../Components/Navbar';

/*
  This is the page that allows a user to see their films to watch later 
*/
const WatchLaterPage = () => {
    const navigate = useNavigate();
    const { profileId } = useParams();
    const [watchLaterFilmIds, setWatchLaterFilmIds] = useState([]);

    useEffect(() => {
        loadWatchLater();
    }, []);

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
            <Navbar hasSearch={false} />
            <div>
                <FilmList bannerDisplay={'Watch Later'} filmIds={watchLaterFilmIds} isFilmBrowser={false} />
                <ActionButton label='Return to profile' onClick={() => navigate(`/profile/${profileId}`)} />
            </div>
        </GradientBackground>
    );
};

export default WatchLaterPage;