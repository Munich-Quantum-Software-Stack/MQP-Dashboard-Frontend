import React from 'react';

/** Hamburger menu toggle button */
const ToggleButton = ({ id, controls, target, label, className, onToggle }) => {
  return (
    <button
      type="button"
      id={id}
      aria-controls={controls}
      data-target={target}
      aria-label={label}
      className={`${className}`}
      onClick={onToggle}
    >
      <span className="toggler_bar bar_1"></span>
      <span className="toggler_bar bar_2"></span>
      <span className="toggler_bar bar_3"></span>
    </button>
  );
};

export default ToggleButton;
