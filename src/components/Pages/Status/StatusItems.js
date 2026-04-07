import React from 'react';
import ComingSoon from '@components/Pages/Status/StatusItems/ComingSoon';
import SoftwareStackIntroduction from '@components/Pages/Status/StatusItems/Software_Stack_Introduction';
import IQMGHZIntroduction from '@components/Pages/Status/StatusItems/IQM_GHZ_Introduction';

import EuroQexaIntro from '@components/Pages/Status/StatusItems/EuroQexa_Intro';
import MQSSOverview from '@components/Pages/Status/StatusItems/MQSS_Overview';
import EuroQexaDemo from '@components/Pages/Status/StatusItems/EuroQexa_Demo';
import QAOAMaxCut from '@components/Pages/Status/StatusItems/QAOAMaxCut';
import FriendlyUserPilotStructure from '@components/Pages/Status/StatusItems/FriendlyUserPilot_Structure';

const StatusItems = () => {
  const pane_width_class = 'status_item_wrap';
  const half_pane_class = 'status_item_wrap';
  return (
    <div>
      {/* Euro-Q-Exa title */}
      <div className="mb-4 text-center">
        <h3 className="status_group_title">Euro-Q-Exa</h3>
      </div>

      {/* First row: three cards */}
      <div className="status_items_list three-cols">
        <div className={pane_width_class} style={{ aspectRatio: '2/1' }}>
          <EuroQexaIntro />
        </div>
        <div className={pane_width_class} style={{ aspectRatio: '2/1' }}>
          <MQSSOverview />
        </div>
        <div className={pane_width_class} style={{ aspectRatio: '2/1' }}>
          <EuroQexaDemo />
        </div>
      </div>

      {/* Second row: two cards */}
      <div className="status_items_list three-cols mt-3">
        <div className={half_pane_class} style={{ aspectRatio: '2/1' }}>
          <QAOAMaxCut />
        </div>
        <div className={half_pane_class} style={{ aspectRatio: '2/1' }}>
          <FriendlyUserPilotStructure />
        </div>
      </div>

      {/* Lower title: Q-Exa */}
      <div className="mt-4 mb-3 text-center">
        <h3 className="status_group_title">Q-Exa</h3>
      </div>

      {/* Third row: existing/current material (keep previous layout) */}
      <div className="status_items_list three-cols">
        <div className={pane_width_class} style={{ aspectRatio: '2/1' }}>
          <IQMGHZIntroduction />
        </div>
        <div className={pane_width_class} style={{ aspectRatio: '2/1' }}>
          <SoftwareStackIntroduction />
        </div>
        <div className={pane_width_class} style={{ aspectRatio: '2/1' }}>
          <ComingSoon />
        </div>
      </div>
    </div>
  );
};

export default StatusItems;
