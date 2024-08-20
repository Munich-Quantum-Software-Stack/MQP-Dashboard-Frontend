import React from "react";
import { useSelector } from "react-redux";
import {
    Link,
    useLoaderData,
} from "react-router-dom";
import { CSVLink, CSVDownload } from "react-csv";
import Table from "react-bootstrap/Table";
//import Button from "../../UI/Button/Button";
import { getAuthToken } from "../../utils/auth";
//import useHttp from "../../../hooks/use-http";
import ContentCard from "../../UI/Card/ContentCard";

import { queryClient } from "../../utils/query";
import { fetchJob } from "../../utils/jobs-http";


const JobDetail = () => {
    const job = useLoaderData();
    // console.log("loaded job:");
    // console.log(job);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const text_fs = +fs;
    const page_header_fs = +fs * 1.5;

    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const darkmode_class = darkmode ? "dark_bg" : "white_bg";
    const copyJob = job;
    const exportJob = JSON.stringify(copyJob);

    const exportJobResult = () => {
        const link = document.createElement("a");
        let file = new Blob([job.result], { type: "application/json" });
        link.href = URL.createObjectURL(file);
        link.download = "Result-Job-" + job.id + ".json";
        link.click();
    }

    return (
        <ContentCard>
            <h4 style={{ fontSize: page_header_fs }}>Detail of job {job.id}</h4>
            <div className={`job_detail_container ${darkmode_class} `}>
                <Table
                    responsive
                    bordered
                    striped
                    variant={`${darkmode ? "dark" : "light"} `}
                    className="mb-0 job_property"
                    style={{ fontSize: text_fs }}
                >
                    <tbody>
                        <tr>
                            <th>ID:</th>
                            <td>{job.id}</td>
                        </tr>
                        <tr>
                            <th>Status:</th>
                            <td>{job.status}</td>
                        </tr>
                        <tr>
                            <th>Note:</th>
                            <td>{job.note}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            <div className="job_detail_container">
                <Table
                    responsive
                    bordered
                    striped
                    variant={`${darkmode ? "dark" : "light"} `}
                    className="mb-0 job_property"
                    style={{ fontSize: text_fs }}
                >
                    <tbody>
                        <tr>
                            <th>Shots count:</th>
                            <td>{job.shots}</td>
                        </tr>
                        {/* <tr>
                            <th>Circuit:</th>
                            <td>{job.circuit}</td>
                        </tr> */}
                        <tr>
                            <th>Circuit Format:</th>
                            <td>{job.circuit_format}</td>
                        </tr>
                        {/* <tr>
                            <th>Executed Circuit:</th>
                            <td>{job.executed_circuit}</td>
                        </tr> */}
                        <tr>
                            <th>Executed Resource:</th>
                            <td>{job.executed_resource}</td>
                        </tr>
                        <tr>
                            <th>No Modify:</th>
                            <td>{job.no_modify}</td>
                        </tr>
                        <tr>
                            <th>Submitted Date:</th>
                            <td>{job.timestamp_submitted}</td>
                        </tr>
                        <tr>
                            <th>Scheduled Date:</th>
                            <td>{job.timestamp_scheduled}</td>
                        </tr>
                        <tr>
                            <th>Completed Date:</th>
                            <td>{job.timestamp_completed}</td>
                        </tr>
                        <tr>
                            <th>Cancelled Date:</th>
                            <td>{job.timestamp_cancelled}</td>
                        </tr>
                        <tr>
                            <th className="job_result">Result:</th>
                            <td className="job_result_value">
                                <button
                                    type="button"
                                    onClick={exportJobResult}
                                    className="result_download_link"
                                >
                                    Download Result
                                    <span className="download_icon"></span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            <div className="job_detail_container">
                <Table
                    responsive
                    bordered
                    striped
                    variant={`${darkmode ? "dark" : "light"} `}
                    className="mb-0 job_property"
                    style={{ fontSize: text_fs }}
                >
                    <tbody>
                        <tr>
                            <th>Cost:</th>
                            <td>{job.cost}</td>
                        </tr>
                        <tr>
                            <th>Budget:</th>
                            <td>{job.budget}</td>
                        </tr>
                        <tr>
                            <th>Target Specification:</th>
                            <td>{job.target_specification}</td>
                        </tr>
                        <tr>
                            <th>Token Usage:</th>
                            <td>{job.token_usage}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <div className="job_detail_actions mt-5">
                <Link
                    className=" job_detail_btn dashboard_btn back_btn"
                    to=".."
                    relative="path"
                    style={{ fontSize: text_fs }}
                >
                    &lt;&lt; Back
                </Link>
                <CSVLink
                    className=" job_detail_btn dashboard_btn export_btn"
                    style={{ fontSize: text_fs }}
                    data={exportJob}
                >
                    Export to .CSV
                </CSVLink>
            </div>
        </ContentCard>
    );
};

export default JobDetail;

export async function loader({ params }) {
    const access_token = getAuthToken();
    return queryClient.fetchQuery({
        queryKey: ["jobs", params.jobId],
        queryFn: ({ signal }) =>
            fetchJob({ signal, access_token, id: params.jobId }),
    });
}

//   const id = params.jobId;
//   // fetching to job

//   const jobs_url = process.env.REACT_APP_API_ENDPOINT + "/jobs/" + id ;
//   const response = await fetch(jobs_url, {
//     method: "GET",
//     headers: {
//       Authorization: "Bearer " + access_token,
//       "Content-Type": "application/json",
//     },
//   });
//   // console.log("jobs response:");
//   // console.log(response);

//   if (!response.ok) {
//     throw new Response(JSON.stringify({ message: "Could not fetch jobs!" }), {
//       status: response.status,
//     });
//   } else {
//     const resData = await response.json();
//     //console.log(resData);

//     return resData.job;
//   }
// }
