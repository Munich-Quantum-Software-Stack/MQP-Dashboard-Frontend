import React from 'react';
import { useSelector } from 'react-redux';
import BlankCard from '@components/UI/Card/BlankCard';
import ContentCard from '@components/UI/Card/ContentCard';
import ForcedResetPasswordForm from '@components/Pages/ForcedReset/ForcedResetPasswordForm';
import SuccessReset from '@components/Pages/ForcedReset/SuccessReset';
import { getForcedResetStatus } from '@utils/auth';

/**
 * ForcedResetPassword - Conditionally renders password reset form or success message
 */
function ForcedResetPassword() {
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const isForcedReset = getForcedResetStatus();

  return (
    <div className={`main_content`}>
      <ContentCard className={` ${darkmode ? 'dark_bg' : 'white_bg'} resetPwd_form_container`}>
        <BlankCard>
          {/* Show success message after reset, or the reset form if still pending */}
          {!isForcedReset && <SuccessReset />}
          {isForcedReset && <ForcedResetPasswordForm />}
        </BlankCard>
      </ContentCard>
    </div>
  );
}

export default ForcedResetPassword;
