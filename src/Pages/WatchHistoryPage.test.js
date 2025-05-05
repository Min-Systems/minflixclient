import { render, screen, fireEvent } from '@testing-library/react';
import WatchHistoryPage from './WatchHistoryPage';
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
  <div data-testid="film-list">{bannerDisplay}: [{filmIds.join(', ')}]</div>
));
jest.mock('../Components/ActionButton', () => ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
));

describe('WatchHistoryPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ profileId: '123' });

    getTokenData.mockReturnValue({
      profiles: [
        {
          id: '123',
          watch_history: [
            { film_id: 101 },
            { film_id: 202 },
            { film_id: 303 },
          ],
        },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders film list from watch history data', () => {
    render(<WatchHistoryPage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('film-list')).toHaveTextContent('Watch History: [101, 202, 303]');
  });

  test('navigates to profile page on button click', () => {
    render(<WatchHistoryPage />);
    fireEvent.click(screen.getByText('Return to profile'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/123');
  });
});
