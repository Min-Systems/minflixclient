import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import network from '../Network';
import GradientBackground from '../Components/GradientBackground';
import ActionButton from '../Components/ActionButton';
const { API_BASE_URL } = network;

/*
  This component allows a user to stream a film
*/
const FilmWatcher = () => {
    const { filmId } = useParams();
    const [filmName, setFilmName] = useState('');
    const [source, setSource] = useState('');
    const location = useLocation();
    const { profileId } = location.state;
    const navigate = useNavigate();


    useEffect(() => {
        // Get film data from localStorage
        const filmData = localStorage.getItem('films');
        const films = JSON.parse(filmData || '[]');

        // Find the matching film by ID
        const film = films.find(film => film.id == filmId);

        if (film) {
            setFilmName(film.title);
            setSource(`${API_BASE_URL}/film/${film.file_name}`);
        }
    }, [filmId]); // Only run when filmId changes

    return (
        <GradientBackground>
            <h2>{filmName}</h2>
            <video width='1200' controls muted='muted'>
                <source src={source} type='video/mp4' />
            </video>
            <ActionButton label='Return to films'onClick={() => navigate(`/browse/${profileId}`)} />
        </GradientBackground>
    );
};

export default FilmWatcher;