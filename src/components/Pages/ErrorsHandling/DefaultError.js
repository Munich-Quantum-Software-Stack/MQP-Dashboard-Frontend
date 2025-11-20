import React from 'react';

import ContentCard from '../../UI/Card/ContentCard';

function DefaultErrorPage({ status, title, message }) {
  switch (status) {
    case '401':
      title = 'UNAUTHORIED!';
      break;
    case '404':
      title = 'Page Not Found!';
      message = 'The requested page could not be found!';
      break;
    default:
      title = 'Internal Server Error!';
      break;
  }

  return (
    <div className="fluid-container">
      <div className="row mt-5">
        <div id="error-page" className="text-center">
          <ContentCard variant="danger">
            <h3>{title}</h3>
            <p>{message}</p>
          </ContentCard>
        </div>
      </div>
    </div>
  );
}

export default DefaultErrorPage;
