import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import network from '../Network';
import GradientBackground from '../Components/GradientBackground';
import ActionButton from '../Components/ActionButton';
import '../Styling/FilmWatcher.css';
import Navbar from '../Components/Navbar';

const { API_BASE_URL } = network;

const FilmWatcher = () => {
    const { filmId } = useParams();
    const [filmName, setFilmName] = useState('');
    const [source, setSource] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const { profileId } = location.state;

    const [showControls, setShowControls] = useState(true);
    const [timerId, setTimerId] = useState(null);

    useEffect(() => {
        const filmData = localStorage.getItem('films');
        const films = JSON.parse(filmData || '[]');

        const film = films.find(film => film.id == filmId);

        if (film) {
            setFilmName(film.title);
            setSource(`${API_BASE_URL}/film/${film.file_name}`);
        }

        startHideTimer();

        // Clean up timer
        return () => clearTimeout(timerId);

    }, [filmId]);

    // Start/restart the hide timer
    const startHideTimer = () => {
        if (timerId) clearTimeout(timerId);

        const newTimerId = setTimeout(() => {
            setShowControls(false);
        }, 3500);

        setTimerId(newTimerId);
    };

    // Handle mouse move
    const handleMouseMove = () => {
        setShowControls(true);
        startHideTimer();
    };

    return (
        <GradientBackground>
            <Navbar profileId={profileId} filmId={filmId} />
            <div id='filmWatcher' onMouseMove={handleMouseMove} style={{ position: 'relative' }}>
                {filmName ? (
                    <>
                        <div className="video-wrapper">
                            {showControls && (
                                <div className="video-overlay-controls">
                                    <button className="back-button" onClick={() => navigate(-1)}>
                                        ←
                                    </button>
                                </div>
                            )}

                            <video width='100%' controls muted='muted'>
                                <source src={source} type='video/mp4' />
                            </video>
                        </div>
                    </>
                ) : (
                    <p>Loading film...</p>
                )}
            </div>
        </GradientBackground>
    );
};

export default FilmWatcher;
