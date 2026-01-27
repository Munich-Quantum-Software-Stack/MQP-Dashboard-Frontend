// Importing modules
import React from "react";

function LoginFormHeader() {
  return (
    <div>
      <div className="login_logo">
        <a href="https://www.lrz.de/" target="_blank" rel="noopener noreferrer">
          <img
            src="/images/lrz_wortbild_e_rgb.svg"
            className="header_logo_img"
            alt="LRZ logo"
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
