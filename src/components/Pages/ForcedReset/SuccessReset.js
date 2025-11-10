import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "src/components/UI/Button/Button";

const SuccessReset = () => {
  // successfully request
  
  const navigate = useNavigate();
  const onClickHandler = () => {
    return navigate("/status");
  }
  return (
    <React.Fragment>
      <h4 className="mb-4">You have successfully reset your password.</h4>
      <Button type="button" onClick={onClickHandler}>Continue</Button>
    </React.Fragment>
  );
}

export default SuccessReset;