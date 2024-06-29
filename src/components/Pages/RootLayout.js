import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, useAnimate } from "framer-motion";
import { Outlet, useLoaderData } from "react-router-dom";
import UnauthoriedModal from "../UI/UnauthoriedModal";
import TopBar from "../Layout/TopBar/TopBar";
import MainNavigation from "../Layout/MainNavigation/MainNavigation";
import NavbarHeader from "../Layout/MainNavigation/NavbarHeader";
import Footer from "../Layout/Footer/Footer";
import { authActions } from "../../store/auth-slice";
import ToggleButton from "../UI/Button/ToggleButton";


const RootLayout = () => {
    const dispatch = useDispatch();
    const token = useLoaderData();
    
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const isExpired = useSelector((state) => state.authentication.isExpired);
    const [minSidebar, setMinSidebar] = useState(true);
    
    const [scope, animate] = useAnimate();

    const triggerTokenExpired = () => {
        dispatch(authActions.set_expired());
    }
    useEffect(() => {
        // check if token is valid
        if (!token) {
            return;
        }
        if (token === "EXPIRED") {    
            triggerTokenExpired();
            return;
        }
    }, [token]);

    

    const leftSidebarToggleHandler = () => {
        setMinSidebar((prevSidebar) => !prevSidebar);
        animate(
            "div.left_sidebar_wrap, div.left_topbar",
            { width: minSidebar ? 80 : 220 },
            { duration: 0.6, type: "spring" }
        );
    };

    // const resetTimerHandler = () => {
    //     //setExpiration();
    //     dispatch(authActions.setExpiration());
    //     const newDuration = getTokenDuration();
    //     setDuration(newDuration);
    //     setExpired(false);
    // }

    

    return (
        <React.Fragment>
            <AnimatePresence>
                {isExpired && <UnauthoriedModal />}
            </AnimatePresence>

            <div className="fluid-container" ref={scope}>
                <div className="mx-0 topbar_container">
                    <div
                        className={`left_topbar ${
                            !minSidebar ? "minimized" : ""
                        }`}
                    >
                        <AnimatePresence>
                            {minSidebar && <NavbarHeader />}
                        </AnimatePresence>
                        <ToggleButton
                            id="toggle_left_sidebar"
                            aria-controls="left_sidebar"
                            data-target="left_sidebar"
                            aria-label="Toggle Left Sidebar"
                            className={`toggle_btn ${
                                !minSidebar ? "collapsed" : ""
                            }`}
                            onToggle={leftSidebarToggleHandler}
                        />
                    </div>
                    <div className="right_topbar">
                        <AnimatePresence>
                            <TopBar />
                        </AnimatePresence>
                    </div>
                </div>
                <div className="mx-0 root_container">
                    {token && (
                        <div className="left_sidebar_wrap">
                            <AnimatePresence>
                                <MainNavigation onHidden={minSidebar} />
                            </AnimatePresence>
                        </div>
                    )}
                    <div
                        className={`right_content ${
                            darkmode ? "darkgrey_bg" : "lightgrey_bg"
                        }`}
                    >
                        {token && (
                            <div className={` mx-0 main_content_container `}>
                                <Outlet />
                            </div>
                        )}
                        <Footer />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default RootLayout;
