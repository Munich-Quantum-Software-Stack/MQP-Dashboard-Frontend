import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import NavbarHeader from 'src/components/Layout/MainNavigation/NavbarHeader';
import Timer from 'src/components/Layout/TopBar/Timer';
import ResponsiveMainNavigation from 'src/components/Layout/MainNavigation/ResponsiveMainNavigation';
import useOutsideClick from 'src/hooks/use-outside-click';
import AccessibilitiesNavbar from 'src/components/Layout/TopBar/AccessibilitiesNavbar';
import { AnimatePresence } from 'framer-motion';
import { getDarkmode, getFontsize, getDefaultFontsize } from 'src/components/utils/theme';
import { accessibilitiesAction } from 'src/store/accessibilities-slice';
import ToggleButton from 'src/components/UI/Button/ToggleButton';

function TopBar() {
  const dispatch = useDispatch();
  const defaultFS = getFontsize();

  const [toggleMenu, setToggleMenu] = useState(false);
  const [darkmode, setDarkmode] = useState(getDarkmode());
  const [fontsize, setFontsize] = useState(defaultFS);

  const toggleMenuHandler = () => {
    setToggleMenu((prevState) => !prevState);
  };
  const clickOutsideOfNavbarHandler = () => {
    setToggleMenu(false);
  };
  const navbarRef = useOutsideClick(clickOutsideOfNavbarHandler);

  const darkmodeHandler = () => {
    setDarkmode((prevDarkmode) => !prevDarkmode);
  };

  useEffect(() => {
    dispatch(accessibilitiesAction.toggleDarkmode(darkmode));
  }, [darkmode, dispatch]);

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

  useEffect(() => {
    dispatch(accessibilitiesAction.toggleFontsize(fontsize));
  }, [fontsize, dispatch]);

  return (
    <React.Fragment>
      <div className={`topbar ${darkmode ? 'dark_bg' : 'white_bg'}`}>
        <div className="topbar_element navbar_toggle" ref={navbarRef}>
          <ToggleButton
            controls="main_navigation"
            label="Toggle Navigation"
            target="res_main_navigation"
            className={`navbar_toggler ${!toggleMenu ? 'collapsed' : ''}`}
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
          darkmode={darkmode}
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
