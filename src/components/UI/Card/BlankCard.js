import React from 'react';
import { useSelector } from 'react-redux';

/** Minimal container with dark mode support */
const BlankCard = (props) => {
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const darkmode_class = darkmode ? 'dark_bg' : 'white_bg';
  const classes = 'blank_container ' + darkmode_class + ' ' + props.className;

  return <div className={classes}>{props.children}</div>;
};

export default BlankCard;
