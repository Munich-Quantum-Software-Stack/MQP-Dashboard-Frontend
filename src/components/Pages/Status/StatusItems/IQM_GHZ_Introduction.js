import { useSelector } from "react-redux";
import PaneCard from "src/components/UI/Card/PaneCard";
import VideoLink from "src/components/UI/Document/VideoLink";
const IQMGHZIntroduction = () => {
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
                        GHZ state preparation and fidelity measurement
                    </h5>
                    <div className="short_divider"></div>
                </div>
            </div>

            <div className="pane_desc">
                <div className="my-2" style={{ fontSize: status_item_text_fs }}>
                    <VideoLink
                        src="/videos/GHZ-state-preparation-and-fidelity-measurement.mp4"
                        target="_blank"
                        video_link_class="left_icon_link"
                        video_text="GHZ-state-preparation-and-fidelity-measurement.mp4"
                    />
                </div>
            </div>
            <div className="pane_date">
                <div className="updated_date">Updated: Sept 19, 2024</div>
            </div>
        </PaneCard>
    );
};

export default IQMGHZIntroduction;