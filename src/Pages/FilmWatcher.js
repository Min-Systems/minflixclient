import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router';
import network from '../Network';
import GradientBackground from '../Components/GradientBackground';
import ActionButton from '../Components/ActionButton';
const { API_BASE_URL } = network;

const FilmWatcher = () => {
    const { filmId } = useParams();
    const [filmName, setFilmName] = useState('');
    const [source, setSource] = useState(null);
    const location = useLocation();
    const { profileId } = location.state || {};
    const navigate = useNavigate();

    useEffect(() => {
        const filmData = localStorage.getItem('films');
        const films = JSON.parse(filmData || '[]');

        // Find the matching film by ID
        const film = films.find(film => film.id == filmId);

        if (film) {
            setFilmName(film.title);
            setSource(`${API_BASE_URL}/film/${film.file_name}`);
        }
    }, [filmId, API_BASE_URL]);

    return (
        <GradientBackground>
            <h2>{filmName}</h2>
            {source ? (
                <video width="1200" controls>
                    <source src={source} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <p>Loading video...</p>
            )}
            <ActionButton 
                label="Return to films" 
                onClick={() => navigate(`/browse/${profileId || ''}`)} 
            />
        </GradientBackground>
    );
};

export default FilmWatcher;
