import React from "react";
import { Outlet } from "react-router-dom";


import "./Jobs.scss";

function JobsRoot() {

  return (

      <div className={` jobs_container flex-grow-1`}>
        <Outlet />
      </div>
  );
}

export default JobsRoot;
