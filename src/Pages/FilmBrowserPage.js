import React, { useState, useEffect, use } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFilmData } from '../Network';
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
            // add the ability to check if the films are added
            // get film data from getfilms endpoint
            const filmData = await getFilmData();
            // turn the string into a js object
            const films = JSON.parse(filmData);

            console.log(films);

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
            <FilmList bannerDisplay= {'Browse Films'} filmIds={filmIds} isFilmBrowser={true} profileId={profileId}/>
            <button onClick={() => { navigate(`/profile/${profileId}`) }}>Back to profile</button>
        </div>
    );
};

export default FilmBrowserPage;