import { render } from '@testing-library/react';
import Navbar from './Navbar';

// mocking film search form
jest.mock('./FilmSearchForm', () => (props) => (
  <div
    data-testid="film-search-form"
    data-profile-id={props.profileId}
  />
));

describe(Navbar, () => {
  // test 1: tests for rendering "Minflix"
  it('renders the brand name "Minflix"', () => {
    const { getByText } = render(<Navbar profileId="1" hasSearch={false} />);
    const brandElement = getByText('Minflix');
    expect(brandElement).toBeInTheDocument();
  });

  // test 2: tests for nav element having the correct CSS class
  it('renders a <nav> with class "navbar"', () => {
    const { container } = render(<Navbar profileId="1" hasSearch={false} />);
    const navElement = container.querySelector('nav');
    expect(navElement).toHaveClass('navbar');
  });

  // test 3: tests for FilmSearchForm rendering when hasSearch is true
  it('renders FilmSearchForm when hasSearch is true', () => {
    const { getByTestId } = render(<Navbar profileId="1" hasSearch={true} />);
    const searchForm = getByTestId('film-search-form');
    expect(searchForm).toBeInTheDocument();
  });

  // test 4: tests for FilmSearchForm not rendering when hasSearch is false
  it('does not render FilmSearchForm when hasSearch is false', () => {
    const { queryByTestId } = render(<Navbar profileId="1" hasSearch={false} />);
    const searchForm = queryByTestId('film-search-form');
    expect(searchForm).toBeNull();
  });

  // test 5: tests for passing the correct profileId prop to FilmSearchForm
  it('passes the correct profileId to FilmSearchForm', () => {
    const { getByTestId } = render(<Navbar profileId="42" hasSearch={true} />);
    const searchForm = getByTestId('film-search-form');
    expect(searchForm).toHaveAttribute('data-profile-id', '42');
  });
});
