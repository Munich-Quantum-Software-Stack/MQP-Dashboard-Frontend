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
      <div className="col-md-8 col-lg-5 ml-lg-0 LoginForm_wrap">
        <LoginFormHeader />

        <div className="mb-4 login_content">
          {/* Redirect to status page if already authenticated, otherwise show login form */}
          {token && <Navigate to="/status" />}
          {!token && (
            <div className="mb-5">
              <LoginForm />
            </div>
          )}
        </div>

        <Footer />
      </div>
    </LoginCard>
  );
}

export default Login;
