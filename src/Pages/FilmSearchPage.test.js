import { render, screen, fireEvent } from '@testing-library/react';
import SearchResultsPage from './SearchResultsPage';
import { useNavigate, useParams } from 'react-router';

// 🔧 Mock dependencies
jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../Components/GradientBackground', () => ({ children }) => <div>{children}</div>);
jest.mock('../Components/FilmList', () => ({ bannerDisplay, filmIds }) => (
  <div data-testid="film-list">{bannerDisplay}: [{filmIds.join(', ')}]</div>
));
jest.mock('../Components/ActionButton', () => ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
));

describe('SearchResultsPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ profileId: '321' });

    // Mock localStorage content
    localStorage.setItem('searchResults', '5,10,15');
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders film list from search results in localStorage', () => {
    render(<SearchResultsPage />);
    expect(screen.getByTestId('film-list')).toHaveTextContent('Search Results: [5, 10, 15]');
  });

  test('navigates to profile page on button click', () => {
    render(<SearchResultsPage />);
    fireEvent.click(screen.getByText(/Return to profile/i));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/321');
  });
});
