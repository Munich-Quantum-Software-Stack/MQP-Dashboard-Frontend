import React, { useState } from 'react';
import { Link, json } from 'react-router-dom';
//import Message from '@components/UI/MessageBox/AlertCard';
import Button from '@components/UI/Button/Button';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const emailHandler = (event) => {
    if (event.target.value.trim().length > 0 && event.target.value.include('@')) {
      setEmail(event.target.value);
    }
  };

  const forgotPwdSubmit = async (event) => {
    event.preventDefault();

    const data = {
      email: email,
    };
    // send request to backend API
    const forgotPwd_url = process.env.REACT_APP_API_ENDPOINT + '/forgot';
    try {
      // send HTTP request
      const response = await fetch(forgotPwd_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      // check errors
      if (!response.ok) {
        return response;
      }
      // successfully login
      const resData = await response.json();
      if (resData.status !== 200) {
        return resData;
      }
      // send response to identity addresses
    } catch (error) {
      console.error('Password reset request failed.');
      console.error(error);
      throw json(error);
    }
  };

  return (
    <React.Fragment>
      <div>Please enter your email address to reset password.</div>
      <form method="POST" id="forgotForm" onSubmit={forgotPwdSubmit}>
        <div className="form-field my-3">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            required
            onChange={emailHandler}
            className="form-control"
          />
        </div>
        <div className="text-center mt-4">
          <Button type="submit" className="login_btn">
            Send
          </Button>
        </div>
      </form>

      <div className="text-center mt-3">
        <Link
          to="/login"
          className="dashboard_link text_color_grey fs-7 underline_link"
          title="Cancel"
        >
          Cancel
        </Link>
      </div>
    </React.Fragment>
  );
};

export default ForgotPasswordForm;
