import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileHomePage from './ProfileHomePage';
import { useNavigate, useParams } from 'react-router';
import { getTokenData, isTokenValid, getRecommendations } from '../Network';

// ✅ Mock dependencies
jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../Network', () => ({
  getTokenData: jest.fn(),
  isTokenValid: jest.fn(),
  getRecommendations: jest.fn(),
}));

jest.mock('../Components/Navbar', () => () => <div data-testid="navbar">MockNavbar</div>);
jest.mock('../Components/EditProfileForm', () => () => <div data-testid="edit-profile-form">MockEditProfileForm</div>);
jest.mock('../Components/FilmList', () => ({ filmIds }) => (
  <div data-testid="film-list">Films: [{filmIds.join(', ')}]</div>
));
jest.mock('../Components/FilmSearchForm', () => () => <div data-testid="film-search-form">MockSearchForm</div>);
jest.mock('../Components/GradientBackground', () => ({ children }) => <div>{children}</div>);
jest.mock('../Components/ActionButton', () => ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
));

describe('ProfileHomePage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ profileId: '123' });

    isTokenValid.mockReturnValue(true);
    getTokenData.mockReturnValue({
      profiles: [{ id: '123', displayname: 'TestUser' }]
    });
    getRecommendations.mockResolvedValue(JSON.stringify([
      { id: 101 },
      { id: 202 }
    ]));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders profile name and recommendations', async () => {
    render(<ProfileHomePage />);

    // Wait for async recommendations to load
    await waitFor(() => {
      expect(screen.getByText(/TestUser's Home Page/i)).toBeInTheDocument();
      expect(screen.getByTestId('film-list')).toHaveTextContent('Films: [101, 202]');
    });
  });

  test('navigates correctly with action buttons', () => {
    render(<ProfileHomePage />);
    
    fireEvent.click(screen.getByText('Back to Profiles'));
    expect(mockNavigate).toHaveBeenCalledWith('/profiles');

    fireEvent.click(screen.getByText('Browse Films'));
    expect(mockNavigate).toHaveBeenCalledWith('/browse/123');

    fireEvent.click(screen.getByText('Browse Favorites'));
    expect(mockNavigate).toHaveBeenCalledWith('/favorite/123');

    fireEvent.click(screen.getByText('Browse Watch Later'));
    expect(mockNavigate).toHaveBeenCalledWith('/watchlater/123');

    fireEvent.click(screen.getByText('Browse Watch History'));
    expect(mockNavigate).toHaveBeenCalledWith('/watchhistory/123');
  });
});
