import React, { useState } from "react";
import { useSelector } from "react-redux";
import ContentCard from "src/components/UI/Card/ContentCard";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import AccountSettings from "src/components/Pages/Settings/AccountSettings";
//import AccessibilitiesSettings from "./AccessibilitiesSettings";

import "./Settings.scss";

function Settings() {
  const [key, setKey] = useState("account_settings");
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const settingTabHeader_fs = +fs * 1.1;
	
  return (
      <React.Fragment>
          <div className="main_content">
              <ContentCard
                  className={`${
                      darkmode ? "dark_bg" : "white_bg"
                  } settings_container`}
              >
                  <Tabs
                      id="settings"
                      activeKey={key}
                      onSelect={(k) => setKey(k)}
                  >
                      <Tab
                          eventKey="account_settings"
                          title="Account Settings"
                          style={{ fontSize: settingTabHeader_fs }}
                      >
                          <AccountSettings />
                      </Tab>
                      {/** TODO: add Accessibilites Setting tab
                      <Tab
                          eventKey="accessibilities_settings"
                          title="Accessibilities Settings"
                          style={{ fontSize: settingTabHeader_fs }}
                      >
                          <AccessibilitiesSettings />
                      </Tab>
                      */}
                  </Tabs>
              </ContentCard>
          </div>
      </React.Fragment>
  );
}

export default Settings;


