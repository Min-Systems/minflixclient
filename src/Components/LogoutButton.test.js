import { fireEvent, render } from '@testing-library/react';
import LogoutButton from './LogoutButton';
import { useNavigate } from 'react-router';

// mocking navigate
jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

describe(LogoutButton, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // test 1: tests for button rendering with correct label "Logout"
  it("Button renders with the correct label", () => {
    useNavigate.mockReturnValue(jest.fn());
    const { getByText } = render(<LogoutButton />);
    const buttonElement = getByText("Logout");
    expect(buttonElement).toBeInTheDocument();
  });

  // test 2: tests for button rendering with correct ID "logoutButton"
  it("Button renders with the correct ID", () => {
    useNavigate.mockReturnValue(jest.fn());
    const { getByText } = render(<LogoutButton />);
    const buttonElement = getByText("Logout");
    expect(buttonElement).toHaveAttribute("id", "logoutButton");
  });

  // test 3: tests for button calling localStorage.clear when clicked
  it("Button calls localStorage.clear when clicked", () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    const clearSpy = jest.spyOn(Storage.prototype, 'clear');
    const { getByText } = render(<LogoutButton />);
    const buttonElement = getByText("Logout");

    fireEvent.click(buttonElement);
    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  // test 4: tests for button navigating to login page when clicked
  it("Button navigates to login page when clicked", () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    const { getByText } = render(<LogoutButton />);
    const buttonElement = getByText("Logout");

    fireEvent.click(buttonElement);
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  // test 5: tests for button rendering with correct default type 'button'
  it("Button renders with the correct default type 'button'", () => {
    useNavigate.mockReturnValue(jest.fn());
    const { getByText } = render(<LogoutButton />);
    const buttonElement = getByText("Logout");
    expect(buttonElement).toHaveAttribute("type", "button");
  });
});
