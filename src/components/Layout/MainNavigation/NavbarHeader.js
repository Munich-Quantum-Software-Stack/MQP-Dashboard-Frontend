import React from 'react';
import { motion } from 'framer-motion';
import { getSidebarLogo } from '@utils/get-user-logos';

/** Animated MQP logo header */
const NavbarHeader = () => {
  const user_logos_path = process.env.PUBLIC_URL + '/user_logos/';
  const default_image = `${process.env.PUBLIC_URL}/images/lrz_wortbild_square.png`;
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
            src={`${user_logos_path}${sidebar_logo.file_name}${sidebar_logo.file_ext}`}
            className="topbar_logo_img"
            alt={sidebar_logo.alt}
            width={sidebar_logo.width}
            height={sidebar_logo.height}
            data-fallback-index={0}
            onError={(e) => {
              try {
                const primary = `${user_logos_path}${sidebar_logo.file_name}${sidebar_logo.file_ext}`;
                const lrz = `${user_logos_path}lrz_wortbild_square.png`;
                const fallback = default_image;

                const idx = parseInt(
                  e.currentTarget.getAttribute('data-fallback-index') || '0',
                  10,
                );
                const next = idx + 1;

                let nextSrc = null;
                if (next === 0) nextSrc = primary;
                else if (next === 1) nextSrc = lrz;
                else if (next === 2) nextSrc = fallback;

                if (nextSrc) {
                  e.currentTarget.setAttribute('data-fallback-index', String(next));
                  e.currentTarget.src = nextSrc;
                } else {
                  e.currentTarget.onerror = null;
                }
              } catch (err) {
                e.currentTarget.onerror = null;
              }
            }}
          />
        </a>
        <span className="logo_text"></span>
      </motion.div>
    </div>
  );
};
export default NavbarHeader;
