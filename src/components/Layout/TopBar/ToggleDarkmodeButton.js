
import { motion } from "framer-motion";
import { getDarkmode } from "../../utils/theme";
import '../../UI/UI.scss';

const ToggleDarkmodeButton = ({ id, onToggle, className }) => {
    const isOn = getDarkmode();
    const toggleSwitchHandler = () => {
        onToggle();
    };
    const spring = {
        type: "spring",
        stiffness: 500,
        damping: 30,
    };
    const btnClassName = "toggle_switch_btn " + className;
    return (
        <div
            id={id}
            className={btnClassName}
            data-toggle={isOn}
            title={`${isOn ? 'Disable Darkmode' : 'Enable Darkmode'}`}
            onClick={toggleSwitchHandler}
            role="button"
        >
            <motion.div className="handle" layout transition={spring}><span className="handle_icon" /></motion.div>
        </div>
    );
};

export default ToggleDarkmodeButton;