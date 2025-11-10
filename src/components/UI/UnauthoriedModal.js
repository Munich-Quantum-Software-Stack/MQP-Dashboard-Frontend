import React, { useEffect, useState } from "react";
import { useSubmit } from "react-router-dom";
import { useDispatch } from "react-redux";
import ExpirationModal from "src/components/UI/Modal/ExpirationModal";
import { authActions } from "src/store/auth-slice";


const UnauthoriedModal = () => {
    const submit = useSubmit();
    const startTimer = 10; // 10 seconds 
    const [countNumber, setCountNumber] = useState(startTimer);
    const dispatch = useDispatch();
    useEffect(() => {
        if (countNumber === 0) {
            submit(null, { action: "/logout", method: "post" });
            dispatch(authActions.logout());
        }
        const interval = setInterval(() => {
            setCountNumber((prevNumber) => prevNumber - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [countNumber, dispatch, submit]);

    const confirmHandler = () => {
        dispatch(authActions.logout());
        submit(null, { action: "/logout", method: "post" });
    };
    let title = "Session expired!";
    return (
        <React.Fragment>
            <ExpirationModal
                title={title}
                message={`You will be logged out in ${countNumber} seconds.`}
                onConfirm={confirmHandler}
                buttonText="OK"
            />
        </React.Fragment>
    );
}
export default UnauthoriedModal;