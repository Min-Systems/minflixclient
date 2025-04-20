import React, { useState, useEffect, use } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFilmData } from '../Network';
import FilmList from '../Components/FilmList';
import GradientBackground from '../Components/GradientBackground';
import ActionButton from '../Components/ActionButton';

/*
  This is the page which allows a user to browse all films
*/
const FilmBrowserPage = () => {
    const navigate = useNavigate();
    const { profileId } = useParams();
    const [filmIds, setFilmIds] = useState([]);

    useEffect(() => {
        loadFilmData();
    }, []);

    const loadFilmData = async () => {
        try {
            // get the films from memory
            const filmData = localStorage.getItem('films');
            // parse the films into useable format
            const films = JSON.parse(filmData);
            // get the film titles and put them into the state
            const filmIds = films.map(film => film.id);
            // set the film ids
            setFilmIds(filmIds);
        } catch (error) {
            console.log(`Error in loadProfiles: ${error.message}`);
        }
    };

    return (
        <GradientBackground>
          <div>
            <FilmList filmIds={filmIds} isFilmBrowser={true} />
            <ActionButton label='Back to Profile' onClick={() => { navigate(`/profile/${profileId}`) }} />
          </div>
        </GradientBackground>
    );
};

export default FilmBrowserPage;