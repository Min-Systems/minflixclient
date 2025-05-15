import { render, fireEvent, waitFor } from '@testing-library/react';
import FilmSearchForm from './FilmSearchForm';
import { getTokenData, search } from '../Network';

const mockNavigate = jest.fn();

// mock navigate
jest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// mocking netwrok
jest.mock('../Network', () => ({
  getTokenData: jest.fn(),
  search: jest.fn(),
}));

describe(FilmSearchForm, () => {
  // test 1: tests for input rendering with correct placeholder "Search for a film..." and empty initial value
  it("Input renders with the correct placeholder and empty initial value", () => {
    getTokenData.mockReturnValue({
      profiles: [{ id: 1, search_history: [] }]
    });
    const { getByPlaceholderText } = render(<FilmSearchForm profileId={1} />);
    const inputElement = getByPlaceholderText('Search for a film...');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.value).toBe('');
  });

  // test 2: tests for input updating value on change
  it("Input updates value on change", () => {
    getTokenData.mockReturnValue({
      profiles: [{ id: 1, search_history: [] }]
    });
    const { getByPlaceholderText } = render(<FilmSearchForm profileId={1} />);
    const inputElement = getByPlaceholderText('Search for a film...');
    fireEvent.change(inputElement, { target: { value: 'Inception' } });
    expect(inputElement.value).toBe('Inception');
  });

  // test 3: tests for dropdown rendering with correct history items on focus
  it("Dropdown displays history items on input focus", () => {
    getTokenData.mockReturnValue({
      profiles: [{
        id: 1,
        search_history: [
          { search_query: 'Movie1' },
          { search_query: 'Movie2' }
        ]
      }]
    });
    const { getByPlaceholderText, getByText } = render(<FilmSearchForm profileId={1} />);
    const inputElement = getByPlaceholderText('Search for a film...');
    fireEvent.focus(inputElement);
    expect(getByText('Movie1')).toBeInTheDocument();
    expect(getByText('Movie2')).toBeInTheDocument();
  });

  // test 4: tests for clicking history item sets input value and hides dropdown
  it("Clicking history item sets input value and hides dropdown", () => {
    getTokenData.mockReturnValue({
      profiles: [{
        id: 1,
        search_history: [{ search_query: 'Movie1' }]
      }]
    });
    const { getByPlaceholderText, getByText, queryByText } = render(<FilmSearchForm profileId={1} />);
    const inputElement = getByPlaceholderText('Search for a film...');
    fireEvent.focus(inputElement);
    const item = getByText('Movie1');
    fireEvent.click(item);
    expect(inputElement.value).toBe('Movie1');
    expect(queryByText('Movie1')).toBeNull();
  });

  // test 5: tests for form submission calling search, storing tokens, and navigating on results
  it("Form submission calls search, stores tokens, and navigates on results", async () => {
    getTokenData.mockReturnValue({
      profiles: [{ id: 1, search_history: [] }]
    });
    search.mockResolvedValue(JSON.stringify({ token: 'abc', results: 'resData' }));

    const { getByPlaceholderText, getByText } = render(<FilmSearchForm profileId={1} />);
    const inputElement = getByPlaceholderText('Search for a film...');
    fireEvent.change(inputElement, { target: { value: 'Matrix' } });
    fireEvent.click(getByText('Search'));

    await waitFor(() => {
      expect(search).toHaveBeenCalledWith(1, 'Matrix');
      expect(localStorage.getItem('searchtoken'))
        .toBe(JSON.stringify({ token: 'abc', results: 'resData' }));
      expect(localStorage.getItem('authToken')).toBe('"abc"');
      expect(localStorage.getItem('searchResults')).toBe('resData');
      expect(mockNavigate).toHaveBeenCalledWith('/searchresults/1');
    });
  });
});
