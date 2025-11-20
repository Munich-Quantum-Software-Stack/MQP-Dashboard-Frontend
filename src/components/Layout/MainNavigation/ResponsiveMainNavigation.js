import React from 'react';
import { motion } from 'framer-motion';
import { useRouteLoaderData } from 'react-router-dom';

import Navigation from './Navigation';
import UserNavigation from './UserNav';
import AccessibilitiesNavbar from '../TopBar/AccessibilitiesNavbar';

function ResponsiveMainNavigation({ onDarkmode, onDecreaseFS, onResetFS, onIncreaseFS }) {
  const token = useRouteLoaderData('home');

  const darkmodeHandler = () => {
    onDarkmode();
  };
  const decreaseFontSizeHandler = () => {
    onDecreaseFS();
  };
  const resetFontSizeHandler = () => {
    onResetFS();
  };
  const increaseFontSizeHandler = () => {
    onIncreaseFS();
  };

  return (
    <motion.div
      className={`responsive_sidebar `}
      id="res_main_navigation"
      initial={{ height: 0 }}
      animate={{ height: 'auto' }}
      transition={{ duration: 0.6, type: 'spring', ease: 'all' }}
      exit={{ height: 0 }}
    >
      <div className="main_navigation">
        <div className="responsive_navbar">
          <AccessibilitiesNavbar
            id="access_dropdown"
            onDarkmode={darkmodeHandler}
            onDecreaseFS={decreaseFontSizeHandler}
            onResetFS={resetFontSizeHandler}
            onIncreaseFS={increaseFontSizeHandler}
          />
          <hr className="menu_divider" />

          {token && <Navigation onHidden={true} />}
          <hr className="menu_divider" />

          <UserNavigation onHidden={true} />
        </div>
      </div>
    </motion.div>
  );
}

export default ResponsiveMainNavigation;
