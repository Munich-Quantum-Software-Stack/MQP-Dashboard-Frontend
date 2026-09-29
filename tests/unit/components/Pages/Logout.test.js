import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { authActions } from '@store/auth-slice';
import Logout, { action } from '@components/Pages/Logout';
import keycloak from '@utils/keycloak';

const mockDispatch = jest.fn();
const mockSubmit = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => 16,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSubmit: () => mockSubmit,
}));

jest.mock('@utils/keycloak', () => ({
  __esModule: true,
  default: { logout: jest.fn() },
}));

const authStorageKeys = ['isLoggedIn', 'token', 'isReset', 'expiration'];

describe('Logout', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockSubmit.mockClear();
    keycloak.logout.mockClear();
    localStorage.clear();
  });

  it('clears local auth, submits the logout action, then signs out to the portal root', () => {
    authStorageKeys.forEach((key) => localStorage.setItem(key, 'value'));
    keycloak.logout.mockImplementation(() => {
      authStorageKeys.forEach((key) => expect(localStorage.getItem(key)).toBeNull());
    });

    render(<Logout onHidden />);
    fireEvent.click(screen.getByRole('button', { name: 'Log Out' }));

    expect(mockDispatch).toHaveBeenCalledWith(authActions.logout());
    expect(mockSubmit).toHaveBeenCalledWith(null, { method: 'POST', action: '/logout' });
    expect(keycloak.logout).toHaveBeenCalledWith({ redirectUri: window.location.origin });
    expect(mockSubmit.mock.invocationCallOrder[0]).toBeLessThan(
      keycloak.logout.mock.invocationCallOrder[0],
    );
  });

  it('keeps the route action cleanup and login redirect', () => {
    authStorageKeys.forEach((key) => localStorage.setItem(key, 'value'));

    const response = action();

    authStorageKeys.forEach((key) => expect(localStorage.getItem(key)).toBeNull());
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/login');
  });
});
