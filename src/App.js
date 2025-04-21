import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RegistrationPage from './Pages/RegistrationPage';
import ProfilePickerPage from './Pages/ProfilePickerPage';
import ProfileHomePage from './Pages/ProfileHomePage';
import FilmBrowserPage from './Pages/FilmBrowserPage';
import FilmWatcher from './Pages/FilmWatcher';
import FavoritePage from './Pages/FavoritePage';
import WatchLaterPage from './Pages/WatchLaterPage';

/*
  This is the root component
*/
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<RegistrationPage />} />
        <Route path='/profiles' element={<ProfilePickerPage />} />
        <Route path='/profile/:profileId' element={<ProfileHomePage />} />
        <Route path='/browse/:profileId' element={<FilmBrowserPage />} />
        <Route path='/watch/:filmId' element={<FilmWatcher />} />
        <Route path='/favorite/:profileId' element={<FavoritePage />} />
        <Route path='/watchlater/:profileId' element={<WatchLaterPage />} />
      </Routes>
    </Router>
  );
}

export default App;