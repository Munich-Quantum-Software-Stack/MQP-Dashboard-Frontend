import React from "react";
import { useSelector } from "react-redux";


const ContentCard = (props) => {
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const darkmode_class = darkmode ? "dark_bg" : "white_bg";
  const classes = "content_container " + darkmode_class + ' ' + props.className;
  
  return (
    <div className={classes}>
      {props.children}
    </div>
  );
  
};

export default ContentCard;
