import React from "react";
import { useSelector } from "react-redux";

import TopBar from "src/components/Layout/TopBar/TopBar";
import MainNavigation from "src/components/Layout/MainNavigation/MainNavigation";
import Footer from "src/components/Layout/Footer/Footer";
import ForcedResetPassword from "src/components/Pages/ForcedReset/ForcedResetPassword";

const ForcedResetLayout = () => {
  const darkmode = useSelector((state) => state.accessibilities.darkmode);

  return (
    <React.Fragment>
      <div className="fluid-container">
        <div className="row mx-0">
     
            <div className="col-12 col-lg-2 col-xl-2 px-0 left_sidebar_wrap">
              <MainNavigation />
            </div>
    
          <div
            className={`col-12 col-lg-10 col-xl-10 px-0 right_content ${
              darkmode ? "darkgrey_bg" : "lightgrey_bg"
            }`}
          >
            <div className="fluid-container ">
              <div className="row mx-0">
                <TopBar />
              </div>
             
                <div className={`main_content_container `}>
                  <ForcedResetPassword />         
                </div>
          
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ForcedResetLayout;
