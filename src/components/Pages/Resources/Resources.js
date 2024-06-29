import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { defer, Await, useLoaderData } from "react-router-dom";
import BlankCard from "../../UI/Card/BlankCard";
import ContentCard from "../../UI/Card/ContentCard";
//import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../../utils/query";
import { fetchResources } from "../../utils/resources-http";
import ResourcesList from "./ResourcesList";
import LoadingIndicator from "../../UI/LoadingIndicator";
//import ErrorBlock from "../../UI/MessageBox/ErrorBlock";
import { getAuthToken } from "../../utils/auth";
import "./Resources.scss";

function Resources() {
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const page_header_fs = +fs * 1.5;
    // let resourcesContent;
    // resourcesContent = (
    //     <BlankCard className={`${darkmode ? "dark_bg" : "white_bg"} h-100`}>
    //         <h3>Resources information will be updated soon.</h3>
    //     </BlankCard>
    // );
    // return <React.Fragment>{resourcesContent}</React.Fragment>;

    const { resources } = useLoaderData();
    // console.log("loaded resources:");
    // console.log(resources);
    if (resources.length === 0) {
        return (
            <BlankCard className={`${darkmode ? "dark_bg" : "white_bg"} h-100`}>
                <h5>No Resource found.</h5>
            </BlankCard>
        );
    }


    // const { data, isPending, isError, error } = useQuery({
    //     queryKey: ["resources"],
    //     queryFn: () => fetchResources(),
    // });
    // if (isError) {
    //     return <ErrorBlock title={error.message} message={error.code} />;
    // }
    // if (isPending) {
    //     return (
    //         <ContentCard
    //             className={`${
    //                 darkmode ? "dark_bg" : "white_bg"
    //             } resources_container `}
    //         >
    //             <LoadingIndicator />
    //         </ContentCard>
    //     );
    // }

    // if (data) {
    //     return (resourcesContent = (
    //         <ContentCard
    //             className={`${
    //                 darkmode ? "dark_bg" : "white_bg"
    //             } resources_container `}
    //         >
    //             <h4 className="page_header">Available Resources</h4>
    //             <ResourcesList resources={data} />
    //         </ContentCard>
    //     ));
    // }

    
    return (
        <React.Fragment>
            <ContentCard
                className={`${darkmode ? "dark_bg" : "white_bg"} h-100`}
            >
                <h4
                    className="page_header"
                    style={{ fontSize: page_header_fs }}
                >
                    Available Resources
                </h4>
                <Suspense fallback={<LoadingIndicator />}>
                    <Await resolve={resources}>
                        {(loadedResources) => (
                            <ResourcesList resources={loadedResources} />
                        )}
                    </Await>
                </Suspense>
            </ContentCard>
        </React.Fragment>
    );
}

export default Resources;

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
