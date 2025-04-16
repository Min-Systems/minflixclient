import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import network from '../Network';
import GradientBackground from './GradientBackground';
const { API_BASE_URL } = network;

/*
const FilmWatcher = () => {
    const {filmId} = useParams();
    const [filmName, setFilmName] = useState('');

    console.log(filmId);
    const filmData = localStorage.getItem('films');
    const films = JSON.parse(filmData || '[]');
    for (let i = 0; i < films.length; i++) {
        console.log(films[i]);
        if (films[i].film_id == filmId) {
            setFilmName(films[i].title);
        }
    }
    console.log('logging film name');
    console.log(filmName);

    const source = `${API_BASE_URL}/films/${filmName}`;
    console.log(source);

    return (
        <div id='filmWatcher'>
            <video width='1200' controls muted='muted'>
                <source src={source} type='video/mp4' />
            </video>
        </div>
    );

};

export default FilmWatcher;
*/

const FilmWatcher = () => {
    const { filmId } = useParams();
    const [filmName, setFilmName] = useState('');
    const [source, setSource] = useState('');

    useEffect(() => {
        // Get film data from localStorage
        const filmData = localStorage.getItem('films');
        const films = JSON.parse(filmData || '[]');
        
        // Find the matching film by ID
        const film = films.find(film => film.id == filmId);
        console.log('the film');

        if (film) {
            setFilmName(film.title);
            setSource(`${API_BASE_URL}/film/${film.file_name}`);
        }
        console.log('the source:');
        console.log(source);
    }, [filmId]); // Only run when filmId changes

    return (
        <GradientBackground>
          <div id='filmWatcher'>
            {filmName ? (
                <>
                    <h2>{filmName}</h2>
                    <video width='1200' controls muted='muted'>
                        <source src={source} type='video/mp4' />
                    </video>
                </>
            ) : (
                <p>Loading film...</p>
            )}
          </div>
        </GradientBackground>
    );
};

export default FilmWatcher;