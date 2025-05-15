import { render, screen, fireEvent } from '@testing-library/react';
import SearchResultsPage from './SearchResultsPage';
import { useNavigate, useParams } from 'react-router';

// Mocks
jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../Components/GradientBackground', () => ({ children }) => <div>{children}</div>);
jest.mock('../Components/Navbar', () => () => <div data-testid="navbar">MockNavbar</div>);
jest.mock('../Components/FilmList', () => ({ bannerDisplay, filmIds }) => (
  <div data-testid="film-list">
    {bannerDisplay} — [{filmIds.join(', ')}]
  </div>
));
jest.mock('../Components/ActionButton', () => ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
));

describe('SearchResultsPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ profileId: '456' });

    // Mock localStorage for search results and query
    localStorage.setItem('searchQuery', 'action');
    localStorage.setItem('searchResults', '10,20,30');
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders search results from localStorage', () => {
    render(<SearchResultsPage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('film-list')).toHaveTextContent('Search Results — [10, 20, 30]');
  });

  test('navigates to profile page when button is clicked', () => {
    render(<SearchResultsPage />);
    fireEvent.click(screen.getByText(/Return to profile/i));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/456');
  });
});
