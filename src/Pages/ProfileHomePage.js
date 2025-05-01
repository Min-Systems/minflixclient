import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTokenData, isTokenValid, getRecommendations } from '../Network';
import EditProfileForm from '../Components/EditProfileForm';
import GradientBackground from '../Components/GradientBackground';
import FilmList from '../Components/FilmList';
import FilmSearchForm from '../Components/FilmSearchForm';
import Navbar from '../Components/Navbar';

const ProfileHomePage = () => {
    const navigate = useNavigate();
    const formRef = useRef(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const { profileId } = useParams();
    const [displayName, setDisplayName] = useState('');
    const [activeSection, setActiveSection] = useState('favorites'); // Default to Favorites
    const [favoriteFilmIds, setFavoriteFilmIds] = useState([]);
    const [watchHistoryFilmIds, setWatchHistoryFilmIds] = useState([]);
    const [watchLaterFilmIds, setWatchLaterFilmIds] = useState([]);
    const [recommendedFilmIds, setRecommendedFilmIds] = useState([]);

    useEffect(() => {
        loadProfileData();
        fetchRecommendations();
        loadFavorites();
        loadWatchHistory();
        loadWatchLater();
    }, []);

    const loadProfileData = () => {
        try {
            if (!isTokenValid()) {
                setTimeout(() => navigate('/'), 3000);
                return;
            }
            const tokenData = getTokenData();
            const profile = tokenData.profiles.find(p => p.id == profileId);
            if (profile) {
                setDisplayName(profile.displayname);
            }
        } catch (error) {
            console.log(`Error loading profile: ${error.message}`);
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setShowEditForm(false);
            }
        }

        if (showEditForm) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEditForm]);

    // Fetch recommendations from the server
    const fetchRecommendations = async () => {
        try {
            const response = await getRecommendations(profileId);
            //backend returns json response with film object
            const recommendedFilms = JSON.parse(response);
            const filmIds = recommendedFilms.map(film => film.id);
            setRecommendedFilmIds(filmIds);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    const loadFavorites = () => {
        try {
            const tokenData = getTokenData();
            const profile = tokenData.profiles.find(p => p.id == profileId);
            const favoriteIds = profile.favorites.map(item => item.film_id);
            setFavoriteFilmIds(favoriteIds);
        } catch (error) {
            console.log(`Error loading favorites: ${error.message}`);
        }
    };

    const loadWatchHistory = () => {
        try {
            const tokenData = getTokenData();
            const profile = tokenData.profiles.find(p => p.id == profileId);
            const historyIds = profile.watch_history.map(item => item.film_id);
            setWatchHistoryFilmIds(historyIds);
        } catch (error) {
            console.log(`Error loading watch history: ${error.message}`);
        }
    };

    const loadWatchLater = () => {
        try {
            const tokenData = getTokenData();
            const profile = tokenData.profiles.find(p => p.id == profileId);
            const laterIds = profile.watch_later.map(item => item.film_id);
            setWatchLaterFilmIds(laterIds);
        } catch (error) {
            console.log(`Error loading watch later: ${error.message}`);
        }
    };

    return (
        <div className='main-content'>
            <GradientBackground>
            <Navbar profileId={profileId} hasSearch={true} />
                <div id='overlay'>
                    <h2 c> {displayName}'s Home Page</h2>
                    <EditProfileForm loadProfile={loadProfileData} />
                    {/* Recommended Films */}
                    <div>
                        <h3>Recommended For You:</h3>
                        {recommendedFilmIds.length > 0 ? (
                            <FilmList
                                filmIds={recommendedFilmIds}
                                isFilmBrowser={false}
                                profileId={profileId}
                            />
                        ) : (
                            <p>No Recommendations Available...</p>
                        )}
                    </div>
                    <div className='buttonRow'>
                        <ActionButton label='Back to Profiles' onClick={() => navigate('/profiles')} />
                        <ActionButton label='Browse Films' onClick={() => navigate(`/browse/${profileId}`)} />
                        <ActionButton label='Browse Favorites' onClick={() => navigate(`/favorite/${profileId}`)} />
                        <ActionButton label='Browse Watch Later' onClick={() => navigate(`/watchlater/${profileId}`)} />
                        <ActionButton label='Browse Watch History' onClick={() => navigate(`/watchhistory/${profileId}`)} />
                    </div>
                </div>
        </GradientBackground>
        </div>
    );
};

export default ProfileHomePage;