import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./JobListItem.scss";

const JobListItem = (props) => {
    const navigate = useNavigate();
    const fs = useSelector((state) => state.accessibilities.font_size);
    const text_fs = +fs;

    const job = props.job;

    let status_bg = "";

    // Determine the background class based on job status
    if (job.status === "RUNNING") {
        status_bg = "running_bg";
    } else if (job.status === "PENDING" || job.status === "WAITING") {
        status_bg = "pending_bg";
    } else if (job.status === "CANCELLED") {
        status_bg = "canceled_bg";
    } else if (job.status === "COMPLETED") {
        status_bg = "complete_bg";
    }

    // Convert timestamp to readable date and time
    const submitted_date = new Date(job.timestamp_submitted).toLocaleDateString("de-DE");
    const submitted_time = new Date(job.timestamp_submitted).toLocaleTimeString("de-DE");

    // Navigate to job details page
    const jobDetailHandler = (id) => {
        navigate("/jobs/" + id);
    };

    // Handle keyboard navigation for job details
    const keyboardJobDetailHandler = (event) => {
        if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
            jobDetailHandler(event.target.id);
        }
    };

    // Handle cancel job button click
    const cancelJobHandler = () => {
        alert(`Cancel Job button clicked for Job ID: ${job.id}`);
    };

    // Handle CSV download
    const downloadCSVHandler = () => {
        const csvContent = `data:text/csv;charset=utf-8,${Object.keys(job)
            .map((key) => `"${key}"`)
            .join(",")}\n${Object.values(job)
            .map((value) => `"${value}"`)
            .join(",")}`;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${job.id}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <tr
            className="job_item_row job_item_detail"
            onClick={() => jobDetailHandler(job.id)}
            onKeyDown={keyboardJobDetailHandler}
            id={`${job.id}`}
            tabIndex="0"
        >
            <td className={`job_column job_view`}>
                <span className="view_icon"></span>
            </td>
            <td className={`job_column job_id`} style={{ fontSize: text_fs }}>
                {job.id}
            </td>
            <td className={`job_column job_status ${status_bg}`} style={{ fontSize: text_fs }}>
                {job.status}
            </td>
            <td className={`job_column job_shots`} style={{ fontSize: text_fs }}>
                {job.shots}
            </td>
            <td className={`job_column job_submitted`} style={{ fontSize: text_fs }}>
                {submitted_date + " " + submitted_time}
            </td>
            <td className={`job_column job_circuit_format`} style={{ fontSize: text_fs }}>
                {job.circuit_format}
            </td>
            <td className={`job_column job_target`} style={{ fontSize: text_fs }}>
                {job.target_specification}
            </td>
            <td className={`job_column job_note`} style={{ fontSize: text_fs }}>
                {job.note}
            </td>
            <td>
                <button className="download-csv-button" onClick={downloadCSVHandler}>
                    Download CSV
                </button>
            </td>
            <td>
                <button className="cancel-job-button" onClick={cancelJobHandler}>
                    Cancel Job
                </button>
            </td>
        </tr>
    );
};

export default JobListItem;