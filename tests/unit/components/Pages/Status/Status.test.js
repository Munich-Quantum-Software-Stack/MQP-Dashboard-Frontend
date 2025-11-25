import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'src/store';
import Status from 'src/components/Pages/Status/Status';

describe('Status Page', () => {
  test('render Status component', () => {
    render(
      <Provider store={store}>
        <Status />
      </Provider>,
    );

    const welcomeText = screen.getByText('Welcome to the Munich Quantum Portal', { exact: false });
    expect(welcomeText).toBeInTheDocument();
  });
});
