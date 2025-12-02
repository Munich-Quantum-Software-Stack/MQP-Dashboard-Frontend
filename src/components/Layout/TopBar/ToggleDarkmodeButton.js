import { motion } from 'framer-motion';
import '@components/UI/UI.scss';

/** Animated dark mode toggle switch */
const ToggleDarkmodeButton = ({ id, onToggle, className, darkmode }) => {
  const isOn = darkmode;
  const toggleSwitchHandler = () => {
    onToggle();
  };
  const spring = {
    type: 'spring',
    stiffness: 500,
    damping: 30,
  };
  const btnClassName = 'toggle_switch_btn ' + className;
  return (
    <button
      id={id}
      className={btnClassName}
      data-toggle={isOn}
      title={`${isOn ? 'Disable Darkmode' : 'Enable Darkmode'}`}
      onClick={toggleSwitchHandler}
    >
      <motion.div className="handle" layout transition={spring}>
        <span className="handle_icon" />
      </motion.div>
    </button>
  );
};

export default ToggleDarkmodeButton;
