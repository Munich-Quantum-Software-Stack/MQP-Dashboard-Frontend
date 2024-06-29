import React from "react";
import { Outlet } from "react-router-dom";



import "./Resources.scss";


function ResourcesRoot() {
  
  return (
      <div className={`resources_container flex-grow-1`}>
        <Outlet />
      </div>
  );
}

export default ResourcesRoot;
