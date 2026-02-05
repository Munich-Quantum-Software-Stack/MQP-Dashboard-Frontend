import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginCard from '@components/UI/Card/LoginCard';
import LoginForm from '@components/Pages/Login/LoginForm';
import { getAuthToken } from '@utils/auth';
import LoginFormHeader from '@components/Pages/Login/LoginFormHeader';
import Footer from '@components/Layout/Footer/Footer';

import './Login.scss';

/**
 * Login - Login page that redirects authenticated users to /status or shows login form
 */
function Login() {
  const token = getAuthToken();

  return (
    <LoginCard>
      <div className="mx-auto login_form_background">
        <div className="LoginForm_wrap">
          <LoginFormHeader />

          <div className="login_content">
            {/* Redirect to status page if already authenticated, otherwise show login form */}
            {token && <Navigate to="/status" />}
            {!token && (
              <div className="mb-2">
                <LoginForm />
              </div>
            )}
          </div>
        </div>
        <div className="login_footer_container">
          <Footer />
        </div>
      </div>
    </LoginCard>
  );
}

export default Login;
