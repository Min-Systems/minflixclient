import React from 'react';
import { Link } from 'react-router-dom';
import FilmSearchForm from './FilmSearchForm';
import '../Styling/Navbar.css';

const Navbar = ({ profileId }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Minflix</h1>
      </div>
      <div className="navbar-search">
        <FilmSearchForm profileId={profileId} />
      </div>
    </nav>
  );
};

export default Navbar;