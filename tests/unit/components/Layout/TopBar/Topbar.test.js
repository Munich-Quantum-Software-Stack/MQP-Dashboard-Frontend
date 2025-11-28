/**
 * Topbar.test.js - Unit tests for TopBar component accessibility features (darkmode toggle)
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from '@store/index';
import TopBar from '@components/Layout/TopBar/TopBar';

// Mock the outside click hook to prevent side effects during testing
jest.mock('@hooks/use-outside-click', () => ({
  __esModule: true,
  default: jest.fn(() => ({ current: null })),
}));

describe('Accessibilities component', () => {
  let consoleSpy;

  // Suppress React act() warnings that occur during async state updates
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation((msg) => {
      if (!msg.includes('not wrapped in act')) {
        console.warn(msg);
      }
    });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // Test that clicking darkmode button toggles between enable/disable states
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
