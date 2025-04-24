import { fireEvent, render } from '@testing-library/react';
import ActionButton from './ActionButton';

describe(ActionButton, () => {
    // test 1: tests for button rendering with correct label "Click Me"
    it("Button renders with the correct label", () => {
        const {getByText} = render(<ActionButton label="Click Me" onClick={() => {}} />);
        const buttonElement = getByText("Click Me");
        expect(buttonElement).toBeInTheDocument();
    });
    // test 2: tests for button calling click handler when clicked
    it("Button calls on click handler when clicked", () => {
        const onClickMock = jest.fn()
        const {getByText} = render(<ActionButton label="Click Me" onClick={onClickMock} />);
        const buttonElement = getByText("Click Me");

        fireEvent.click(buttonElement);
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });
    // test 3: tests for button rendering with correct default type 'button'
    it("Button renders with the correct default type 'button'", () => {
        const {getByText} = render(<ActionButton label="Default Type" onClick={() => {}} />);
        const buttonElement = getByText("Default Type");
        expect(buttonElement).toHaveAttribute("type", "button");
    });
    // test 4: tests for button rendering with correct specified type 'login' (a login button for example)
    it("Button renders with the correct non-default specified type", () => {
        const {getByText}= render(<ActionButton label="Login" onClick={() => {}} type="login"/>);
        const buttonElement = getByText("Login");
        expect(buttonElement).toHaveAttribute("type", "login");
    });
    // test 5: tests for button rendering with correct ID
    it("Button renders with the correct ID", () => {
        const {getByText} = render(<ActionButton label="ID" onClick={() => {}} id="unique button"/>);
        const buttonElement = getByText("ID");
        expect(buttonElement).toHaveAttribute("id", "unique button");
    });
})