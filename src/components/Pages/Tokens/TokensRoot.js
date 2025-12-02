import React from 'react';
import { Outlet } from 'react-router-dom';

const TokensRootLayout = () => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default TokensRootLayout;
