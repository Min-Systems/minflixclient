import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTokenData, isTokenValid, getRecommendations } from '../Network';
import EditProfileForm from '../Components/EditProfileForm';
import GradientBackground from '../Components/GradientBackground';
import ActionButton from '../Components/ActionButton';
import FilmSearchForm from '../Components/FilmSearchForm';
import FilmList from '../Components/FilmList';

/*
  Page that allows users to see everything about a specific profile
  and recommended films based on watch history
*/
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

    // Fetch recommended films
    const fetchRecommendations = async () => {
        try {
            const response = await getRecommendations(profileId);
            // Backend returns json response with film objects
            const recommendedFilms = JSON.parse(response);
            const filmIds = recommendedFilms.map(film => film.id);
            setRecommendedFilmIds(filmIds);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    return (
        <GradientBackground>
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
                <FilmSearchForm profileId={profileId}/>
            </div>
        </GradientBackground>
    );

};

export default ProfileHomePage;