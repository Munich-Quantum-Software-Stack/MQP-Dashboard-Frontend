import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import Logout from "../../Pages/Logout";


const UserNavigation = ({ onHidden }) => {
    //const token = useRouteLoaderData("home");
    const fs = useSelector((state) => state.accessibilities.font_size);
    const navbar_fs = +fs * 1.1;
    return (
        <div className="user_acc">
            <ul className="mainNav userNav">
                {/* {token && (
                    <li className="nav-item ">
                        <NavLink
                            to="settings"
                            title="Account Settings"
                            className="nav-link "
                            style={{ fontSize: navbar_fs }}
                            {...({ isActive }) =>
                                isActive ? "active" : undefined}
                            end
                        >
                            <span className="link_icon settings_icon"></span>
                            {onHidden && <span className="link_text">Settings</span>}
                        </NavLink>
                    </li>
                )} */}
                <li className="nav-item">
                    <NavLink
                        to="feedback"
                        className="nav-link "
                        style={{ fontSize: navbar_fs }}
                    >
                        <span className="link_icon feedback_icon"></span>
                        {onHidden && (
                            <span className="link_text">Feedback</span>
                        )}
                    </NavLink>
                </li>
                <li className="nav-item ">
                    <Logout onHidden={onHidden} />
                </li>
            </ul>
        </div>
    );
};

export default UserNavigation;