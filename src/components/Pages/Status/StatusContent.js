import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import StatusItems from './StatusItems';

function StatusContent() {
  const fs = useSelector((state) => state.accessibilities.font_size);
  const h1_fs = +fs * 3.2;
  return (
    <React.Fragment>
      <div className="mb-2 text-center" style={{ marginBottom: '0.75rem' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: h1_fs }}
          className="welcome_text"
        >
          Welcome to Munich Quantum Portal
        </motion.h1>
      </div>
      <StatusItems />
    </React.Fragment>
  );
}

export default StatusContent;
