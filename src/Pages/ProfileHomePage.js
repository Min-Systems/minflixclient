import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTokenData, isTokenValid, getRecommendations } from '../Network';
import EditProfileForm from '../Components/EditProfileForm';
import GradientBackground from '../Components/GradientBackground';
import FilmList from '../Components/FilmList';
import Navbar from '../Components/Navbar';
import '../Styling/ProfileHomePage.css';

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
        <GradientBackground>
            <Navbar />
            <div id="overlay">
                <div className="profile-layout">

                    {/* Left side: Title + Nav Links + Sections (all stacked vertically) */}
                    <div className="left-panel">

                        {/* Title + Pencil next to each other */}
                        <div className="title-row">
                            <h2 className="title">{displayName}'s Home Page</h2>

                            {/* Pencil Button */}
                            <button className="edit-button" onClick={() => setShowEditForm(true)}>
                                ✏️
                            </button>
                        </div>

                        <div className="edit-profile-wrapper">
                            <div ref={formRef} className={`edit-profile-form-popup ${showEditForm ? 'show' : 'hide'}`}>
                                {showEditForm && (
                                    <EditProfileForm
                                        loadProfile={loadProfileData}
                                        onClose={() => setShowEditForm(false)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Nav Links */}
                        <div className="nav-links">
                            <button
                                className="section-link"
                                data-selected={activeSection === 'favorites'}
                                onClick={() => setActiveSection('favorites')}
                            >
                                Favorites
                            </button>

                            <button
                                className="section-link"
                                data-selected={activeSection === 'recommendations'}
                                onClick={() => setActiveSection('recommendations')}
                            >
                                Recommendations
                            </button>

                            <button
                                className="section-link"
                                data-selected={activeSection === 'watch-later'}
                                onClick={() => setActiveSection('watch-later')}
                            >
                                Watch Later
                            </button>
                            
                            <button
                                className="section-link"
                                data-selected={activeSection === 'watch-history'}
                                onClick={() => setActiveSection('watch-history')}
                            >
                                Watch History
                            </button>

                        
                            
                            

                        </div>

                        <div className="section-divider"></div>

                        {/* Sections appear below nav links */}
                        <div className="content-wrapper">

                                     {/* Favorites section */}
                            {activeSection === 'favorites' && (
                                <section className="favorites-section">
                                    <FilmList bannerDisplay={''} filmIds={favoriteFilmIds} isFilmBrowser={false} />
                                </section>
                            )}
                                    {/* Recommendations section */}
                            {activeSection === 'recommendations' && (
                                <section className="recommendations-section">
                                    <FilmList bannerDisplay={''} filmIds={recommendedFilmIds} isFilmBrowser={false} />
                                </section>  
                            )}
                                    {/* Watch History section */}
                            {activeSection === 'watch-history' && (
                                <section className="watch-history-section">
                                    <FilmList bannerDisplay={''} filmIds={watchHistoryFilmIds} isFilmBrowser={false} />
                                </section>
                            )}
                                    {/* Watch Later section */}
                            {activeSection === 'watch-later' && (
                                <section className="watch-later-section">
                                    <FilmList bannerDisplay={''} filmIds={watchLaterFilmIds} isFilmBrowser={false} />
                                </section>

                            )}

                        </div>

                    </div>

                </div>
            </div>
        </GradientBackground>
    );
};

export default ProfileHomePage;