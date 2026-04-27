import React from 'react';
import { Outlet } from 'react-router-dom';

const TelemetryRoot = () => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default TelemetryRoot;
