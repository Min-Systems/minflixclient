import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getTokenData, isTokenValid, getRecommendations } from '../Network';
import EditProfileForm from '../Components/EditProfileForm';
import GradientBackground from '../Components/GradientBackground';
import FilmList from '../Components/FilmList';
import FilmSearchForm from '../Components/FilmSearchForm';
import ActionButton from '../Components/ActionButton';
import Navbar from '../Components/Navbar';

const ProfileHomePage = () => {
    const navigate = useNavigate();
    const { profileId } = useParams();
    const [displayName, setDisplayName] = useState('');
    const [recommendedFilmIds, setRecommendedFilmIds] = useState([]);

    useEffect(() => {
        loadProfileData();
        fetchRecommendations();
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

    return (
        <div className='main-content'>
            <GradientBackground>
            <Navbar profileId={profileId} hasSearch={true} />
                <div id='overlay'>
                    <h2> {displayName}'s Home Page</h2>
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