import { render, screen } from '@testing-library/react';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    createBrowserRouter: jest.fn(() => 'mock-router'),
    RouterProvider: ({ router }) => <div data-testid="router-provider" data-router={router} />,
  };
});

jest.mock('date-fns/locale/de', () => ({
  __esModule: true,
  default: {},
}));

// eslint-disable-next-line global-require
const App = require('src/App').default;
// eslint-disable-next-line global-require
const { createBrowserRouter } = require('react-router-dom');

test('wires router provider with browser router', () => {
  render(<App />);

  expect(createBrowserRouter).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('router-provider')).toBeInTheDocument();
});
