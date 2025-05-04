import { render, screen } from '@testing-library/react';
import LoginPage from './LoginPage';

jest.mock('react-router', () => {
    const actual = jest.requireActual('react-router');
    return {
        ...actual,
        useNavigate: jest.fn(),
    };
});


test('Checks if the navbutton description exists', () => {
    render(<LoginPage />)

    const registerLinkInfo = screen.getByText(/Dont have an account/i)
    expect(registerLinkInfo).toBeInTheDocument();
});