import { render, screen, fireEvent } from '@testing-library/react';
import FavoritePage from './FavoritePage';
import { useNavigate, useParams } from 'react-router';
import { getTokenData } from '../Network';

// Mock dependencies
jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../Network', () => ({
  getTokenData: jest.fn(),
}));

jest.mock('../Components/GradientBackground', () => ({ children }) => <div>{children}</div>);
jest.mock('../Components/Navbar', () => () => <div data-testid="navbar">MockNavbar</div>);
jest.mock('../Components/FilmList', () => ({ bannerDisplay, filmIds }) => (
  <div data-testid="film-list">{bannerDisplay}: [{filmIds.join(', ')}]</div>
));
jest.mock('../Components/ActionButton', () => ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
));

describe('FavoritePage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useParams.mockReturnValue({ profileId: '999' });
    useNavigate.mockReturnValue(mockNavigate);
    getTokenData.mockReturnValue({
      profiles: [
        {
          id: '999',
          favorites: [
            { film_id: 1 },
            { film_id: 2 },
            { film_id: 3 }
          ]
        }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders film list from favorite films', () => {
    render(<FavoritePage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('film-list')).toHaveTextContent('Favorited Films: [1, 2, 3]');
  });

  test('navigates to profile page on button click', () => {
    render(<FavoritePage />);
    fireEvent.click(screen.getByText('Return to profile'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/999');
  });
});
