import React from "react";
import { useSelector } from "react-redux";
import BlankCard from "src/components/UI/Card/BlankCard";
import ContentCard from "src/components/UI/Card/ContentCard";
import ForcedResetPasswordForm from "src/components/Pages/ForcedReset/ForcedResetPasswordForm";
import SuccessReset from "src/components/Pages/ForcedReset/SuccessReset";
import { getForcedResetStatus } from "src/components/utils/auth";

function ForcedResetPassword() {
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  //const darkmode = useSelector((state) => state.darkmode.darkmode);
  const isForcedReset = getForcedResetStatus();  
  //console.log("is resetted: " + storedIsResetted);

  return (
    <div className={`main_content`}>
      <ContentCard
        className={` ${
          darkmode ? "dark_bg" : "white_bg"
        } resetPwd_form_container`}
      >
        <BlankCard>
          {!isForcedReset && <SuccessReset />}
          {isForcedReset && <ForcedResetPasswordForm />}
        </BlankCard>
      </ContentCard>
    </div>
  );
}

export default ForcedResetPassword;