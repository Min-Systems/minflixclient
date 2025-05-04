import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import FilmList from '../Components/FilmList';
import GradientBackground from '../Components/GradientBackground';
import ActionButton from '../Components/ActionButton';
import Navbar from '../Components/Navbar';

/*
    This is the page that allows the user to see the search results
*/
const SearchResultsPage = () => {
    const searchQuery = localStorage.getItem('searchQuery');
    const navigate = useNavigate();
    const { profileId } = useParams();
    const [searchHistory, setSearchHistory] = useState([]);
    
    useEffect(() => {
        loadSearchResults();
    } ,[]);

    const loadSearchResults = () => {
        // if we have navigated to the page, then the search history exists
        const searchHistory = localStorage.getItem('searchResults');
        const searchHistoryIds = searchHistory.split(',').map(id => parseInt(id, 10));
        setSearchHistory(searchHistoryIds);
    };

    return(
        <GradientBackground>
            <Navbar/>
            <FilmList bannerDisplay={'Search Results'} filmIds={searchHistory} isFilmBrowser={false}/>
            <ActionButton label='Return to profile' onClick={() => navigate(`/profile/${profileId}`)}/>
        </GradientBackground>
    );
};

export default SearchResultsPage;