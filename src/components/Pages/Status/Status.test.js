import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'src/store';
import Status from './Status';

// Test Suit
describe('Status Page', () => {
  test('render Status component', () => {
    // Arrange
    render(
      <Provider store={store}>
        <Status />
      </Provider>,
    );

    // Act
    // ....

    // Assert
    const welcomeText = screen.getByText('Welcome to Munich Quantum Portal', { exact: false });
    expect(welcomeText).toBeInTheDocument();
  });
});
