import React from 'react';

/** Simple panel container */
const PaneCard = (props) => {
  const classes = 'pane_card ' + props.className;

  return <div className={classes}>{props.children}</div>;
};

export default PaneCard;
