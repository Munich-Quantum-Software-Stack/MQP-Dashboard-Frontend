import React from "react";
import { useSelector } from "react-redux";
import ContentCard from "src/components/UI/Card/ContentCard";
import { useQuery } from "@tanstack/react-query";
import { fetchResources } from "src/components/utils/resources-http";
import ResourcesList from "src/components/Pages/Resources/ResourcesList";

import LoadingIndicator from "src/components/UI/LoadingIndicator";
import ErrorBlock from "src/components/UI/MessageBox/ErrorBlock";
import { getAuthToken } from "src/components/utils/auth";
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


