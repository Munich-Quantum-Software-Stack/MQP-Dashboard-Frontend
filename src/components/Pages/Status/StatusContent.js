import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";


function StatusContent() {
    const fs = useSelector((state) => state.accessibilities.font_size);
    const h1_fs = +fs * 2.5;
    return (
   
            <div className="text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: h1_fs }}
                    className="welcome_text"
                >
                    Welcome to Munich Quantum Portal
                </motion.h1>

                
            </div>
 
    );
}

export default StatusContent;
