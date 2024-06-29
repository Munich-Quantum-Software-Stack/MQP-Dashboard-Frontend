import React from "react";
import LoginCard from "../../UI/Card/LoginCard";
import RequestAccessForm from "./RequestAccessForm";
import LoginFormHeader from "../../Pages/Login/LoginFormHeader";
import Footer from "../../Layout/Footer/Footer";

import "./RequestAccess.scss";

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
}
export default RequestAccess;