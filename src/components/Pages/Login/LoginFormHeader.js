// Importing modules
import React from 'react';
import { getLandingPageLogo } from '@utils/get-user-logos';

function LoginFormHeader() {
  const user_logos_path = process.env.PUBLIC_URL + '/user_logos/';
  const landing_logo = getLandingPageLogo();
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
