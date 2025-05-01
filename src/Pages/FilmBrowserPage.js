import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FilmList from '../Components/FilmList';
import GradientBackground from '../Components/GradientBackground';
import ActionButton from '../Components/ActionButton';
import Navbar from '../Components/Navbar';
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
          <Navbar hasSearch={false}/>
          <div>
            <FilmList bannerDisplay={'All Films'} filmIds={filmIds} profileId={profileId} isFilmBrowser={true} />
            <ActionButton label='Return to profile' onClick={() => navigate(`/profile/${profileId}`)}/>
          </div>
        </GradientBackground>
    );
};

export default FilmBrowserPage;