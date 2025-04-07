import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RegistrationPage from './Pages/RegistrationPage';
import ProfilePickerPage from './Pages/ProfilePickerPage';
import ProfileHomePage from './Pages/ProfileHomePage';
import FilmBrowserPage from './Pages/FilmBrowserPage';
import FilmWatcher from './Components/FilmWatcher';

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
      </Routes>
    </Router>
  );
}

export default App;