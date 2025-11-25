import React from 'react';
import Alert from 'react-bootstrap/Alert';

const NotificationCard = (props) => {
  return (
    <div className="my-3 flashMsg_wrap">
      <Alert variant={props.variant}>{props.children}</Alert>
    </div>
  );
};

export default NotificationCard;
