import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getFontsize } from 'src/components/utils/theme';
import ToggleDarkmodeButton from 'src/components/Layout/TopBar/ToggleDarkmodeButton';

const AccessibilitiesNavbar = ({ id, onDarkmode, onDecreaseFS, onResetFS, onIncreaseFS }) => {
  const [limitMinFS, setLimitMinFS] = useState(false);
  const [limitMaxFS, setLimitMaxFS] = useState(false);

  // Handle darkmode
  const toggleDarkmodeHandler = () => {
    onDarkmode();
  };

  // Handle font-size
  const decreaseFontSizeHandler = () => {
    const currentFontSize = getFontsize();
    if (+currentFontSize <= 14) {
      setLimitMinFS(true);
    }
    setLimitMaxFS(false);
    onDecreaseFS();
  };

  const resetFontSizeHandler = () => {
    setLimitMinFS(false);
    setLimitMaxFS(false);
    onResetFS();
  };

  const increaseFontSizeHandler = () => {
    const currentFontSize = getFontsize();
    if (+currentFontSize >= 20) {
      setLimitMaxFS(true);
    }
    setLimitMinFS(false);
    onIncreaseFS();
  };

  return (
    <div className="topbar_element accessibilities" id={id}>
      <motion.ul
        className="accessibilities_list"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        <motion.li
          className="darkmode_adjustment"
          key="darkmode"
          variants={{
            hidden: { opacity: 0, scale: 0.5 },
            visible: { opacity: 1, scale: [0.8, 1.3, 1] },
          }}
          transition={{ type: 'spring' }}
        >
          <ToggleDarkmodeButton
            id="darkmode_toggle"
            className="darkmode_btn"
            onToggle={toggleDarkmodeHandler}
          />
        </motion.li>

        <motion.li
          key="fontsize"
          className="font_size_adjustment"
          variants={{
            hidden: { opacity: 0, scale: 0.5 },
            visible: { opacity: 1, scale: [0.8, 1.3, 1] },
          }}
          transition={{ type: 'spring' }}
        >
          <button
            title="Decrease Font Size"
            type="button"
            className="font_size_btn"
            onClick={decreaseFontSizeHandler}
            disabled={limitMinFS ? 'disabled' : ''}
          >
            A&#45;
          </button>
          <button
            title="Default Font Size"
            type="button"
            className="font_size_btn"
            onClick={resetFontSizeHandler}
          >
            A
          </button>
          <button
            title="Increase Font Size"
            type="button"
            className="font_size_btn"
            onClick={increaseFontSizeHandler}
            disabled={limitMaxFS ? 'disabled' : ''}
          >
            A&#43;
          </button>
        </motion.li>
      </motion.ul>
    </div>
  );
};

export default AccessibilitiesNavbar;
