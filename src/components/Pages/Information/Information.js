import React from "react";
import { useSelector } from "react-redux";
import ContentCard from "../../UI/Card/ContentCard";
import InformationContent from "./InformationContent";

import "./Information.scss";

function Information() {
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const page_header_fs = +fs * 1.5;
    return (
        <React.Fragment>
            <ContentCard className={`information_container ${darkmode ? "dark_bg" : "white_bg"} h-100`}>
                <h4
                    className="page_header"
                    style={{ fontSize: page_header_fs }}
                >
                    Information regarding use of the systems will be placed here
                    shortly Please contact us via email if you need anything for now.
                </h4>
            </ContentCard>
        </React.Fragment>
    );
}

export default Information;
