// Importing modules
import React from 'react';

function LoginFormHeader() {
  return (
    <div>
      <div className="login_logo">
        <img
          src={process.env.PUBLIC_URL + '/user_logos/UserLandingPageLogo.png'}
          className="header_logo_img"
          alt="Logo"
          width="100%"
          height="auto"
        />
      </div>
      <div className="my-3 form_text ">
        <h3 className="mb-4 text-center page_header">Welcome</h3>
      </div>
    </div>
  );
}

export default LoginFormHeader;
