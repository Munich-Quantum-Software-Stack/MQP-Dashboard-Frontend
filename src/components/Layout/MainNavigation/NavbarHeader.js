import React from 'react';
import { motion } from 'framer-motion';
import { getSidebarLogo } from '@utils/get-user-logos';

/** Animated MQP logo header */
const NavbarHeader = () => {
  const user_logos_path = process.env.PUBLIC_URL + '/user_logos/';
  const default_image = `${user_logos_path}lrz_wortbild_square.png`;
  const sidebar_logo = getSidebarLogo();

  return (
    <div className="topbar_logo_wrap" title="Munich Quantum Portal">
      <motion.div
        className="topbar_logo"
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: 'auto' }}
        transition={{ duration: 0.2 }}
      >
        <img
          src={process.env.PUBLIC_URL + '/user_logos/UserTopSidebarLogo.png'}
          className="topbar_logo_img"
          alt="Logo"
          width="72px"
          height="72px"
        />
        <span className="logo_text"></span>
      </motion.div>
    </div>
  );
};
export default NavbarHeader;
