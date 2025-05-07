<<<<<<< HEAD
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import FAQList from "./FAQList";
import LoadingIndicator from "../../UI/LoadingIndicator";
import ContentCard from "../../UI/Card/ContentCard";
import { queryFetchFAQs } from "../../utils/faq-http";
import ErrorBlock from "../../UI/MessageBox/ErrorBlock";
import { getAuthToken } from "../../utils/auth";

import "./FAQ.scss";

function FAQ() {
    const access_token = getAuthToken();
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const page_header_fs = +fs * 1.5;

    const { data, isPending, isError, error } = useQuery({
        queryKey: ["faqs"],
        queryFn: ({ signal }) => queryFetchFAQs({ signal, access_token }),
    });

    if (isError) {
        return <ErrorBlock title={error.message} message={error.code} />;
    }

    let content;
    if (isPending) {
        content = (
            <ContentCard className={`${darkmode ? "dark_bg" : "white_bg"} `}>
                <LoadingIndicator />
                <p>Loading data...</p>
            </ContentCard>
        );
    }
    if (data) {
        content = <FAQList faqs={data} />;
    }

    return (
        <React.Fragment>
            <ContentCard
                className={`${darkmode ? "dark_bg" : "white_bg"} h-100`}
            >
                <div className="listFAQ_container">
                    <div className="container_header_wrap">
                        <h4
                            className="page_header"
                            style={{ fontSize: page_header_fs }}
                        >
                            Frequently Asked Questions
                        </h4>
                    </div>
                    <div className="faq_content_container">{content}</div>
                </div>
            </ContentCard>
        </React.Fragment>
    );
}
=======
// components/Pages/FAQ/FAQ.js
import React from 'react';

const FAQ = () => {
    return (
        <div className="faq_container">
            <h1 className="faq_header">Frequently Asked Questions</h1>
            <div className="faq_list">
                <div className="faq_item">
                    <h2 className="faq_question">What is this platform for?</h2>
                    <p className="faq_answer">This platform is designed to provide users with access to various resources and services.</p>
                </div>
                <div className="faq_item">
                    <h2 className="faq_question">How do I get started?</h2>
                    <p className="faq_answer">To get started, simply sign up or log in to your account and explore the available features.</p>
                </div>
                <div className="faq_item">
                    <h2 className="faq_question">What if I have a problem?</h2>
                    <p className="faq_answer">If you encounter any issues, please contact our support team for assistance.</p>
                </div>
                {/* Add more FAQ items as needed */}
            </div>
        </div>
    );
};
>>>>>>> bda528ed0000de194577dc399242723135ddc094

export default FAQ;