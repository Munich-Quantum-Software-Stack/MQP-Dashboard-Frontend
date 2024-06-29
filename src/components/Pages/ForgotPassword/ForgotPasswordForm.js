import React, {useState} from "react";
import { Link, json } from "react-router-dom";
//import Message from "../../UI/MessageBox/AlertCard";
import Button from "../../UI/Button/Button";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
  const emailHandler = (event) => {
    if (event.target.value.trim().length > 0 && event.target.value.include('@')) {
      setEmail(event.target.value);        
      }
    };
  
  const forgotPwdSubmit = async (event) => {
    event.preventDefault();
    
    const data = {
      email: email
    }
    // send request to backend API
    const forgotPwd_url = process.env.REACT_APP_API_ENDPOINT + "/forgot"; 
    try {
      // send HTTP request
      const response = await fetch(forgotPwd_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // check errors
      if (!response.ok) {
        return response;
      }
      // successfully login
      const resData = await response.json();
      console.log("Response Data:");
      console.log(resData);
      if (resData.status !== 200) {
        return resData;
      }
      const newResetPwd = resData.newResetPwd;
      console.log("New Password:");
      console.log(newResetPwd);
      // send response to identity addresses
    }
    catch (error) {
      console.log("Catch errors:");
      console.log(error);
      throw json(error);
    }

  } 
  
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
