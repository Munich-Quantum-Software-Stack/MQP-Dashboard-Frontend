import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { getAuthToken } from "src/components/utils/auth";
import ContentCard from "src/components/UI/Card/ContentCard";
import { queryClient } from "src/components/utils/query";
import { fetchJob } from "src/components/utils/jobs-http";

const JobCircuit = ({ isExecutedCircuit = false }) => {
    const job = useLoaderData();
    const params = useParams();
    const fs = useSelector((state) => state.accessibilities.font_size);
    const text_fs = +fs;
    const page_header_fs = +fs * 1.5;
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const darkmode_class = darkmode ? "dark_bg" : "white_bg";
    
    const [circuit, setCircuit] = useState("");
    
    useEffect(() => {
        if (job) {
            if (isExecutedCircuit) {
                setCircuit(job.executed_circuit || "No executed circuit available");
            } else {
                setCircuit(job.circuit || "No submitted circuit available");
            }
        }
    }, [job, isExecutedCircuit]);

    return (
        <ContentCard>
            <h4 style={{ fontSize: page_header_fs }}>
                {isExecutedCircuit ? "Executed Circuit" : "Submitted Circuit"} for Job {params.jobId}
            </h4>
            <div className={`${darkmode_class}`} style={{ margin: "2rem 0" }}>
                <div 
                    style={{ 
                        border: "2px solid #ddd", 
                        borderRadius: "4px", 
                        padding: "15px", 
                        backgroundColor: darkmode ? "#222" : "#f8f9fa",
                        overflow: "auto",
                        maxHeight: "500px"
                    }}
                >
                    <pre 
                        style={{ 
                            fontSize: text_fs,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word"
                        }}
                    >
                        {circuit}
                    </pre>
                </div>
            </div>

            <div className="mt-4">
                <Link
                    className="job_detail_btn dashboard_btn back_btn"
                    to={`/jobs/${params.jobId}`}
                    style={{ fontSize: text_fs, marginRight: "1rem" }}
                >
                    &lt;&lt; Back to Job Details
                </Link>
            </div>
        </ContentCard>
    );
};

export default JobCircuit;

export async function loader({ params }) {
    const access_token = getAuthToken();
    return queryClient.fetchQuery({
        queryKey: ["jobs", params.jobId],
        queryFn: ({ signal }) =>
            fetchJob({ signal, access_token, id: params.jobId }),
    });
}
