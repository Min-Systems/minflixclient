import { render, screen, fireEvent } from '@testing-library/react';
import WatchLaterPage from './WatchLaterPage';
import { useNavigate, useParams } from 'react-router';
import { getTokenData } from '../Network';

// Mocks
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
  <div data-testid="film-list">
    {bannerDisplay} — [{filmIds.join(', ')}]
  </div>
));
jest.mock('../Components/ActionButton', () => ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
));

describe('WatchLaterPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useParams.mockReturnValue({ profileId: '123' });
    useNavigate.mockReturnValue(mockNavigate);
    getTokenData.mockReturnValue({
      profiles: [
        {
          id: '123',
          watch_later: [
            { film_id: 10 },
            { film_id: 20 },
            { film_id: 30 }
          ]
        }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders film list from watch later films', () => {
    render(<WatchLaterPage />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('film-list')).toHaveTextContent('Watch Later — [10, 20, 30]');
  });

  test('navigates to profile page on button click', () => {
    render(<WatchLaterPage />);
    fireEvent.click(screen.getByText('Return to profile'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/123');
  });
});
