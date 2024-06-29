import React from "react";
import { useSelector } from "react-redux";
import BlankCard from "../../UI/Card/BlankCard";
import ContentCard from "../../UI/Card/ContentCard";
import ForcedResetPasswordForm from "./ForcedResetPasswordForm";
import SuccessReset from "./SuccessReset";
import { getAuthentication, getForcedResetStatus } from "../../utils/auth";
import { getDarkmode } from "../../utils/theme";

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