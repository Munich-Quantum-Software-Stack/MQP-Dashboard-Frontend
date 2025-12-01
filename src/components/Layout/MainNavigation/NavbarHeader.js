import React from 'react';
import { motion } from 'framer-motion';

/** Animated MQP logo header */
const NavbarHeader = () => {
  return (
    <div className="topbar_mqp_logo_wrap" title="Munich Quantum Portal">
      <motion.div
        className="mqp_logo"
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: 'auto' }}
        transition={{ duration: 0.2 }}
      >
        <img src="/images/MQV_Logo_Blue.svg" className="mqp_logo_img" alt="MQP logo" />
        <span className="logo_text"></span>
      </motion.div>
    </div>
  );
};
export default NavbarHeader;
