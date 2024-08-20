// Importing modules
import React from "react";



function LoginFormHeader() {
    return (
        <div>
            <div className="login_mqp_logo">
                <img
                    src="/images/MQV_Logo_Blue.svg"
                    className="mqp_logo_img"
                    alt="MQP logo"
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