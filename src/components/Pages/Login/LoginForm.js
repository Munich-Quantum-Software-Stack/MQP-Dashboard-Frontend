// Importing modules
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AlertCard from '@components/UI/MessageBox/AlertCard';
import Button from '@components/UI/Button/Button';
import { authActions } from '@store/auth-slice';
import { setExpiration } from '@utils/auth';
import { hasMinLength, isNotEmpty } from '@utils/validationUserInput';
import { useInput } from '@hooks/use-input';
import { fetchLogin } from '@utils/authentication-http';

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [validationError, setValidationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    value: identityValue,
    handleInputChange: handleIdentityChange,
    handleInputBlur: handleIdenttiyBlur,
    hasError: identityHasError,
  } = useInput('', (value) => isNotEmpty(value));

  const {
    value: passwordValue,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlue,
    hasError: passwordHasError,
  } = useInput('', (value) => hasMinLength(value, 8));

  const loginHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Validation
    const isIdentityValid = isNotEmpty(identityValue);
    const isPasswordValid = isNotEmpty(passwordValue);
    if (!isIdentityValid || !isPasswordValid) {
      setIsSubmitting(false);
      setValidationError('Identity and Password must not be empty.');
      return;
    }

    if (identityHasError || passwordHasError) {
      setIsSubmitting(false);
      return;
    }

    const authData = {
      identity: identityValue,
      secret: passwordValue,
    };

    try {
      // send HTTP request
      const data = await fetchLogin(authData);

      const access_token = data.access_token;
      dispatch(authActions.logged_in({ access_token }));
      // forced reset password
      const forcedResetPwd = data.force_secret_reset;
      if (forcedResetPwd) {
        // forced to reset password
        dispatch(authActions.enable_reset());
        setIsSubmitting(false);
        return navigate('/forced_reset_password');
      } else {
        // set expiration
        setExpiration();
        // reset form data
        event.target.reset();
        setIsSubmitting(false);
        // redirect to Status page
        return navigate('/status');
      }
      /*
            const response = await fetch(login_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(authData),
            });

            // check errors
            if (!response.ok) {
                setError("Internal Server Error!");
                setIsSubmitting(false);
                return;
            } else {
                const resData = await response.json();
                // successfully login
                const access_token = resData.access_token;
                if (access_token && access_token !== '') {
                    dispatch(authActions.logged_in({ access_token }));
                    // forced reset password
                    const forcedResetPwd = resData.force_secret_reset;
                    if (forcedResetPwd) {
                        // forced to reset password
                        setIsSubmitting(false);
                        dispatch(authActions.enable_reset());
                        return navigate("/forced_reset_password");
                    } else {
                        // save expiration to localStorage
                        setExpiration();                  
                        setIsSubmitting(false);

                        // redirect to Status page
                        return navigate("/status");
                    }
                }
            }
            */
    } catch (error) {
      //setValidationError(error.message);
      setValidationError('Internal Server Error! Please try again later.');
      setIsSubmitting(false);
    }
  };

  return (
    <form id="LoginForm" method="POST" onSubmit={loginHandler}>
      {validationError && <AlertCard variant="danger">{validationError}</AlertCard>}
      {identityHasError && <AlertCard variant="danger">Identity must not be empty.</AlertCard>}
      {passwordHasError && (
        <AlertCard variant="danger">
          Password must not be empty and has min length 8 characters.
        </AlertCard>
      )}
      <div className="form-field my-3">
        <label htmlFor="identity">Identity *</label>
        <input
          type="text"
          id="identity"
          name="identity"
          value={identityValue}
          onBlur={handleIdenttiyBlur}
          onChange={handleIdentityChange}
          className={`${identityHasError ? 'form-control invalid_input' : 'form-control'}`}
        />
      </div>
      <div className="form-field my-3">
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          name="password"
          value={passwordValue}
          onBlur={handlePasswordBlue}
          onChange={handlePasswordChange}
          className={`${passwordHasError ? 'form-control invalid_input' : 'form-control'}`}
        />

        <div className="mt-2 d-flex justify-content-end">
          <Link
            to="/forgot_password"
            className="dashboard_link text_color_grey fs-7"
            title="Forgot Password"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <div className="text-center mt-4">
        <Button type="submit" className="login_btn">
          {isSubmitting ? 'Logging...' : 'Login'}
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
