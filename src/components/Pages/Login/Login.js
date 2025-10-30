// Importing modules
import React from "react";
import {  Navigate } from "react-router-dom";
import LoginCard from "../../UI/Card/LoginCard";
import LoginForm from "./LoginForm";
import { getAuthToken } from "../../utils/auth";
import LoginFormHeader from "../../Pages/Login/LoginFormHeader";
import Footer from "../../Layout/Footer/Footer";

import "./Login.scss";





function Login() {

    const token = getAuthToken();

    return (
        <LoginCard>
            <div className="col-md-8 col-lg-5 ml-lg-0 LoginForm_wrap">
                <LoginFormHeader />

                <div className="mb-4 login_content">
                    {token && <Navigate to="/status" />}
                    {!token && (
                        <div className="mb-5">
                            <LoginForm />
                            {/* <Contact>Don't have an account?&nbsp;</Contact> */}
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </LoginCard>
    );
}

export default Login;


