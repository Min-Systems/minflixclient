import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePickerPage from './ProfilePickerPage';
import { useNavigate } from 'react-router';
import { getTokenData, isTokenValid, getFilmData, addProfile, editProfile } from '../Network';

// ✅ Mock dependencies
jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../Network', () => ({
  getTokenData: jest.fn(),
  isTokenValid: jest.fn(),
  getFilmData: jest.fn(),
  addProfile: jest.fn(),
  editProfile: jest.fn(),
}));

jest.mock('../Components/Navbar', () => () => <div data-testid="navbar">MockNavbar</div>);
jest.mock('../Components/GradientBackground', () => ({ children }) => <div>{children}</div>);
jest.mock('../Components/ActionButton', () => ({ label, onClick, ...props }) => (
  <button onClick={onClick} {...props}>{label}</button>
));
jest.mock('../Components/LogoutButton', () => () => <div data-testid="logout-button">MockLogoutButton</div>);

describe('ProfilePickerPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    isTokenValid.mockReturnValue(true);
    getTokenData.mockReturnValue({
      profiles: [
        { id: '1', displayname: 'Alice' },
        { id: '2', displayname: 'Bob' }
      ]
    });
    getFilmData.mockResolvedValue(JSON.stringify([{ id: 1, title: 'Film A' }]));
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders profile buttons from token data', async () => {
    render(<ProfilePickerPage />);
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  test('navigates to profile on profile button click', async () => {
    render(<ProfilePickerPage />);
    const profileBtn = await screen.findByText('Alice');
    fireEvent.click(profileBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/profile/1');
  });

  test('shows Add Profile form when button clicked', () => {
    render(<ProfilePickerPage />);
    fireEvent.click(screen.getByText('Add Profile'));
    expect(screen.getByPlaceholderText('Enter display name')).toBeInTheDocument();
  });

  test('shows Edit Profile form when button clicked', () => {
    render(<ProfilePickerPage />);
    fireEvent.click(screen.getByText('Edit Profile'));
    expect(screen.getByPlaceholderText('Enter new display name')).toBeInTheDocument();
  });
});
