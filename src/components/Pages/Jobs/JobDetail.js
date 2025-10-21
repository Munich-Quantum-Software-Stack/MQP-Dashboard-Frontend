import React from "react";
import { useSelector } from "react-redux";
import {
    Link,
    useLoaderData,
} from "react-router-dom";
import Table from "react-bootstrap/Table";
import { getAuthToken } from "../../utils/auth";
import ContentCard from "../../UI/Card/ContentCard";

import { queryClient } from "../../utils/query";
import { fetchJob } from "../../utils/jobs-http";
import { formatTimestampGMT } from "../../utils/date-utils";


const JobDetail = () => {
    // Get job data loaded by the loader function
    const job = useLoaderData();
    
    // Get accessibility settings from Redux store
    const fs = useSelector((state) => state.accessibilities.font_size);
    const text_fs = +fs; 
    const page_header_fs = +fs * 1.5; 
    
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const darkmode_class = darkmode ? "dark_bg" : "white_bg";
    
    const exportJobResultAsJSON = () => {
        // Format the data as a proper JSON objec
        const formattedData = {
            "ID": job.id,
            "STATUS": job.status,
            "Note": job.note || job.status,
            "Shots count": job.shots || 0,
            "Circuit format": job.circuit_format || "unknown",
            "Executed Resource": job.executed_resource || job.target_specification || "",
            "Submitted Date": formatTimestampGMT(job.timestamp_submitted),
            "Scheduled Date": formatTimestampGMT(job.timestamp_scheduled),
            "Completed Date": formatTimestampGMT(job.timestamp_completed),
            "Cancelled Date": formatTimestampGMT(job.timestamp_cancelled),
            "Results": job.results || {} 
        };
        
        // Conbert to a proper JSON string with formatting for readability
        const jsonString = JSON.stringify(formattedData, null, 2);

        const link = document.createElement("a");
        let file = new Blob([jsonString], { type: "application/json" });
        link.href = URL.createObjectURL(file);
        link.download = "result-job-" + job.id + ".json";
        link.click();
    }
    
    const exportJobResultAsCSV = () => {
        // Create CSV rows for different data structures
        const csvContent = [];
        
        /**
         * Adds a section header to the CSV content
         * @param {string} title - The title for the section
         */
        const addSectionHeader = (title) => {
            csvContent.push(`"${title}"`);
            csvContent.push(''); // Empty row for spacing
        };

        /**
         * Processes an object and adds its key-value pairs to CSV content
         * @param {Object} obj - The object to process
         */
        const addObjectRows = (obj) => {
            Object.entries(obj).forEach(([key, value]) => {
                if (key === 'No_Modify') return;
                
                let formattedValue = value;
                if (typeof value === 'object' && value !== null) {
                    formattedValue = JSON.stringify(value);
                }
                csvContent.push(`"${key}","${formattedValue}"`);
            });
            csvContent.push(''); 
        };
        
        // Add job details section
        addSectionHeader("Job Details");
        addObjectRows({
            "ID": job.id,
            "STATUS": job.status,
            "Note": job.note || job.status,
            "Shots count": job.shots || 0,
            "Circuit format": job.circuit_format || "unknown",
            "Executed Resource": job.executed_resource || job.target_specification || "",
            "Submitted Date": formatTimestampGMT(job.timestamp_submitted),
            "Scheduled Date": formatTimestampGMT(job.timestamp_scheduled),
            "Completed Date": formatTimestampGMT(job.timestamp_completed),
            "Cancelled Date": formatTimestampGMT(job.timestamp_cancelled)
        });
        
        
        if (job.results) {
            addSectionHeader("Results");
            addObjectRows(job.results);
        }
        
        
        const csvString = csvContent.join('\n');
        const link = document.createElement("a");
        const file = new Blob([csvString], { type: "text/csv" });
        link.href = URL.createObjectURL(file);
        link.download = "result-job-" + job.id + ".csv";
        link.click();

    const tableRows = [
        { label: "ID:", value: job.id },
        { label: "Status:", value: job.status },
        { label: "Note:", value: job.note },
        { label: "Shots count:", value: job.shots },
        { label: "Circuit Format:", value: job.circuit_format },
        { label: "Executed Resource:", value: job.executed_resource || job.target_specification || "" },
        { label: "Submitted Date:", value: formatTimestampGMT(job.timestamp_submitted) },
        { label: "Scheduled Date:", value: formatTimestampGMT(job.timestamp_scheduled) },
        { label: "Completed Date:", value: formatTimestampGMT(job.timestamp_completed) },
        { label: "Cancelled Date:", value: formatTimestampGMT(job.timestamp_cancelled) },
        { 
            label: "Result:", 
            value: (
                <>
                    <button
                        type="button"
                        onClick={exportJobResultAsJSON}
                        style={{ 
                            backgroundColor: "#f8d052",
                            border: "none",
                            borderRadius: "4px",
                            padding: "6px 12px",
                            marginRight: "10px"
                        }}
                    >
                        Download Job Results in JSON
                    </button>
                    <button
                        type="button"
                        onClick={exportJobResultAsCSV}
                        style={{ 
                            backgroundColor: "#f8d052",
                            border: "none",
                            borderRadius: "4px",
                            padding: "6px 12px"
                        }}
                    >
                        Download Job Results in CSV
                    </button>
                </>
            )
        },
        { 
            label: "Submitted Circuit:", 
            value: (
                <Link to={`circuit`}>
                    Click here to view Submitted Circuit
                </Link>
            )
        },
        { 
            label: "Executed Circuit:", 
            value: (
                <Link to={`executed-circuit`}>
                    Click here to view Executed Circuit
                </Link>
            )
        },
        { label: "Cost:", value: job.cost },
        { label: "Budget:", value: job.budget },
        { label: "Target Specification:", value: job.target_specification },
        { label: "Token Usage:", value: job.token_usage }
    ];

    
    return (
        <ContentCard>
            {/* Page title with dynamic font size */}
            <h4 style={{ fontSize: page_header_fs }}>Detail of job {job.id}</h4>
            
            {/* Main content container with dark/light mode styling */}
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
                        {/* Map through the tableRows array to render each row */}
                        {tableRows.map((row, index) => (
                            <tr key={index}>
                                <th>{row.label}</th>
                                <td>{row.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Navigation section with back button */}
            <div className="job_detail_actions mt-5">
                <Link
                    className="job_detail_btn dashboard_btn back_btn"
                    to=".."
                    relative="path"
                    style={{ 
                        fontSize: text_fs, 
                        backgroundColor: '#f8d052',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '8px 20px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        textDecoration: 'none',
                        color: 'black'
                    }}
                >
                    &lt;&lt; Back
                </Link>
            </div>
        </ContentCard>
    );
};
}


export default JobDetail;

/**
 * Data loader function for the JobDetail component
 * This is called by React Router before rendering the component
 * 
 * @param {Object} params - URL parameters including jobId
 * @returns {Promise<Object>} - The job data object
 */
export async function loader({ params }) {
    // Get authentication token for API request
    const access_token = getAuthToken();
    
    // Fetch job data using React Query
    const job = await queryClient.fetchQuery({
        queryKey: ["jobs", params.jobId],
        queryFn: ({ signal }) =>
            fetchJob({ signal, access_token, id: params.jobId }),
    });
    
    if (job.no_modify !== undefined) delete job.no_modify;
    if (job.No_Modify !== undefined) delete job.No_Modify;
    if (job["No Modify"] !== undefined) delete job["No Modify"];
    
    return job;
}



