import React from 'react';
import { motion } from 'framer-motion';
import '@components/UI/UI.scss';

const ToggleMeasurementButton = ({ id, className, onToggle, title, label }) => {
  const toggleSwitchHandler = () => {
    onToggle();
  };
  const spring = {
    type: 'spring',
    stiffness: 500,
    damping: 30,
  };
  return (
    <div className="d-flex justify-content-start align-items-center">
      <label>{label}</label>
      <button
        type="button"
        id={id}
        className={className}
        aria-controls={id}
        title={title}
        onClick={toggleSwitchHandler}
      >
        <motion.div className="handle" layout transition={spring}>
          <span className="handle_icon" />
        </motion.div>
      </button>
    </div>
  );
};

export default ToggleMeasurementButton;
