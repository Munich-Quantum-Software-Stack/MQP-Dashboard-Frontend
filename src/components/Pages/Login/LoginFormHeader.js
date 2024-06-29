// Importing modules
import React from "react";



function LoginFormHeader() {
    return (
      <div>
        <div className="mb-3 lrz_logo">
          <img
            src="/images/lrz_wortbild_square.png"
            className="lrz_cube"
            alt="LRZ logo"
          />
        </div>
        <div className="my-3 form_text ">
          <h3 className="mb-4 text-center page_header">
            Welcome to <br />
            Munich Quantum Portal
          </h3>
        </div>
      </div>
    );
}

export default LoginFormHeader;