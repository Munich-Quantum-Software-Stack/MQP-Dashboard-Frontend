/**
 * Dismissible alert card
 */
import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

function AlertCard(props) {
  // const fs = useSelector((state) => state.accessibilities.font_size);
  // const notice_fs = +fs * 0.8;
  const [show, setShow] = useState(true);

  const closeHandler = () => {
    setShow(false);
    props.onClear();
  };
  return (
    <div className="my-3 flashMsg_wrap">
      {show && (
        <Alert variant={props.variant} onClose={closeHandler}>
          {props.children}
        </Alert>
      )}
    </div>
  );
}

export default AlertCard;
