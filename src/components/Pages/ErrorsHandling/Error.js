import React from "react";
import { useSelector } from "react-redux";
import { useRouteError } from "react-router-dom";
import BlankCard from "../../UI/Card/BlankCard";
function ErrorPage() {
  const error = useRouteError();
  const fs = useSelector((state) => state.accessibilities.font_size);
  const errorTitle_fs = +fs * 2.5;
  const errorMessage_fs = +fs * 1.1;
  let title = "An error occurs!!!";
  let message = "Something went wrong!";

  switch (error.status) {
    case 401: 
      message = "UNAUTHORIED!";
      break;
    case 404: 
      title = "Page Not Found!";
      message = "The requested page could not be found!";
      break;
    default:
      break;
  }

  return (
    <div className="fluid-container flex-grow-1">
      <div className="row h-100">
        <BlankCard>
          <div id="error-page" className="text-center">
     
              <h1 style={{ fontSize: errorTitle_fs }}>{title}</h1>
              <p style={{ fontSize: errorMessage_fs }}>{message}</p>
      

          </div>
        </BlankCard>
      </div>
    </div>
  );
}

export default ErrorPage;