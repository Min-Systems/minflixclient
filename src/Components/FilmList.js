import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addProfile, editProfile, getTokenData, isTokenValid, getAuthToken } from '../Network';
import network from '../Network';
const { API_BASE_URL } = network;

/*
    This component displays a list of films using a list of filmIds
*/
const FilmList = ({ filmIds, isFilmBrowser, profileId }) => {
    const [filmList, setFilmList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Only run this if filmIds exists and is an array
        if (filmIds && Array.isArray(filmIds)) {
            getFilmsToRender();
        }
        console.log(`In filmList component profileId: ${profileId}`)
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

    const watchFilm = (filmId) => {
        // Navigate to the watch film page with the film ID
        navigate(`/watch/${filmId}`, { state: { profileId } });
    };

    const addToWatchLater = async (filmId) => {
        try {
            // Add implementation for adding to watch later
            // This would typically be an API call
            console.log(`Adding film ${filmId} to watch later list`);
            // Example: await addToWatchLaterAPI(filmId);
            alert('Film added to watch later!');
        } catch (error) {
            console.error('Error adding to watch later:', error);
            alert('Failed to add film to watch later');
        }
    };

    const addToFavorites = async (filmId) => {
        try {
            // Add implementation for adding to favorites
            // This would typically be an API call
            console.log(`Adding film ${filmId} to favorites`);
            // Example: await addToFavoritesAPI(filmId);
            alert('Film added to favorites!');
        } catch (error) {
            console.error('Error adding to favorites:', error);
            alert('Failed to add film to favorites');
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
                        
                        {/* Conditional rendering of buttons based on isFilmBrowser prop */}
                        {isFilmBrowser && (
                            <div className="film-actions">
                                <button 
                                    className="watch-button"
                                    onClick={() => watchFilm(film.id)}
                                >
                                    Watch Film
                                </button>
                                <button 
                                    className="watchlater-button"
                                    onClick={() => addToWatchLater(film.id)}
                                >
                                    Add to Watch Later
                                </button>
                                <button 
                                    className="favorite-button"
                                    onClick={() => addToFavorites(film.id)}
                                >
                                    Add to Favorites
                                </button>
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