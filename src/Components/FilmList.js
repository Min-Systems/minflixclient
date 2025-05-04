import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { addFavorite, addWatchLater, addWatchHistory } from '../Network';
import ActionButton from './ActionButton';
import network from '../Network';
import FilmBrowserPage from '../Styling/FilmBrowserPage.css';
const { API_BASE_URL } = network;

/*
  This component displays a list of films using a list of filmIds
*/
const FilmList = ({ bannerDisplay, filmIds, isFilmBrowser, profileId }) => {
    const [filmList, setFilmList] = useState([]);
    const navigate = useNavigate();

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

    const watchFilm = async (filmId) => {
        // Navigate to the watch film page with the film ID
        await handleAddWatchHistory(filmId);
        navigate(`/watch/${filmId}`, { state: { profileId } });
    };

    const handleAddWatchHistory = async (filmId) => {
        try {
            // Add to watch history since the user is watching the film
            const newToken = await addWatchHistory(profileId, filmId);

            localStorage.setItem('authToken', newToken);
        } catch(error) {
            console.error('Error adding to the watch history:', error);
        }
    };

    const handleAddWatchLater = async (filmId) => {
        try {
            const newToken = await addWatchLater(profileId, filmId);
            
            localStorage.setItem('authToken', newToken);
        } catch (error) {
            console.error('Error adding to watch later:', error);
        }
    };

    const handleAddFavorite = async (filmId) => {
        try {
            const newToken = await addFavorite(profileId, filmId);

            localStorage.setItem('authToken', newToken);
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    return (
        <div>
            <h2>{bannerDisplay}</h2>
            {filmList.length > 0 ? (
                filmList.map((film) => (
                    <div key={film.id} className='filmItem'>
                        <h3>{film.title}</h3>
                        <img className='thumbnail'
                            src={`${API_BASE_URL}/images/${film.image_name}`}
                            alt={film.title}
                            loading='lazy'
                        />
                        
                        {/* Conditional rendering of buttons based on isFilmBrowser prop */}
                        {isFilmBrowser && (
                            <div className="film-actions buttonRow">
                                <ActionButton
                                    label="Watch Film" 
                                    className="watch-button"
                                    onClick={() => watchFilm(film.id)}
                                />
                                    
                                
                                <ActionButton
                                    label="Add to Watch Later" 
                                    className="watchlater-button"
                                    onClick={() => handleAddWatchLater(film.id)}
                                />

                                <ActionButton
                                    label="Add to Favorites" 
                                    className="favorite-button"
                                    onClick={() => handleAddFavorite(film.id)}
                                />
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No films to display</p>
            )}
        </div>
    );
};

export default FilmList;