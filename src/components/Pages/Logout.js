import React from 'react';
import { redirect, useSubmit } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '@store/auth-slice';
const Logout = ({ onHidden }) => {
  const submit = useSubmit();
  const dispatch = useDispatch();
  const fs = useSelector((state) => state.accessibilities.font_size);
  const navbar_fs = +fs * 1.1;

  const logoutHandler = () => {
    dispatch(authActions.logout());
    submit(null, { method: 'POST', action: '/logout' });
  };

  return (
    <React.Fragment>
      <form method="POST" onSubmit={logoutHandler}>
        <button className="logout_btn" type="submit" style={{ fontSize: navbar_fs }}>
          <span className="logout_icon"></span>
          {onHidden && <span className="link_text">Log Out</span>}
        </button>
      </form>
    </React.Fragment>
  );
};

export default Logout;

export function action() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('token');
  localStorage.removeItem('isReset');
  localStorage.removeItem('expiration');
  return redirect('/login');
}
