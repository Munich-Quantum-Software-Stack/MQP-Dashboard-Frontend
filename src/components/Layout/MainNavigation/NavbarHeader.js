import React from "react";
import { motion } from "framer-motion";

const NavbarHeader = () => {
    return (
        <div className="lrz_logo_wrap" title="Munich Quantum Portal">
            <motion.div
                className="lrz_logo"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                transition={{ duration: 0.2 }}
            >
                <img
                    src="/images/lrz_wortbild_square.png"
                    className="lrz_square"
                    alt="LRZ logo"
                />
                <span className="logo_text">
                    MQP <span className="small_text">(beta)</span>
                </span>
            </motion.div>
        </div>
    );
};
export default NavbarHeader;
