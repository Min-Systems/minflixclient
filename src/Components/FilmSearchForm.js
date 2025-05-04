import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getTokenData, search } from '../Network';
import ActionButton from './ActionButton';
import '../Styling/FilmSearchForm.css'

/*
  This is the component which allows a user to search for a film by name
*/
const FilmSearchForm = ({ profileId }) => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        loadSearchHistory();
    }, []);

    const loadSearchHistory = () => {
        const tokenData = getTokenData();
        const profile = tokenData.profiles.find(profile => profile.id == profileId);
        const tokenSearchHistory = profile.search_history.map(item => item.search_query);
        setSearchHistory(tokenSearchHistory);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // get searchtoken from api
            const searchResponse = await search(profileId, searchText);
            // get the result from the searchResponse
            localStorage.setItem('searchtoken', searchResponse);
            // get token from memory to make sure proper data is used
            let searchToken = JSON.parse(localStorage.getItem('searchtoken'));

            // set the memory with proper values
            localStorage.setItem('authToken', '"' + searchToken.token + '"');
            localStorage.setItem('searchResults', searchToken.results);

            // update the actual component
            loadSearchHistory();

            // remove the text from the search
            setSearchText('');

            // if there are results navigate to the page and show the results
            if (localStorage.getItem('searchResults') != '') {
                navigate(`/searchresults/${profileId}`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-container">
                    <input
                        type='search'
                        value={searchText}
                        placeholder='Search for a film...'
                        onChange={(e) => setSearchText(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        required
                        className="search-input"
                    />
                    <ActionButton label='Search' type='submit' className="search-button" />
                </div>
                {showDropdown && searchHistory.length > 0 && (
                    <div className="dropdown-container">
                        <ul className='history-list'>
                            {searchHistory.map((query, index) => (
                                <li
                                    key={index}
                                    className="history-item"
                                    onClick={() => {
                                        setSearchText(query);
                                        setShowDropdown(false);
                                    }}
                                >
                                    {query}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </form>
        </div>
    );
};

export default FilmSearchForm;