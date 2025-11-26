import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from 'src/store';
import TopBar from 'src/components/Layout/TopBar/TopBar';

jest.mock('src/hooks/use-outside-click', () => ({
  __esModule: true,
  default: jest.fn(() => ({ current: null })),
}));

describe('Accessibilities component', () => {
  let consoleSpy;

  beforeEach(() => {
    // Suppress React act() warning - this is a known issue with useEffect + Redux dispatch
    consoleSpy = jest.spyOn(console, 'error').mockImplementation((msg) => {
      if (!msg.includes('not wrapped in act')) {
        console.warn(msg);
      }
    });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('render Darkmode toggle was clicked', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <TopBar />
      </Provider>,
    );

    const darkmodeBtn = screen.getByTitle('Enable Darkmode');
    await user.click(darkmodeBtn);

    await waitFor(() => {
      expect(screen.getByTitle('Disable Darkmode')).toBeInTheDocument();
    });
  });
});
