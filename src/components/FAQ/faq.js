import React from "react";
import { useSelector } from "react-redux";
import BlankCard from "../../UI/Card/BlankCard";

const FAQ = () => {
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const page_header_fs = +fs * 1.5;
    return (
        <BlankCard className={`information_container ${darkmode ? "dark_bg" : "white_bg"} h-100`}>
            <h4 className="page_header" style={{ fontSize: page_header_fs }}>
                FAQs coming shortly
            </h4>
        </BlankCard>
    );
};

export default FAQ;