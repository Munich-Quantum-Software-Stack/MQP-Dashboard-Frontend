import React from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import Button from "src/components/UI/Button/Button";

//import Backdrop from "./Backdrop";
//import ModalOverlay from "./ModalContent";
import classes from "./Modal.module.css";


const ExpirationModal = (props) => {

    return createPortal(
        <React.Fragment>
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
                className={classes.modal}
            >
                
                    <header className={classes.header}>
                        <h2>{props.title}</h2>
                    </header>
                    <div className={classes.content}>
                        <p>{props.message}</p>
                    </div>
                    <footer className={classes.actions}>
                        <Button onClick={props.onConfirm}>
                            {props.buttonText}
                        </Button>
                    </footer>
                
            </motion.dialog>
        </React.Fragment>,
        document.getElementById("modal")
    );

    /*
    return (
        <React.Fragment>
            {ReactDOM.createPortal(
                <Backdrop onConfirm={props.onConfirm} />,
                document.getElementById("backdrop-root")
            )}
            {ReactDOM.createPortal(
                <ModalContent
                    title={props.title}
                    message={props.message}
                    onConfirm={props.onConfirm}
                    buttonText={props.buttonText}
                />,
                document.getElementById("overlay-root")
            )}
        </React.Fragment>
    );
    */
}

export default ExpirationModal;
