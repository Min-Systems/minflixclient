import { render, fireEvent, waitFor, cleanup, screen } from '@testing-library/react';
import FilmList from './FilmList';
import { addWatchHistory, addWatchLater, addFavorite } from '../Network';

// mocking navigate
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// mocking network
jest.mock('../Network', () => ({
  __esModule: true,
  default: { API_BASE_URL: 'http://testapi' },
  addWatchHistory: jest.fn(),
  addWatchLater: jest.fn(),
  addFavorite: jest.fn(),
}));

describe(FilmList, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
    localStorage.clear();
    // stub network calls to return distinct tokens
    addWatchHistory.mockResolvedValue('token-history');
    addWatchLater.mockResolvedValue('token-later');
    addFavorite.mockResolvedValue('token-fav');
    // sample films in localStorage
    const sampleFilms = [
      { id: 1, title: 'Film One', image_name: 'img1.jpg' },
      { id: 2, title: 'Film Two', image_name: 'img2.jpg' },
    ];
    localStorage.setItem('films', JSON.stringify(sampleFilms));
  });

  // test 1: tests for rendering banner and "No films to display" when there's no matching ID's
  it("renders banner and no films message when no matching IDs", () => {
    render(
      <FilmList
        bannerDisplay="My Banner"
        filmIds={[999]}
        isFilmBrowser={false}
        profileId="123"
      />
    );
    expect(screen.getByText('My Banner')).toBeInTheDocument();
    expect(screen.getByText('No films to display')).toBeInTheDocument();
  });

  // test 2: tests for filtering and displaying films from localStorage
  it("filters and displays films from localStorage", () => {
    render(
      <FilmList
        bannerDisplay="Available Films"
        filmIds={[1, 2]}
        isFilmBrowser={false}
        profileId="123"
      />
    );
    expect(screen.getByText('Film One')).toBeInTheDocument();
    expect(screen.getByText('Film Two')).toBeInTheDocument();
    const img1 = screen.getByAltText('Film One');
    expect(img1).toHaveAttribute('src', 'http://testapi/images/img1.jpg');
  });

  // test 3: tests for action buttons not rendering when isFilmBrowser is false
  it("does not render action buttons when isFilmBrowser is false", () => {
    render(
      <FilmList
        bannerDisplay="Browse"
        filmIds={[1]}
        isFilmBrowser={false}
        profileId="123"
      />
    );
    expect(screen.queryByRole('button', { name: /Watch Film/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Add to Watch Later/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Add to Favorites/i })).not.toBeInTheDocument();
  });

  // test 4: tests for rendering all action buttons when isFilmBrowser is true
  it("renders all action buttons when isFilmBrowser is true", () => {
    render(
      <FilmList
        bannerDisplay="Browse"
        filmIds={[1]}
        isFilmBrowser={true}
        profileId="123"
      />
    );
    expect(screen.getByRole('button', { name: /Watch Film/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add to Watch Later/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add to Favorites/i })).toBeInTheDocument();
  });

  // test 5: tests for "Watch Film" calling addWatchHistory, updates localStorage, and navigates when clicked on
  it("clicking \"Watch Film\" calls addWatchHistory, updates localStorage, and navigates", async () => {
    render(
      <FilmList
        bannerDisplay="Browse"
        filmIds={[1]}
        isFilmBrowser={true}
        profileId="123"
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Watch Film/i }));
    await waitFor(() => {
      expect(addWatchHistory).toHaveBeenCalledWith('123', 1);
    });
    expect(localStorage.getItem('authToken')).toBe('token-history');
    expect(mockNavigate).toHaveBeenCalledWith('/watch/1', { state: { profileId: '123' } });
  });

  // test 6: tests for "Add to Watch Later" calling addWatchLater and updates localStorage when clicking on it
  it("clicking \"Add to Watch Later\" calls addWatchLater and updates localStorage", async () => {
    render(
      <FilmList
        bannerDisplay="Browse"
        filmIds={[1]}
        isFilmBrowser={true}
        profileId="123"
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Add to Watch Later/i }));
    await waitFor(() => {
      expect(addWatchLater).toHaveBeenCalledWith('123', 1);
    });
    expect(localStorage.getItem('authToken')).toBe('token-later');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // test 7: tests for "Add to Favorites" calling addFavorite and updates localStorage when clicking on it
  it("clicking \"Add to Favorites\" calls addFavorite and updates localStorage", async () => {
    render(
      <FilmList
        bannerDisplay="Browse"
        filmIds={[1]}
        isFilmBrowser={true}
        profileId="123"
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Add to Favorites/i }));
    await waitFor(() => {
      expect(addFavorite).toHaveBeenCalledWith('123', 1);
    });
    expect(localStorage.getItem('authToken')).toBe('token-fav');
  });
});
