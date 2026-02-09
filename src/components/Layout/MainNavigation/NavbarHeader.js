import React from 'react';
import { motion } from 'framer-motion';
import { getSidebarLogo } from '@utils/get-user-logos';

/** Animated MQP logo header */
const NavbarHeader = () => {
  const user_logos_path = process.env.PUBLIC_URL + '/user_logos/';
  const sidebar_logo = getSidebarLogo();

  return (
    <div className="topbar_logo_wrap" title="Munich Quantum Portal">
      <motion.div
        className="topbar_logo"
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: 'auto' }}
        transition={{ duration: 0.2 }}
      >
        <a href={sidebar_logo.link} rel="noopener noreferrer">
          <img
            src={user_logos_path + sidebar_logo.file_name + sidebar_logo.file_ext}
            className="topbar_logo_img"
            alt={sidebar_logo.alt}
            width={sidebar_logo.width}
            height={sidebar_logo.height}
          />
        </a>
        <span className="logo_text"></span>
      </motion.div>
    </div>
  );
};
export default NavbarHeader;
