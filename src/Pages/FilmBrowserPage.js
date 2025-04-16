import React, { useState, useEffect, use } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FilmList from '../Components/FilmList';

/*
    Page that allows a user to browse every film
    It does this with a FilmList component which has a prop to display all films
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
        <div>
            <button onClick={() => { navigate(`/profile/${profileId}`) }}>Back to profile</button>
            <FilmList bannerDisplay= {'Browse Films'} filmIds={filmIds} isFilmBrowser={true} profileId={profileId}/>
        </div>
    );
};

export default FilmBrowserPage;