import { render, screen, fireEvent } from '@testing-library/react';
import FilmBrowserPage from './FilmBrowserPage';
import { useNavigate, useParams } from 'react-router';

// 🔧 Mocks
jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../Components/GradientBackground', () => ({ children }) => <div>{children}</div>);
jest.mock('../Components/Navbar', () => () => <div data-testid="navbar">MockNavbar</div>);
jest.mock('../Components/FilmList', () => ({ bannerDisplay, filmIds }) => (
  <div data-testid="film-list">{bannerDisplay}: [{filmIds.join(', ')}]</div>
));
jest.mock('../Components/ActionButton', () => ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
));

describe('FilmBrowserPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useParams.mockReturnValue({ profileId: 'abc123' });
    useNavigate.mockReturnValue(mockNavigate);

    // Mock localStorage
    const mockFilms = [
      { id: 1, title: 'Film One' },
      { id: 2, title: 'Film Two' },
      { id: 3, title: 'Film Three' },
    ];
    localStorage.setItem('films', JSON.stringify(mockFilms));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('loads and displays film IDs from localStorage', () => {
    render(<FilmBrowserPage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('film-list')).toHaveTextContent('All Films: [1, 2, 3]');
  });

  test('navigates to profile page on button click', () => {
    render(<FilmBrowserPage />);
    fireEvent.click(screen.getByText(/Return to profile/i));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/abc123');
  });
});
