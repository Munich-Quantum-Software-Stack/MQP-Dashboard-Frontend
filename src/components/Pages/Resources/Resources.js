import React from "react";
import { useSelector } from "react-redux";
//import { defer, Await, useLoaderData } from "react-router-dom";

import ContentCard from "../../UI/Card/ContentCard";
import { useQuery } from "@tanstack/react-query";
//import { queryClient } from "../../utils/query";
import { fetchResources } from "../../utils/resources-http";
import ResourcesList from "./ResourcesList";

import LoadingIndicator from "../../UI/LoadingIndicator";
import ErrorBlock from "../../UI/MessageBox/ErrorBlock";
import { getAuthToken } from "../../utils/auth";
import "./Resources.scss";

function Resources() {
    const access_token = getAuthToken();
    const darkmode = useSelector((state) => state.accessibilities.darkmode);

    const { data, isPending, isError, error } = useQuery({
        queryKey: ["resources"],
        queryFn: ({ signal }) => fetchResources({ signal, access_token }),
    });

    let resourcesContent;
    if (isError) {
        return (
            <ContentCard className={`${darkmode ? "dark_bg" : "white_bg"} `}>
                <ErrorBlock title={error.message} message={error.code} />
            </ContentCard>
        );
    }
    if (isPending) {
        resourcesContent = (
            <ContentCard className={`${darkmode ? "dark_bg" : "white_bg"} `}>
                <LoadingIndicator />
                <p>Loading data...</p>
            </ContentCard>
        );
    }

    if (data) {
        // console.log("Fetching data:");
        // console.log(data);

        resourcesContent = (
            <ContentCard className={`${darkmode ? "dark_bg" : "white_bg"} h-100`}>
                <ResourcesList resources={data.resources} available_resources={data.available_resources ? data.available_resources : null} />
            </ContentCard>
        );
    }

    return (
        <React.Fragment>            
            {resourcesContent}                
        </React.Fragment>
    );
}

export default Resources;

/*
async function loaderResources() {
    const access_token = getAuthToken();
    return queryClient.fetchQuery({
        queryKey: ["resources"],
        queryFn: ({ signal }) =>
            fetchResources({ signal, access_token: access_token }),
    });
}

export async function loader() {
    return defer({
        resources: await loaderResources(),
    });
}
*/
