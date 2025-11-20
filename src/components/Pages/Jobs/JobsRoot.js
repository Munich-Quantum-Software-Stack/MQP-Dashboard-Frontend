import React from 'react';
import { Outlet } from 'react-router-dom';

import './Jobs.scss';

function JobsRoot() {
  return (
    <div className={` jobs_container `}>
      <Outlet />
    </div>
  );
}

export default JobsRoot;
