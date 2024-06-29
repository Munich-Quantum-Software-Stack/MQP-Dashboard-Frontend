import React from "react";
import { useSubmit, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../../store/auth-slice";


const LogoutButton = () => {
    const submit = useSubmit();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fs = useSelector((state) => state.accessibilities.font_size);
    const navbar_fs = +fs * 1.1;

    const logoutHandler = () => {
        // submit hook
        dispatch(authActions.logout());
        submit(null, { method: "POST", action: "/logout" });
        navigate("/login");
    };

    return (
        <React.Fragment>
            <form method="POST" onSubmit={logoutHandler}>
                <button
                    className="dashboard_btn "
                    type="submit"
                    style={{ fontSize: navbar_fs }}
                >
                    <span className="logout_icon"></span>
                    <span>Log Out</span>
                </button>
            </form>
        </React.Fragment>
    );
}

export default LogoutButton;