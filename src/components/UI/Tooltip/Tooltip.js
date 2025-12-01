import React from 'react';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

/** Wrapper for Bootstrap tooltip with hover delay */
const CustomTooltip = (props) => {
  const renderTooltip = <Tooltip id={props.id}>{props.tooltip}</Tooltip>;
  return (
    <OverlayTrigger
      overlay={renderTooltip}
      placement={props.placement}
      delay={{ show: 300, hide: 150 }}
    >
      {props.children}
    </OverlayTrigger>
  );
};

export default CustomTooltip;
