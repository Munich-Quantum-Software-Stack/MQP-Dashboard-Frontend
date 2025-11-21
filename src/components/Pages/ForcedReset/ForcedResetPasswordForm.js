import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { json, useNavigate, useRouteLoaderData } from 'react-router-dom';
import Button from 'src/components/UI/Button/Button';
import AlertCard from 'src/components/UI/MessageBox/AlertCard';
import { authActions } from 'src/store/auth-slice';

const ForcedResetPasswordForm = (props) => {
  const dispatch = useDispatch();

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwdConfirm, setNewPwdConfirm] = useState('');
  const [formHasError, setFormHasError] = useState(false);
  const [error, setError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(null);

  const access_token = useRouteLoaderData('home');

  const currentPwdChangeHandler = (event) => {
    setCurrentPwd(event.target.value);
  };
  const newPwdChangeHandler = (event) => {
    setNewPwd(event.target.value);
  };
  const newPwdConfirmChangeHandler = (event) => {
    setNewPwdConfirm(event.target.value);
  };

  const clearErrorHandler = () => {
    setError(null);
  };

  const navigate = useNavigate();
  const resetPwdHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    // check if fields are empty
    if (currentPwd.trim().length === 0) {
      setFormHasError(true);
      setIsSubmitting(false);
      return;
    }
    if (newPwd.trim().length === 0) {
      setFormHasError(true);
      setIsSubmitting(false);
      return;
    }
    if (newPwdConfirm.trim().length === 0) {
      setFormHasError(true);
      setIsSubmitting(false);
      return;
    }
    // check if form is valid
    if (
      newPwd.trim().length > 0 &&
      newPwdConfirm.trim().length > 0 &&
      newPwd.trim() !== newPwdConfirm.trim()
    ) {
      setFormHasError(true);
      setError('The new password does not match with confirm password!');
      setIsSubmitting(false);
      return;
    }

    const data = {
      currentPwd: currentPwd,
      newPwd: newPwd,
      newPwdConfirm: newPwdConfirm,
    };

    // send request to backend API
    const reset_url = process.env.REACT_APP_API_ENDPOINT + '/forced_reset';
    try {
      // send HTTP request
      const response = await fetch(reset_url, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer' + access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      // check errors
      if (!response.ok) {
        setIsSubmitting(false);
        setFormHasError(true);
        setError(resData.error_message);
        return response;
      }

      //localStorage.setItem("isReset", "0");
      dispatch(authActions.disable_reset());
      // reset data
      setCurrentPwd('');
      setNewPwd('');
      setNewPwdConfirm('');
      setIsSubmitting(false);

      // redirect
      return navigate('/status');
    } catch (error) {
      console.error('Forced reset request failed.');
      console.error(error);
      throw json(error);
    }
  };

  return (
    <React.Fragment>
      <h4>Please enter your new password to continue using this portal.</h4>
      <div>Your new password must match these points:</div>
      <ul>
        <li>At least 8 characters lang</li>
        <li>Include at least one number</li>
        <li>Include at least one special character such as: # ; ! $ % & =</li>
        <li>Must have uppercase and lowercase letter</li>
      </ul>
      {formHasError && error && (
        <AlertCard variant="danger" onClear={clearErrorHandler}>
          {error}
        </AlertCard>
      )}
      <form method="POST" id="resetForm" className="resetPwd_form" onSubmit={resetPwdHandler}>
        <div className="form-field my-3">
          <label htmlFor="current_pwd">Current Password *</label>
          <input
            type="password"
            id="current_pwd"
            name="current_pwd"
            value={currentPwd}
            onChange={currentPwdChangeHandler}
            className={`${
              formHasError && currentPwd.trim().length === 0
                ? 'form-control invalid_input'
                : 'form-control'
            }`}
          />
          {formHasError && currentPwd.trim().length === 0 && (
            <p className="error-text">The current password must not be empty!</p>
          )}
        </div>
        <div className="form-field my-3">
          <label htmlFor="new_pwd">New Password *</label>
          <input
            type="password"
            id="new_pwd"
            name="new_pwd"
            value={newPwd}
            onChange={newPwdChangeHandler}
            className={`${
              formHasError && newPwd.trim().length === 0
                ? 'form-control invalid_input'
                : 'form-control'
            }`}
          />
          {formHasError && newPwd.trim().length === 0 && (
            <p className="error-text">The new password must not be empty!</p>
          )}
        </div>
        <div className="form-field my-3">
          <label htmlFor="new_pwd_confirm">Confirm New Password *</label>
          <input
            type="password"
            id="new_pwd_confirm"
            name="new_pwd_confirm"
            value={newPwdConfirm}
            onChange={newPwdConfirmChangeHandler}
            className={`${
              formHasError && newPwdConfirm.trim().length === 0
                ? 'form-control invalid_input'
                : 'form-control'
            }`}
          />
          {formHasError && newPwdConfirm.trim().length === 0 && (
            <p className="error-text">The confirm password must not be empty!</p>
          )}
        </div>
        <div className=" mt-4">
          <Button type="submit" className="save_btn">
            {isSubmitting ? 'Loading...' : 'Save'}
          </Button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default ForcedResetPasswordForm;
