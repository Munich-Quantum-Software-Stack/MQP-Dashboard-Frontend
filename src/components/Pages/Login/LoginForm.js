// Importing modules
import React from 'react';
import Button from '@components/UI/Button/Button';
import keycloak from '@utils/keycloak';

/** Triggers the Keycloak (SSO) login redirect. Actual authentication happens
 * on Keycloak's hosted login page at REACT_APP_KEYCLOAK_URL - the backend
 * no longer has a password-based /login route. */
function LoginForm() {
  const loginHandler = () => {
    keycloak.login({
      redirectUri: `${window.location.origin}/`,
    });
  };

  return (
    <div className="text-center mt-4">
      <Button type="button" className="login_btn" onClick={loginHandler}>
        Login with SSO
      </Button>
    </div>
  );
}

export default LoginForm;
