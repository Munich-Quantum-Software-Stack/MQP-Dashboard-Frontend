import React, { useState } from "react";
import { useDispatch } from "react-redux";
import NavbarHeader from "../MainNavigation/NavbarHeader";
import Timer from "./Timer";
import ResponsiveMainNavigation from "../MainNavigation/ResponsiveMainNavigation";
import useOutsideClick from "../../../hooks/use-outside-click";
import AccessibilitiesNavbar from "./AccessibilitiesNavbar";
import { AnimatePresence } from "framer-motion";
import { getDarkmode } from "../../utils/theme";
import { accessibilitiesAction } from "../../../store/accessibilities-slice";
import { getFontsize, getDefaultFontsize } from "../../utils/theme";
import ToggleButton from "../../UI/Button/ToggleButton";

function TopBar() {
    const dispatch = useDispatch();
    const defaultFS = getFontsize();

    const [toggleMenu, setToggleMenu] = useState(false);
    const [darkmode, setDarkmode] = useState(getDarkmode());
    const [fontsize, setFontsize] = useState(defaultFS);

    // Handle toggle responsive navbar
    const toggleMenuHandler = () => {
        setToggleMenu((prevState) => !prevState);
    };
    const clickOutsideOfNavbarHandler = () => {
        setToggleMenu(false);
    };
    const navbarRef = useOutsideClick(clickOutsideOfNavbarHandler);

    // Handle darkmode
    const darkmodeHandler = () => {
        setDarkmode((prevDarkmode) => !prevDarkmode);
    };
    // save current state
    dispatch(accessibilitiesAction.toggleDarkmode(darkmode));

    // Handle Font size adjustment
    const decreaseFontSizeHandler = () => {
        const currentFontSize = getFontsize();
        const newFontSize = +currentFontSize - 2;
        setFontsize(newFontSize);
    };

    const resetFontSizeHandler = () => {
        const defaultFontSize = getDefaultFontsize();
        setFontsize(defaultFontSize);
    };

    const increaseFontSizeHandler = () => {
        const currentFontSize = getFontsize();
        const newFontsize = +currentFontSize + 2;
        setFontsize(newFontsize);
    };
    dispatch(accessibilitiesAction.toggleFontsize(fontsize));

    return (
        <React.Fragment>
            <div className={`topbar ${darkmode ? "dark_bg" : "white_bg"}`}>
                <div className="topbar_element navbar_toggle" ref={navbarRef}>
                    <ToggleButton
                        controls="main_navigation"
                        label="Toggle Navigation"
                        target="res_main_navigation"
                        className={`navbar_toggler ${
                            !toggleMenu ? "collapsed" : ""
                        }`}
                        onToggle={toggleMenuHandler}
                    />
                    

                    <AnimatePresence>
                        {toggleMenu && (
                            <ResponsiveMainNavigation
                                onDarkmode={darkmodeHandler}
                                onDecreaseFS={decreaseFontSizeHandler}
                                onResetFS={resetFontSizeHandler}
                                onIncreaseFS={increaseFontSizeHandler}
                            />
                        )}
                    </AnimatePresence>
                </div>

                <div className="responsive_logo">
                    <NavbarHeader />
                </div>

                <div className="topbar_element search_form_wrap"></div>

                <AccessibilitiesNavbar
                    id="access_top"
                    onDarkmode={darkmodeHandler}
                    onDecreaseFS={decreaseFontSizeHandler}
                    onResetFS={resetFontSizeHandler}
                    onIncreaseFS={increaseFontSizeHandler}
                />
                
                <div className="topbar_element timer">
                    <Timer />
                </div>
            </div>
        </React.Fragment>
    );
}

export default TopBar;