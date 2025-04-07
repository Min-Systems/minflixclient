import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addProfile, editProfile, getTokenData, isTokenValid, getAuthToken } from '../Network';
import network from '../Network';
const { API_BASE_URL } = network;

const FilmList = ({ filmIds }) => {
    const [filmList, setFilmList] = useState([]);

    useEffect(() => {
        // Only run this if filmIds exists and is an array
        if (filmIds && Array.isArray(filmIds)) {
            getFilmsToRender();
        }
    }, [filmIds]); // Add filmIds as a dependency

    const getFilmsToRender = () => {
        try {
            // get film data from localStorage
            const filmData = localStorage.getItem('films');
            const films = JSON.parse(filmData || '[]');

            // Filter films to only include those with IDs in the filmIds prop
            const filteredFilms = films.filter(film => filmIds.includes(film.id));

            // Set the filtered list of complete film objects
            setFilmList(filteredFilms);
        } catch (error) {
            console.error('Error loading film data:', error);
            setFilmList([]);
        }
    };

    return (
        <div>
            <h2>Film List</h2>
            {filmList.length > 0 ? (
                filmList.map((film) => (
                    <div key={film.id} className='filmItem'>
                        <h3>{film.title}</h3>
                        <img
                            src={`${API_BASE_URL}/images/${film.image_name}`}
                            alt={film.title}
                            loading='lazy'
                        />
                    </div>
                ))
            ) : (
                <p>No films to display</p>
            )}
        </div>
    );
};

export default FilmList;