import React from "react";
//import { useSelector } from "react-redux";
//import { useRouteLoaderData } from "react-router-dom";
import ContentCard from "../../UI/Card/ContentCard";
import StatusContent from './StatusContent';
//import { getAuthToken } from "../../utils/auth";
import './Status.scss';

function Status() {
  //const darkmode = useSelector((state) => state.accessibilities.darkmode);
  //const darkmode = getDarkmode();
  //const user_token = useRouteLoaderData("home");
   
  return (
    <React.Fragment>
        <ContentCard
          className={`status_container`}
        >
          <StatusContent />
        </ContentCard>
    </React.Fragment>
  );
}

export default Status;

/*
export async function loader() {
  // fetching to status
  const access_token = getAuthToken();
  const status_url = process.env.REACT_APP_API_ENDPOINT + "/status";
  const response = await fetch(status_url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    },
  });


  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "Could not fetch pointers!" }), {
      status: response.status,
    });
  } else {
    const resData = await response.json();
    // console.log(resData);
    //if (!resData.jobs) { return null; }
    return resData.status;
  }
}
  */