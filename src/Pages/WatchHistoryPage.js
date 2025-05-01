import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTokenData } from '../Network';
import FilmList from '../Components/FilmList';
import GradientBackground from '../Components/GradientBackground';
import ActionButton from '../Components/ActionButton';
import Navbar from '../Components/Navbar';

/*
  This is the page that allows a user to see their watch history
*/
const WatchHistoryPage = () => {
  const navigate = useNavigate();
  const { profileId } = useParams();
  const [watchHistoryFilmIds, setWatchHistoryFilmIds] = useState([]);

  useEffect(() => {
    loadWatchHistory();
  }, []);

  const loadWatchHistory = () => {
    // Get token data
    const tokenData = getTokenData();
    // Get the right profile object
    const profile = tokenData.profiles.find(profile => profile.id == profileId);
    // Get the watch history list
    const watchHistoryFilmIds = profile.watch_history.map(item => item.film_id);
    // Set the watch history film ids
    setWatchHistoryFilmIds(watchHistoryFilmIds);
  }

  return (
    <GradientBackground>
      <Navbar hasSearch={false} />
      <div>
        <FilmList bannerDisplay={'Watch History'} filmIds={watchHistoryFilmIds} isFilmBrowser={false} />
        <ActionButton label='Return to profile' onClick={() => navigate(`/profile/${profileId}`)} />
      </div>
    </GradientBackground>
  );
};

export default WatchHistoryPage;