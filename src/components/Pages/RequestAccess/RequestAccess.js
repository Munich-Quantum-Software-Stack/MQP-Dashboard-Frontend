import React from 'react';
import LoginCard from '@components/UI/Card/LoginCard';
import RequestAccessForm from '@components/Pages/RequestAccess/RequestAccessForm';
import LoginFormHeader from '@components/Pages/Login/LoginFormHeader';
import Footer from '@components/Layout/Footer/Footer';

import './RequestAccess.scss';

/**
 * RequestAccess - Page for new users to request access to the quantum computing platform
 */
const RequestAccess = () => {
  return (
    <LoginCard>
      <div className="mb-4 col-12 col-xl-8 col-xxl-6 RequestForm_wrap">
        <LoginFormHeader />
        <RequestAccessForm />
        <Footer />
      </div>
    </LoginCard>
  );
};
export default RequestAccess;
