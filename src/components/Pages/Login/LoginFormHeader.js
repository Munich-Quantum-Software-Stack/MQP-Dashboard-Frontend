// Importing modules
import React from "react";
import { getLandingPageLogo } from "@utils/get-user-logos";

function LoginFormHeader() {
  const user_logos_path = process.env.PUBLIC_URL + '/user_logos/';
  const landing_logo = getLandingPageLogo();
  return (
    <div>
      <div className="login_logo">
        <a href={landing_logo.link} target="_blank" rel="noopener noreferrer">
          <img
            src={user_logos_path + landing_logo.file_name + landing_logo.file_ext}
            className="header_logo_img"
            alt={landing_logo.alt}
          />
        </a>
      </div>
      <div className="my-3 form_text ">
        <h3 className="mb-4 text-center page_header">Welcome</h3>
      </div>
    </div>
  );
}

export default LoginFormHeader;
