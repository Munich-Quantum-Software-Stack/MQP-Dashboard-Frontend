import React from 'react';
import { Outlet } from 'react-router-dom';

import './Jobs.scss';

/**
 * JobsRoot - Layout wrapper for Jobs routes, renders nested routes via Outlet
 */
function JobsRoot() {
  return (
    <div className={` jobs_container `}>
      <Outlet />
    </div>
  );
}

export default JobsRoot;
