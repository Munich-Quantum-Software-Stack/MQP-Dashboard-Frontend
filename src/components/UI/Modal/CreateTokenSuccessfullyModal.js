import React, { useState } from 'react';
import { motion } from 'framer-motion/dist/framer-motion';
import { createPortal } from 'react-dom';
import Button from 'src/components/UI/Button/Button';
import NotificationCard from 'src/components/UI/MessageBox/NotificationCard';
import classes from './Modal.module.css';

const SuccessfullyTokenModal = ({ newToken, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyHandler = () => {
    navigator.clipboard.writeText(newToken.token_value);
    setIsCopied(true);
  };

  return createPortal(
    <>
      <div className="backdrop" />

      <motion.dialog
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        exit="hidden"
        open
        className={classes.tokenModal}
      >
        <div className="tokenContainer_header_wrap">
          <h4 className="mb-3 page_header">Created new token successfully</h4>
        </div>
        <NotificationCard variant="primary">
          Notice: Token hash is displayed <b>only once</b>.
        </NotificationCard>

        <div className="token_detail">
          <div className="token_detail_item">Token Hash Value:</div>
          <div className="token_detail_value token_hash">{newToken.token_value}</div>

          <button className="mt-3 copy_btn" onClick={copyHandler}>
            {isCopied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="text-center token_detail_btn_wrap">
          <Button className="my-4" onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.dialog>
    </>,
    document.getElementById('modal'),
  );
};

export default SuccessfullyTokenModal;
