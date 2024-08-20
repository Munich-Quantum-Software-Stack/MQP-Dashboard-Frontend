import React from "react";
import { useSelector } from "react-redux";
import PaneCard from "../../UI/Card/PaneCard";
import PDFLink from "../../UI/Document/PDFLink";


const StatusItems = (props) => {
    const fs = useSelector((state) => state.accessibilities.font_size);
    const status_item_name_fs = +fs * 1.5;
    const status_item_text_fs = +fs;

    
    return (
        <div className="status_items_list">
            <div className="col-12 col-xs-6 col-md-6 col-lg-6 col-xl-4 col-xxl-3 status_item_wrap">
                <PaneCard className={`status_item status_item_bg`}>
                    <div className="d-flex justify-content-between">
                        <div className="status_item_title">
                            <h5
                                className="pane_title status_title"
                                style={{ fontSize: status_item_name_fs }}
                            >
                                Coming Soon
                            </h5>
                            <div className="short_divider"></div>
                        </div>
                    </div>

                    <div className="pane_desc">
                        <div
                            className="my-2"
                            style={{ fontSize: status_item_text_fs }}
                        >
                            User dashboard with system telemetry information
                            coming soon
                        </div>
                    </div>
                </PaneCard>
            </div>
            <div className="col-12 col-xs-6 col-md-6 col-lg-6 col-xl-4 col-xxl-3 status_item_wrap">
                <PaneCard className={`status_item status_item_bg`}>
                    <div className="d-flex justify-content-between">
                        <div className="status_item_title">
                            <h5
                                className="pane_title status_title"
                                style={{ fontSize: status_item_name_fs }}
                            >
                                Introduction to the software stack
                            </h5>
                            <div className="short_divider"></div>
                        </div>
                    </div>

                    <div className="pane_desc">
                        <div
                            className="my-2"
                            style={{ fontSize: status_item_text_fs }}
                        >
                            <PDFLink
                                src="/documents/2024-07-09-MNF-MC-SH-BM-JE-Garching-IQM-Training.pdf"
                                target="_blank"
                                pdf_text="2024-07-09-MNF-MC-SH-BM-JE-Garching-IQM-Training.pdf"
                            />
                        </div>
                    </div>
                </PaneCard>
            </div>
        </div>
    );
};

export default StatusItems;
