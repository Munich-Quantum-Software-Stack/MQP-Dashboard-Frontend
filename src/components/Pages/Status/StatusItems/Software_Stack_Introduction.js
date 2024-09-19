import { useSelector } from "react-redux";
import PaneCard from "../../../UI/Card/PaneCard";
import PDFLink from "../../../UI/Document/PDFLink";

const SoftwareStackIntroduction = () => {
    const fs = useSelector((state) => state.accessibilities.font_size);
    const status_item_name_fs = +fs * 1.5;
    const status_item_text_fs = +fs;
    return (
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
                <div className="my-2" style={{ fontSize: status_item_text_fs }}>
                    <PDFLink
                        src="/documents/2024-07-09-MNF-MC-SH-BM-JE-Garching-IQM-Training.pdf"
                        target="_blank"
                        pdf_link_class="left_icon_link"
                        pdf_text="2024-07-09-MNF-MC-SH-BM-JE-Garching-IQM-Training.pdf"
                    />
                </div>
            </div>
            <div className="pane_date">
                <div className="updated_date">Updated: Aug 23, 2024</div>
            </div>
        </PaneCard>
    );
}

export default SoftwareStackIntroduction;