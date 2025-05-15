import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EditProfileForm from './EditProfileForm';
import { editProfile, isTokenValid } from '../Network';

// mocking network calls
jest.mock('../Network');
const mockEditProfile = editProfile;
const mockIsTokenValid = isTokenValid;

// mocking navigate
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

describe(EditProfileForm, () => {
  let loadProfileMock;
  let onCloseMock;

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    loadProfileMock = jest.fn();
    onCloseMock = jest.fn();
  });

  // test 1: tests for rendering only edit profile button
  it("renders only the 'Edit Profile' button initially", () => {
    render(<EditProfileForm loadProfile={loadProfileMock} onClose={onCloseMock} />);
    expect(screen.queryByRole('form')).toBeNull();
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  // test 2: tests for clicking edit profile and close showing and hiding the form
  it("shows and hides the form when clicking 'Edit Profile' and 'Close'", () => {
    render(<EditProfileForm loadProfile={loadProfileMock} onClose={onCloseMock} />);
    fireEvent.click(screen.getByText('Edit Profile'));
    expect(screen.getByPlaceholderText('Enter display name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter new display name')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByPlaceholderText('Enter display name')).toBeNull();
  });

  // test 3: tests for redirects to '/' if token is invalid
  it("redirects to '/' if token is invalid", async () => {
    mockIsTokenValid.mockReturnValue(false);
    jest.useFakeTimers();

    render(<EditProfileForm loadProfile={loadProfileMock} onClose={onCloseMock} />);
    fireEvent.click(screen.getByText('Edit Profile'));
    fireEvent.change(screen.getByPlaceholderText('Enter display name'), { target: { value: 'OldName' } });
    fireEvent.change(screen.getByPlaceholderText('Enter new display name'), { target: { value: 'NewName' } });
    fireEvent.click(screen.getByText('Submit'));

    jest.advanceTimersByTime(3000);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    jest.useRealTimers();
  });

  // test 4: tests for submitting successfully when token is valid
  it("submits successfully when token is valid", async () => {
    mockIsTokenValid.mockReturnValue(true);
    mockEditProfile.mockResolvedValue('fake-jwt-token');

    render(<EditProfileForm loadProfile={loadProfileMock} onClose={onCloseMock} />);
    fireEvent.click(screen.getByText('Edit Profile'));

    fireEvent.change(screen.getByPlaceholderText('Enter display name'), { target: { value: 'CurrentName' } });
    fireEvent.change(screen.getByPlaceholderText('Enter new display name'), { target: { value: 'UpdatedName' } });
    const setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockEditProfile).toHaveBeenCalledWith('CurrentName', 'UpdatedName');
      expect(setItemSpy).toHaveBeenCalledWith('authToken', 'fake-jwt-token');
      expect(loadProfileMock).toHaveBeenCalled();
      expect(screen.queryByPlaceholderText('Enter display name')).toBeNull();
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
