/**
 * Full-width layout wrapper
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import usePageTitle from '@hooks/use-page-title';

function DefaultLayout() {
  usePageTitle();
  return (
    <div className="fluid-container">
      <Outlet />
    </div>
  );
}

export default DefaultLayout;
