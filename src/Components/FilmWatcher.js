import network from '../Network';
const { API_BASE_URL } = network;


const FilmWatcher = () => {

    const film = '/film'
    const source = `${API_BASE_URL}${film}`;
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