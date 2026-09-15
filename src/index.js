import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from '@store/index';
import keycloak from '@utils/keycloak';
import { syncKeycloakToken, refreshKeycloakToken } from '@utils/keycloak-sync';

const root = ReactDOM.createRoot(document.getElementById('root'));

function renderApp() {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  );
}

// Silently check for an existing Keycloak session (via an invisible iframe)
// before rendering the router - route loaders read localStorage synchronously,
// so the token must already be populated by the time they run.
keycloak
  .init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  })
  .then((authenticated) => {
    if (authenticated) {
      syncKeycloakToken(store.dispatch, keycloak);
      // Refresh the token periodically so long-lived sessions don't expire
      // mid-use; refreshKeycloakToken() is a no-op unless the token is
      // within 30s of expiring.
      setInterval(() => {
        refreshKeycloakToken(store.dispatch, keycloak).catch(() => {
          // Refresh failed (e.g. session revoked at Keycloak) - let the
          // existing expiration/loader logic redirect to /login.
        });
      }, 20000);
    }
    renderApp();
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Keycloak initialization failed:', error);
    renderApp();
  });

reportWebVitals();
