import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation, Routes } from 'react-router-dom';
import '../Styling/Navbar.css';

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { profileId } = useParams();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false); // scrolling down → hide navbar
      } else {
        setShowNavbar(true);  // scrolling up → show navbar
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${showNavbar ? 'active' : 'hidden'}`}>
      <Link to="/" className="navbar-logo"> MinFlix </Link>

      
    

    

        {location.pathname.startsWith('/profile') && profileId && (
          <>
          <ul className='navbar-links'>
          <li className="nav-link"> 
                <a href={`/profiles`} className="nav-link">Dashboard</a>
            </li>
            <li className="nav-link"> 
                <a href={`/watchlater/${profileId}`} className="nav-link">Watch Later</a>
            </li>
           <li className="nav-link"> 
                <a href={`/watchhistory/${profileId}`} className="nav-link">Watch History</a>
            </li>
            <li className="nav-link"> 
                <a href={`/favorite/${profileId}`} className="nav-link">Favorites</a>
            </li>
            <li className="nav-link"> 
                <a href={`/browse/${profileId}`} className="nav-link">Movies</a>
            </li>
          </ul>    
          </>
        )}
       

      
        {location.pathname.startsWith('/browse') && profileId && (
          <>
          <ul className='navbar-links'>
            <li className="nav-link"> 
                <a href={`/profile/${profileId}`} className="nav-link">Profile</a>
            </li>
          <li className="nav-link"> 
                <a href={`/watchlater/${profileId}`} className="nav-link">Watch Later</a>
            </li>
           <li className="nav-link"> 
                <a href={`/watchhistory/${profileId}`} className="nav-link">Watch History</a>
            </li>
            <li className="nav-link"> 
                <a href={`/favorite/${profileId}`} className="nav-link">Favorites</a>
            </li>
            
            </ul>
          </>
        )}

      

        {location.pathname.startsWith('/watchlater') && profileId && (
          <>
          <ul className='navbar-links'>
           <li className="nav-link"> 
                <a href={`/profile/${profileId}`} className="nav-link">Profile</a>
            </li>
           <li className="nav-link"> 
                <a href={`/watchhistory/${profileId}`} className="nav-link">Watch History</a>
            </li>
            <li className="nav-link"> 
                <a href={`/favorite/${profileId}`} className="nav-link">Favorites</a>
            </li>
            <li className="nav-link"> 
                <a href={`/browse/${profileId}`} className="nav-link">Movies</a>
            </li>
           
          </ul>
          </>
        )}

        {location.pathname.startsWith('/watchhistory') && profileId && (
          <>
          <ul className='navbar-links'>
           <li className="nav-link"> 
                <a href={`/profile/${profileId}`} className="nav-link">Profile</a>
            </li>
           <li className="nav-link"> 
                <a href={`/watchlater/${profileId}`} className="nav-link">Watch Later</a>
            </li>
            <li className="nav-link"> 
                <a href={`/favorite/${profileId}`} className="nav-link">Favorites</a>
            </li>
            <li className="nav-link"> 
                <a href={`/browse/${profileId}`} className="nav-link">Movies</a>
            </li>
            
          </ul>
          </>
        )}

        {location.pathname.startsWith('/favorite') && profileId && (
          <>
          <ul className='navbar-links'>
           <li className="nav-link"> 
                <a href={`/profile/${profileId}`} className="nav-link">Profile</a>
            </li>
           <li className="nav-link"> 
                <a href={`/watchlater/${profileId}`} className="nav-link">Watch Later</a>
            </li>
           <li className="nav-link"> 
                <a href={`/watchhistory/${profileId}`} className="nav-link">Watch History</a>
            </li>
            <li className="nav-link"> 
                <a href={`/browse/${profileId}`} className="nav-link">Movies</a>
            </li>
            
          </ul>
          </>
        )}
      
   
    </nav>
  );
};

export default Navbar;
