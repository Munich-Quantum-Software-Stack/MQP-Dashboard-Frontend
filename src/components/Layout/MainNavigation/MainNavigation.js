import React from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import Navigation from '@components/Layout/MainNavigation/Navigation';
import UserNavigation from '@components/Layout/MainNavigation/UserNav';

/** Left sidebar with main and user navigation */
function MainNavigation({ id, onHidden }) {
  const token = useRouteLoaderData('home');

  // useEffect(() => {
  //     if (scope.current) {
  //         animate(
  //             "span.link_text",
  //             { x: [-20, 0] },
  //             { type: "spring", duration: 0.5 }
  //         );
  //     }
  // }, []);
  return (
    <div className={`left_sidebar `} id="left_sidebar">
      <div className="main_navigation" id={id ? id : ' '}>
        <div className="left_navbar">
          {token && <Navigation onHidden={onHidden} />}
          <UserNavigation onHidden={onHidden} />
        </div>
      </div>
    </div>
  );
}

export default MainNavigation;
