import React from 'react';
import { motion } from 'framer-motion';

const Button = (props) => {
  let classes = 'dashboard_btn ' + props.className;
  return (
    <motion.button
      transition={{ backgroundColor: '#ffbe00', duration: 0.5 }}
      type={props.type || 'button'}
      className={classes}
      onClick={props.onClick}
      disabled={props.disabled}
      style={props.style}
      title={props.title}
    >
      {props.children}
    </motion.button>
  );
};
export default Button;
