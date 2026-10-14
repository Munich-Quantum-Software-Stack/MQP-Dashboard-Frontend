import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '@store/index';
import Status from '@components/Pages/Status/Status';

describe('Status Page', () => {
  test('render Status component', () => {
    render(
      <Provider store={store}>
        <Status />
      </Provider>,
    );

    const welcomeText = screen.getByText('Welcome to Quantum Pathway Program', { exact: false });
    expect(welcomeText).toBeInTheDocument();
  });
});
