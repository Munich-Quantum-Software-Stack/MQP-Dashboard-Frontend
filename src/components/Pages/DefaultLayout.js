/**
 * Full-width layout wrapper
 */

import React from 'react';
import { Outlet } from 'react-router-dom';

function DefaultLayout() {
  return (
    <div className="fluid-container">
      <Outlet />
    </div>
  );
}

export default DefaultLayout;
