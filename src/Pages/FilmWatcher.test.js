import { render, screen, fireEvent } from '@testing-library/react';
import FilmWatcher from './FilmWatcher'; 
import { useParams, useLocation, useNavigate } from 'react-router';
import React from 'react';

// Mocks
jest.mock('react-router', () => ({
  useParams: jest.fn(),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../Components/GradientBackground', () => ({ children }) => <div>{children}</div>);

jest.mock('../Components/ActionButton', () => ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
));

// Test setup
describe('FilmWatcher', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Set up route params and navigation
    useParams.mockReturnValue({ filmId: '123' });
    useLocation.mockReturnValue({ state: { profileId: '456' } });
    useNavigate.mockReturnValue(mockNavigate);

    // Mock localStorage with test film
    const testFilm = [
      { id: '123', title: 'Test Film', file_name: 'test.mp4' }
    ];
    localStorage.setItem('films', JSON.stringify(testFilm));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders film title and video', () => {
    render(<FilmWatcher />);

    // Check film title renders
    expect(screen.getByText(/Test Film/i)).toBeInTheDocument();

    // Check video source renders
    const video = screen.getByRole('video');
    expect(video).toBeInTheDocument(); // or use other queries
  });

  test('navigates to browse on button click', () => {
    render(<FilmWatcher />);
    fireEvent.click(screen.getByText(/Return to films/i));
    expect(mockNavigate).toHaveBeenCalledWith('/browse/456');
  });
});
