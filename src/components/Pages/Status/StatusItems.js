import React from "react";
import ComingSoon from "src/components/Pages/Status/StatusItems/ComingSoon";
import SoftwareStackIntroduction from "src/components/Pages/Status/StatusItems/Software_Stack_Introduction";
import IQMGHZIntroduction from "src/components/Pages/Status/StatusItems/IQM_GHZ_Introduction";


const StatusItems = () => {
    const pane_width_class = "col-12 col-xs-6 col-md-6 col-lg-6 col-xl-4 status_item_wrap";
    return (
        <div className="status_items_list">
            <div className={`${pane_width_class}`}>
                <IQMGHZIntroduction />
            </div>
            <div className={`${pane_width_class}`}>
                <SoftwareStackIntroduction />
            </div>
            <div className={`${pane_width_class}`}>
                <ComingSoon />
            </div>
        </div>
    );
};

export default StatusItems;
