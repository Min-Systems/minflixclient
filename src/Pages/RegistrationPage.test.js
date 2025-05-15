import { render, screen, fireEvent } from '@testing-library/react';
import RegistrationPage from './RegistrationPage';
import { useNavigate } from 'react-router';

// Mocks
jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../Components/AuthenticationForm', () => () => (
  <div data-testid="auth-form">MockAuthForm</div>
));

jest.mock('../Components/GradientBackground', () => ({ children }) => <div>{children}</div>);

jest.mock('../Components/ActionButton', () => ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
));

describe('RegistrationPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders headings and authentication form', () => {
    render(<RegistrationPage />);
    
    expect(screen.getByText(/MinFlix/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('navigates to login page on Login button click', () => {
    render(<RegistrationPage />);
    
    fireEvent.click(screen.getByText(/Login/i));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
