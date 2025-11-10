import React from "react";
import {  Navigate } from "react-router-dom";
import LoginCard from "src/components/UI/Card/LoginCard";
import LoginForm from "src/components/Pages/Login/LoginForm";
import { getAuthToken } from "src/components/utils/auth";
import LoginFormHeader from "src/components/Pages/Login/LoginFormHeader";
import Footer from "src/components/Layout/Footer/Footer";

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

                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </LoginCard>
    );
}

export default Login;


