import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatTimestampGMT } from "src/components/utils/date-utils";

const JobListItem = (props) => {
    const navigate = useNavigate();
    const fs = useSelector((state) => state.accessibilities.font_size);
    const text_fs = +fs;

    const job = props.job;
    
    let status_bg = "";
    if (job.status === "RUNNING") {
        status_bg = "running_bg";
    }
    if (job.status === "PENDING" || job.status === "WAITING") {
        status_bg = "pending_bg";
    }
    if (job.status === "CANCELLED") {
        status_bg = "canceled_bg";
    }
    if (job.status === "COMPLETED") {
        status_bg = "complete_bg";
    }

    const formattedSubmissionDate = formatTimestampGMT(job.timestamp_submitted, false);

    const jobDetailHandler = (id) => {        
        return navigate("/jobs/" + id); 
    };
    const cancelJobHandler = async (event) => {
        event.stopPropagation();
        const confirmCancel = window.confirm(`Are you sure you want to cancel Job ID: ${job.id}?`);
        if (!confirmCancel) return;
        try {
            const response = await fetch(`/api/jobs/${job.id}/cancel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                alert(`Cancelled Job ID: ${job.id}`);
            } else {
                const errorData = await response.json();
                alert(`Failed to cancel Job ID: ${job.id}. Error: ${errorData.message}`);
            }
        } catch (error) {
            alert(`Error canceling Job ID: ${job.id}. Please try again.`);
        }
    };

    const keyboardJobDetailHandler = (event) => {
        if (
            event.key === "Enter" ||
            event.key === " " ||
            event.key === "Spacebar"
        ) {
            jobDetailHandler(event.target.id);
        }
    };

    return (
        <tr
            className="job_item_row job_item_detail"
            onClick={() => jobDetailHandler(job.id)}
            onKeyDown={keyboardJobDetailHandler}
            id={`${job.id}`}
            tabIndex="0"
        >
            <td className={`job_column job_view `}>
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
                {formattedSubmissionDate}
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
        
            <td className="job_column job_actions">
                <button
                    className="cancel-job-button"
                    onClick={cancelJobHandler}
                    style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Cancel Job
                </button>
            </td>
        </tr>
    );
};

export default JobListItem;