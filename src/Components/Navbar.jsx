import React, { useState, useEffect } from 'react';
import { getTokenData, isTokenValid } from '../Network';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import FilmSearchForm from '../Components/FilmSearchForm'; 
import '../Styling/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { filmId } = useParams(); // Only filmId comes from params
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
 
  // Get profileId either from params or from location.state
  const profileId = useParams().profileId || (location.state && location.state.profileId);

  useEffect(() => {
    loadProfileData();

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const loadProfileData = () => {
    try {
      if (!isTokenValid()) {
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      const tokenData = getTokenData();
      const profile = tokenData.profiles.find(p => p.id == profileId);
      if (profile) {
        setDisplayName(profile.displayname);
      }
    } catch (error) {
      console.log(`Error in loadProfiles: ${error.message}`);
    }
  };

  const getLinks = () => {
    if (!profileId) return [];

    if (location.pathname.startsWith('/watch') && filmId) {
      return [
        { path: `/profile/${profileId}`, label: 'Profile' },
        { path: `/favorite/${profileId}`, label: 'Favorites' },
        { path: `/watchlater/${profileId}`, label: 'Watch Later' },
        { path: `/watchhistory/${profileId}`, label: 'Watch History' },
        { path: `/`, label: 'Logout' },


      ];
    }

    if (location.pathname.startsWith('/profile')) {
      return [
        { path: `/profiles`, label: 'Dashboard' },
        { path: `/favorite/${profileId}`, label: 'Favorites' },
        { path: `/watchlater/${profileId}`, label: 'Watch Later' },
        { path: `/watchhistory/${profileId}`, label: 'Watch History' },
        { path: `/`, label: 'Logout' },

      ];
    }

    if (['/browse', '/watchlater', '/watchhistory', '/favorite', '/searchhistory'].some(path => location.pathname.startsWith(path))) {
      return [
        { path: `/profile/${profileId}`, label: 'Profile' },
        { path: `/favorite/${profileId}`, label: 'Favorites' },
        { path: `/watchlater/${profileId}`, label: 'Watch Later' },
        { path: `/watchhistory/${profileId}`, label: 'Watch History' },
        { path: `/`, label: 'Logout' },

      ];
    }
    return [];
  };

  const links = getLinks();

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector('.navbar-profile-container');
      if (dropdown && !dropdown.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);



  return (
    <nav className={`navbar ${showNavbar ? 'active' : 'hidden'}`}>
      <div className="navbar-top">
        <Link to="/" className="navbar-logo">MinFlix</Link>

        {/* Always show Movies link */}
        {profileId && (
          <div className="navbar-center">
            <Link to={`/browse/${profileId}`} className="nav-link">
              Movies
            </Link>

            <FilmSearchForm profileId={profileId} />
          </div>
        )}

        <div className="navbar-right">
          {displayName && (
            <div className="navbar-profile-container">
              <div className="navbar-profile-badge" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {displayName[0]}
              </div>

              {dropdownOpen && (
                <ul className="navbar-dropdown">
                  {links.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        to={link.path}
                        className="dropdown-link"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
