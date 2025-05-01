import { jwtDecode } from 'jwt-decode';
// swap base url for production: https://minflixbackend-611864661290.us-west2.run.app
// const API_BASE_URL = 'http://localhost:8000';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log(`api base url ${API_BASE_URL}`)

// Gets authentication token from localStorage
const getAuthToken = () => {
  const rawToken = localStorage.getItem('authToken');
  if (!rawToken) return null;

  // Remove any quotes from the token
  return rawToken.replace(/^["'](.*)["']$/, '$1');
};

// Make an authenticated API request
const apiRequest = async (endpoint, options = {}, requiresAuth = false) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // headers
  const headers = {
    ...options.headers,
  };

  // Add authentication if required
  if (requiresAuth) {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required but no token found');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Merge options
  const requestOptions = {
    ...options,
    headers,
    credentials: 'include'
  };

  // Make the request
  const response = await fetch(url, requestOptions);

  // Handle common errors
  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || `Request failed with status: ${response.status}`;
    } catch (e) {
      errorMessage = `Request failed with status: ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  // Return the response (as text, then caller can parse if needed)
  return await response.text();
};

// Login
export const login = async (username, password) => {
  const bodyFields = new URLSearchParams();
  bodyFields.append('username', username);
  bodyFields.append('password', password);

  return apiRequest('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyFields
  });
};

// Register a new user
export const register = async (username, password) => {
  const bodyFields = new URLSearchParams();
  bodyFields.append('username', username);
  bodyFields.append('password', password);

  return apiRequest('/registration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyFields
  });
};

// Add a profile
export const addProfile = async (displayName) => {
  const bodyFields = new URLSearchParams();
  bodyFields.append('displayname', displayName);

  return apiRequest('/addprofile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyFields
  }, true); // requires authentication
};

// Edit a profile
export const editProfile = async (displayName, newDisplayName) => {
  const bodyFields = new URLSearchParams();
  bodyFields.append('displayname', displayName);
  bodyFields.append('newdisplayname', newDisplayName);

  return apiRequest('/editprofile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyFields
  }, true); // requires authentication
};

// Search for a film
export const search = async (profile_id, query) => {
  const bodyFields = new URLSearchParams();
  bodyFields.append('profile_id', profile_id);
  bodyFields.append('query', query);

  return apiRequest('/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyFields
  }, true); // requires authentication
};

// Get film data
export const getFilmData = async () => {
  return apiRequest('/getfilms', {
    method: 'GET',
  }, false);
};

// Add a watch later
export const addWatchLater = async(profileId, filmId) => {
  return apiRequest(`/watchlater/${profileId}/${filmId}`, {
    method: 'POST'
  }, true); // requires authentication
};

// Add a favorite
export const addFavorite = async(profileId, filmId) => {
  return apiRequest(`/favorite/${profileId}/${filmId}`, {
    method: 'POST'
  }, true); // requires authentication
};

// Add a watch history
export const addWatchHistory = async(profileId, filmId) => {
  return apiRequest(`/add_watchhistory/${profileId}/${filmId}`, {
   method: 'POST' 
  }, true); // requires authentication
}

// Get recommended films
export const getRecommendations = async (profileId) => {
  return apiRequest(`/recommendations/${profileId}`, {
    method: 'GET'
  }, true);
}

// Search for films
export const search = async (profile_id, query) => {
  const bodyFields = new URLSearchParams();
  bodyFields.append('profile_id', profile_id);
  bodyFields.append('query', query);

  return apiRequest('/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyFields
  }, true); // requires authentication
};

// Get JWT token data
export const getTokenData = () => {
  try {
    const token = getAuthToken();
    if (!token) return null;

    // decode the token
    return jwtDecode(token);
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

// Check if the token is valid/not expired
export const isTokenValid = () => {
  try {
    const tokenData = getTokenData();
    if (!tokenData) return false;

    // Check expiration
    const exp = tokenData.exp;
    const now = Math.floor(Date.now() / 1000);

    return exp && exp > now;
  } catch (error) {
    return false;
  }
};

export default {
  getAuthToken,
  login,
  register,
  addProfile,
  getTokenData,
  isTokenValid,
  addWatchLater,
  addFavorite,
  API_BASE_URL
};