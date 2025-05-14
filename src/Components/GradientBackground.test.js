import { fireEvent, render } from '@testing-library/react';
import GradientBackground from './GradientBackground';

describe(GradientBackground, () => {
  // test 1: tests for rendering child text correctly
  it("renders children correctly", () => {
    const { getByText } = render(<GradientBackground>Test Content</GradientBackground>);
    const contentElement = getByText("Test Content");
    expect(contentElement).toBeInTheDocument();
  });

  // test 2: tests for rendering multiple children correctly
  it("renders multiple children correctly", () => {
    const { getByText } = render(
      <GradientBackground>
        <span>Child 1</span>
        <span>Child 2</span>
      </GradientBackground>
    );
    expect(getByText("Child 1")).toBeInTheDocument();
    expect(getByText("Child 2")).toBeInTheDocument();
  });

  // test 3: tests for rendering with the correct className 'gradient-background'
  it("renders with the correct className 'gradient-background'", () => {
    const { container } = render(<GradientBackground>Content</GradientBackground>);
    expect(container.firstChild).toHaveClass("gradient-background");
  });

  // test 4: tests for using a div as the wrapper element
  it("uses a div as the wrapper element", () => {
    const { container } = render(<GradientBackground>Content</GradientBackground>);
    expect(container.firstChild.tagName.toLowerCase()).toBe("div");
  });

  // test 5: tests for rendering nothing when no children are provided
  it("renders nothing when no children are provided", () => {
    const { container } = render(<GradientBackground />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
