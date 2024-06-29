import React from "react";
//import ForgotPasswordForm from "./ForgotPasswordForm";
import { Link } from "react-router-dom";
import LoginCard from "../../UI/Card/LoginCard";
import LoginFormHeader from "../../Pages/Login/LoginFormHeader";
import Footer from "../../Layout/Footer/Footer";

function ForgotPassword() {
    
    return (
        <LoginCard>
            <div className="col-md-8 col-lg-5 ml-lg-0 LoginForm_wrap">
                <LoginFormHeader />
                <div className="mb-4 login_content">
                    <div className=" mb-5">
                        {/*<ForgotPasswordForm />*/}
                        <p>If your account is:</p>
                        <ul>
                            <li>
                                LRZ-ID: please use&nbsp;
                                <a
                                    href="https://idmportal2.lrz.de/jidmp/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    IDM-Portal
                                </a>
                                &nbsp;to reset your password.
                            </li>
                            <li>
                                Quantum account: please contact the{" "}
                                <a href="mailto:mqp-admin@lrz.de">admin</a> of
                                the portal.
                            </li>
                        </ul>
                        <div className="text-center mt-5">
                            <Link
                                to="/login"
                                className="dashboard_link py-2 px-4 text_color_grey fs-7 dashboard_btn gray_btn"
                                title="Cancel"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </LoginCard>
    );
}

export default ForgotPassword;