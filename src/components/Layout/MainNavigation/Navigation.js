import React from "react";

import { useSelector } from "react-redux";
import { NavLink, useRouteLoaderData } from "react-router-dom";


const Navigation = ({ onHidden }) => {
    const token = useRouteLoaderData("home");
    const fs = useSelector((state) => state.accessibilities.font_size);
    const navbar_fs = +fs * 1.1;

    return (
        <React.Fragment>
            {token && (
                <nav className="navbar">
                    <ul id="main_menu" className="mainNav">
                        <li className="nav-item">
                            <NavLink
                                to="status"
                                className="nav-link"
                                style={{ fontSize: navbar_fs }}
                                {...({ isActive }) =>
                                    isActive ? "active" : undefined}
                                end
                            >
                                <span className="link_icon status_icon"></span>
                                {onHidden && (
                                    <span className="link_text">Status</span>
                                )}
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="tokens"
                                className="nav-link"
                                style={{ fontSize: navbar_fs }}
                            >
                                <span className="link_icon tokens_icon"></span>
                                {onHidden && (
                                    <span className="link_text">Tokens</span>
                                )}
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="jobs"
                                className="nav-link "
                                style={{ fontSize: navbar_fs }}
                            >
                                <span className="link_icon jobs_icon"></span>
                                {onHidden && (
                                    <span className="link_text">Jobs</span>
                                )}
                            </NavLink>
                        </li>
                        {/* 
                        <li className="nav-item">
                            
                        </li>
                        */}
                        <li className="nav-item">
                            <NavLink
                                to="budgets"
                                className="nav-link "
                                style={{ fontSize: navbar_fs }}
                            >
                                <span className="link_icon budgets_icon"></span>
                                {onHidden && (
                                    <span className="link_text">Budgets</span>
                                )}
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="resources"
                                className="nav-link "
                                style={{ fontSize: navbar_fs }}
                            >
                                <span className="link_icon resources_icon"></span>
                                {onHidden && (
                                    <span className="link_text">Resources</span>
                                )}
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="faq"
                                className="nav-link "
                                style={{ fontSize: navbar_fs }}
                            >
                                <span className="link_icon faq_icon"></span>
                                {onHidden && (
                                    <span className="link_text">FAQ</span>
                                )}
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            )}
        </React.Fragment>
    );
};

export default Navigation;