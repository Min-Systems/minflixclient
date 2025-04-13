import React, { useState, useEffect, use } from 'react';
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
    const [filmIds, setFilmIds] = useState([]);

    useEffect(() => {
        loadProfileData();
        loadFilmData();
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

    const loadFilmData = async () => {
        try {
            // get film data from getfilms endpoint
            const filmData = await getFilmData();
            // turn the string into a js object
            const films = JSON.parse(filmData);

            /*
            console.log(films);

            // access each array element
            films.forEach(film => {
                console.log(`Film ID: ${film.id}, Title: ${film.title}, Name: ${film.image_name}`);
            });
            */

            // get the film titles and put them into the state
            const filmIds = films.map(film => film.id);
            setFilmIds(filmIds);

            // place data in localStorage
            localStorage.setItem('films', JSON.stringify(films));
        } catch (error) {
            console.log(`Error in loadProfiles: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Profile Home Page</h2>
            <EditProfileForm loadProfile={loadProfileData} />
            <p>Profile for {displayName}</p>
            <button onClick={() => navigate('/profiles')}>Back to profiles</button>
            { /*<FilmList filmIds={filmIds} isFilmBrowser={false}/> */ }
            <button onClick={() => navigate(`/browse/${profileId}`)}>Browse Films</button>
        </div>
    );

};

export default ProfileHomePage;