import React from 'react';
import { motion } from 'framer-motion';
import lrzSidebarLogo from '@assets/images/lrz_wortbild_square.jpeg';

/** Animated MQP logo header */
const NavbarHeader = () => {
  return (
    <div className="topbar_logo_wrap" title="Munich Quantum Portal">
      <motion.div
        className="topbar_logo"
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: 'auto' }}
        transition={{ duration: 0.2 }}
      >
        <img src={lrzSidebarLogo} className="topbar_logo_img" alt="LRZ" />
        <span className="logo_text"></span>
      </motion.div>
    </div>
  );
};
export default NavbarHeader;
