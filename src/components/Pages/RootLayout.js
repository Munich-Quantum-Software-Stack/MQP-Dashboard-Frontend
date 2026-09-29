import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { Outlet, useLoaderData } from 'react-router-dom';
import UnauthoriedModal from '@components/UI/UnauthoriedModal';
import TopBar from '@components/Layout/TopBar/TopBar';
import MainNavigation from '@components/Layout/MainNavigation/MainNavigation';
import NavbarHeader from '@components/Layout/MainNavigation/NavbarHeader';
import Footer from '@components/Layout/Footer/Footer';
import { authActions } from '@store/auth-slice';
import ToggleButton from '@components/UI/Button/ToggleButton';

const isExpiredToken = (value) => typeof value === 'string' && value.localeCompare('EXPIRED') === 0;

/** Main authenticated layout with sidebar, topbar, and session handling */
const RootLayout = () => {
  const dispatch = useDispatch();
  const token = useLoaderData();

  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const isExpired = useSelector((state) => state.authentication.isExpired);
  const [minSidebar, setMinSidebar] = useState(true);

  const triggerTokenExpired = useCallback(() => {
    dispatch(authActions.set_expired());
  }, [dispatch]);
  useEffect(() => {
    // check if token is valid
    if (!token) {
      return;
    }
    if (isExpiredToken(token)) {
      triggerTokenExpired();
      return;
    }
  }, [token, triggerTokenExpired]);

  const leftSidebarToggleHandler = () => {
    setMinSidebar((prevSidebar) => !prevSidebar);
  };

  // const resetTimerHandler = () => {
  //     //setExpiration();
  //     dispatch(authActions.setExpiration());
  //     const newDuration = getTokenDuration();
  //     setDuration(newDuration);
  //     setExpired(false);
  // }

  return (
    <React.Fragment>
      <AnimatePresence>{isExpired && <UnauthoriedModal />}</AnimatePresence>

      <div className={`fluid-container body_container ${!minSidebar ? 'sidebar_collapsed' : ''}`}>
        <div className="mx-0 topbar_container">
          <div className={`left_topbar ${!minSidebar ? 'minimized' : ''}`}>
            <NavbarHeader />
            <ToggleButton
              id="toggle_left_sidebar"
              aria-controls="left_sidebar"
              data-target="left_sidebar"
              aria-label="Toggle Left Sidebar"
              label="Toggle Left Sidebar"
              className={`toggle_btn ${!minSidebar ? 'collapsed' : ''}`}
              onToggle={leftSidebarToggleHandler}
            />
          </div>
          <div className={`right_topbar ${darkmode ? 'dark_bg' : 'white_bg'}`}>
            <AnimatePresence>
              <TopBar />
            </AnimatePresence>
          </div>
        </div>
        <div className="mx-0 root_container">
          {token && (
            <div className="left_sidebar_wrap">
              <AnimatePresence>
                <MainNavigation onHidden={minSidebar} />
              </AnimatePresence>
            </div>
          )}
          <div className={`right_content ${darkmode ? 'darkgrey_bg' : 'lightgrey_bg'}`}>
            {token && (
              <div className={` mx-0 main_content_container `}>
                <Outlet />
              </div>
            )}
            <Footer />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RootLayout;
