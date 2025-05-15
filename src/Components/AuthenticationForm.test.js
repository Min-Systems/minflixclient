import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import AuthenticationForm from './AuthenticationForm';
import { login, register } from '../Network';

// mocking navigate (using react-router now)
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    useNavigate: () => mockNavigate,
}));

// mocking network calls
jest.mock('../Network', () => ({
    login: jest.fn(),
    register: jest.fn(),
}));

describe(AuthenticationForm, () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        global.alert = jest.fn();
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
        console.error.mockRestore();
    });

    // test 1: tests for login rendering email and password fields and Login button
    it("login mode renders email and password fields and Login button", () => {
        render(<AuthenticationForm isLogin={true} />);
        expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Password:/i)).toBeInTheDocument();
        expect(screen.queryByLabelText(/Confirm Password:/i)).toBeNull();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    // test 2: tests for successful login storing token and navigating to profiles
    it("successful login stores token and navigates", async () => {
        login.mockResolvedValueOnce('tok123');
        render(<AuthenticationForm isLogin={true} />);
        fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByLabelText(/^Password:/i), { target: { value: 'passw0rd' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => expect(login).toHaveBeenCalledWith('user@example.com', 'passw0rd'));
        await waitFor(() => {
            expect(localStorage.getItem('authToken')).toBe('tok123');
            expect(mockNavigate).toHaveBeenCalledWith('/profiles');
        });
    });

    // test 3: tests for login error triggering alert and not navigating or storing token
    it("login error triggers alert and does not navigate or store token", async () => {
        login.mockRejectedValueOnce(new Error('bad creds'));
        render(<AuthenticationForm isLogin={true} />);
        fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'u@e.com' } });
        fireEvent.change(screen.getByLabelText(/^Password:/i), { target: { value: 'wrong' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith('Authentication failed: bad creds');
            expect(mockNavigate).not.toHaveBeenCalled();
            expect(localStorage.getItem('authToken')).toBeNull();
        });
    });

    // test 4: tests for registration mode rendering confirm password field and Register button
    it("registration mode renders confirm password field and Register button", () => {
        render(<AuthenticationForm isLogin={false} />);
        expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Password:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm Password:/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    // test 5: tests for password mismatch alerts and not calling register
    it("password mismatch alerts and does not call register", () => {
        render(<AuthenticationForm isLogin={false} />);
        fireEvent.change(screen.getByLabelText(/^Password:/i), { target: { value: 'abc' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password:/i), { target: { value: 'def' } });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        expect(global.alert).toHaveBeenCalledWith('Passwords do not match!');
        expect(register).not.toHaveBeenCalled();
    });

    // test 6: tests for successful registration storing token and navigates
    it("successful registration stores token and navigates", async () => {
        register.mockResolvedValueOnce('newtok');
        render(<AuthenticationForm isLogin={false} />);
        fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'new@user.com' } });
        fireEvent.change(screen.getByLabelText(/^Password:/i), { target: { value: 'secure' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password:/i), { target: { value: 'secure' } });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => expect(register).toHaveBeenCalledWith('new@user.com', 'secure'));
        await waitFor(() => {
            expect(localStorage.getItem('authToken')).toBe('newtok');
            expect(mockNavigate).toHaveBeenCalledWith('/profiles');
        });
    });

    // test 7: tests for registration error triggering alert and not navigating
    it("registration error triggers alert and does not navigate", async () => {
        register.mockRejectedValueOnce(new Error('fail'));  
        render(<AuthenticationForm isLogin={false} />);
        fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'x@x.com' } });
        fireEvent.change(screen.getByLabelText(/^Password:/i), { target: { value: 'p1' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password:/i), { target: { value: 'p1' } });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith('Authentication failed: fail');
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    // test 8: tests for show password toggle switching password fields types
    it("show password toggle switches password fields types", () => {
        render(<AuthenticationForm isLogin={false} />);
        const pwdInput = screen.getByLabelText(/^Password:/i);
        const confirmInput = screen.getByLabelText(/Confirm Password:/i);
        const toggle = screen.getByLabelText(/Show Password/i);

        expect(pwdInput).toHaveAttribute('type', 'password');
        expect(confirmInput).toHaveAttribute('type', 'password');

        fireEvent.click(toggle);
        expect(pwdInput).toHaveAttribute('type', 'text');
        expect(confirmInput).toHaveAttribute('type', 'text');

        fireEvent.click(toggle);
        expect(pwdInput).toHaveAttribute('type', 'password');
        expect(confirmInput).toHaveAttribute('type', 'password');
    });
});
