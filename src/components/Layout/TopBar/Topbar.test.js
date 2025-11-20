import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from 'src/store';
import TopBar from './TopBar';

jest.mock('src/hooks/use-outside-click', () => ({
  __esModule: true,
  default: jest.fn(() => ({ current: null })),
}));

describe('Accessibilities component', () => {
  test('render Darkmode toggle was clicked', async () => {
    render(
      <Provider store={store}>
        <TopBar />
      </Provider>,
    );
    const darkmodeBtn = screen.getByTitle('Enable Darkmode');
    await act(async () => {
      await userEvent.click(darkmodeBtn);
    });

    const updatedBtn = await screen.findByTitle('Disable Darkmode');
    expect(updatedBtn).toBeInTheDocument();
  });
});
