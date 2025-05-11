import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import JobsList from "./JobsList";
import LoadingIndicator from "../../UI/LoadingIndicator";
import ContentCard from "../../UI/Card/ContentCard";
import { queryFetchJobs } from "../../utils/jobs-http";
import ErrorBlock from "../../UI/MessageBox/ErrorBlock";
import { getAuthToken } from "../../utils/auth";


import "./Jobs.scss";

function Jobs() {
    const access_token = getAuthToken();
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const page_header_fs = +fs * 1.5;

    const { data, isPending, isError, error } = useQuery({
        queryKey: ["jobs"],
        queryFn: ({signal}) => queryFetchJobs({signal, access_token: access_token}),
    });

    if (isError) {
        return (<ErrorBlock title={error.message} message={error.code} />);
    }
    let content;
    if (isPending) {
        content = (
            <ContentCard className={`${darkmode ? "dark_bg" : "white_bg"} `}>
                <LoadingIndicator />
                <p>Loading data...</p>
            </ContentCard>
        );
    }
    if (data) {
        content = (<JobsList jobs={data} />)
    }

    return (
        <React.Fragment>
            <ContentCard
                className={`${darkmode ? "dark_bg" : "white_bg"} h-100`}
            >
                <div className={`listJob_container`}>
                    <div className="container_header_wrap">
                        <h4
                            className="page_header"
                            style={{ fontSize: page_header_fs }}
                        >
                            Your Jobs
                        </h4>
                        <p className="shots_allowed_text">Shots allowed: 100</p>
                    </div>
                    <div className="jobs_content_container">
                        {content}
                    </div>
                </div>
            </ContentCard>
        </React.Fragment>
    );
}

export default Jobs;

/*
 * Load all Jobs
 */

// async function loaderJobsList() {
//     // fetching to jobs
//     const access_token = getAuthToken();

//     return queryClient.fetchQuery({
//         queryKey: ["jobs"],
//         queryFn: ({signal}) => fetchJobs({signal, access_token: access_token}),
//     });
// }

// export async function loader() {
//     return defer({
//         jobs: await loaderJobsList(),
//     });
// }

