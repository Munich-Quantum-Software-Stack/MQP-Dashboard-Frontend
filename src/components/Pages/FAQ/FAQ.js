import React from "react";
import { useSelector } from "react-redux";
import ContentCard from "../../UI/Card/ContentCard";
import FAQContent from "./FAQContent";

import "./FAQ.scss";

function FAQ() {
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const page_header_fs = +fs * 1.5;
    return (
        <React.Fragment>
            <ContentCard className={`faq_container ${darkmode ? "dark_bg" : "white_bg"} h-100`}>
                <h4
                    className="page_header"
                    style={{ fontSize: page_header_fs }}
                >
                    FAQs coming shortly. If you have any query, please do send us an email. 
                </h4>
            </ContentCard>
        </React.Fragment>
    );
}

export default FAQ;
