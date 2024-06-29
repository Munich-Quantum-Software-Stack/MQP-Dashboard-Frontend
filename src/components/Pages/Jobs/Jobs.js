import React, { Suspense } from "react";
import { queryClient } from "../../utils/query";
import {
    defer,
    useLoaderData,
    Await,
} from "react-router-dom";
import { useSelector } from "react-redux";
import JobsList from "./JobsList";
//import JobsSorting from "./JobsSorting";
import BlankCard from "../../UI/Card/BlankCard";
import ContentCard from "../../UI/Card/ContentCard";
//import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "../../utils/jobs-http";
// import JobsFilter from "./JobsFilter";
// import { sortingJobsByID } from "../../utils/jobs";
import LoadingIndicator from "../../UI/LoadingIndicator";
//import ErrorBlock from "../../UI/MessageBox/ErrorBlock";
import { getAuthToken } from "../../utils/auth";


import "./Jobs.scss";

function Jobs() {
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const page_header_fs = +fs * 1.5;

    const { jobs } = useLoaderData();
    if (jobs.length === 0) {
        return (
            <BlankCard className={`${darkmode ? "dark_bg" : "white_bg"} h-100`}>
                <h5>No Job found.</h5>
            </BlankCard>
        );
    }
    // const [sortingProperty, setSortingProperty] = useState("id");
    // const sortingJobsHandler = (sortedProperty) => {
    //     setSortingProperty(sortedProperty);
    // };
    // const { data, isPending, isError, error } = useQuery({
    //     queryKey: ["jobs"],
    //     queryFn: () => fetchJobs(),
    // });
    // if (isError) {
    //     return <ErrorBlock title={error.message} message={error.code} />;
    // }
    // if (isPending) {
    //     return (
    //         <ContentCard className={`${darkmode ? "dark_bg" : "white_bg"} `}>
    //             <LoadingIndicator />
    //         </ContentCard>
    //     );
    // }
  
    // let sortedJobs;
    // if (data) {
    //     sortedJobs = sortingJobsByID(data);
    // }

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
                    </div>

                    <div className="jobs_actions">
                        {/* <JobsSorting onSorting={sortingJobsHandler} /> */}
                        {/* <JobsFilter /> */}
                    </div>
                    <Suspense fallback={<LoadingIndicator />}>
                        <Await resolve={jobs}>
                            {(loadedJobs) => <JobsList jobs={loadedJobs} />}
                        </Await>
                    </Suspense>
                </div>
            </ContentCard>
        </React.Fragment>
    );
}

export default Jobs;

/*
 * Load all Jobs
 */

async function loaderJobsList() {
    // fetching to jobs
    const access_token = getAuthToken();

    return queryClient.fetchQuery({
        queryKey: ["jobs"],
        queryFn: ({signal}) => fetchJobs({signal, access_token: access_token}),
    });
}

export async function loader() {
    return defer({
        jobs: await loaderJobsList(),
    });
}

