import React, { useState, useEffect, use } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFilmData } from '../Network';
import FilmList from '../Components/FilmList';

const FilmBrowserPage = () => {
    const navigate = useNavigate();
    const { profileId } = useParams();
    const [filmIds, setFilmIds] = useState([]);

    useEffect(() => {
        loadFilmData();
    }, []);

    const loadFilmData = async () => {
        try {
            // get film data from getfilms endpoint
            const filmData = await getFilmData();
            // turn the string into a js object
            const films = JSON.parse(filmData);

            console.log(films);

            // access each array element
            films.forEach(film => {
                console.log(`Film ID: ${film.id}, Title: ${film.title}, Name: ${film.image_name}`);
            });

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
            <FilmList filmIds={filmIds} isFilmBrowser={true} />
            <button onClick={() => { navigate(`/profile/${profileId}`) }}>Back to profile</button>
        </div>
    );
};

export default FilmBrowserPage;