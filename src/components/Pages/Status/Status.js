import React from 'react';
import ContentCard from 'src/components/UI/Card/ContentCard';
import StatusContent from 'src/components/Pages/Status/StatusContent';
import './Status.scss';

function Status() {
  return (
    <React.Fragment>
      <ContentCard className={`status_container`}>
        <StatusContent />
      </ContentCard>
    </React.Fragment>
  );
}

export default Status;
