import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const JobListItem = (props) => {
    const navigate = useNavigate();
    const fs = useSelector((state) => state.accessibilities.font_size);
    const text_fs = +fs;

    const job = props.job;
    // console.log("job: ");
    // console.log(job);
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

    // convert timestamp to datetime
    const submitted_date = new Date(job.timestamp_submitted).toLocaleDateString("de-DE");
    const submitted_time = new Date(job.timestamp_submitted).toLocaleTimeString("de-DE");

    const jobDetailHandler = (id) => {
        //console.log(id);
        return navigate("/jobs/" + id);
    }
    return (
        <>
            <tr
                className="job_item_row job_item_detail"
                onClick={() => jobDetailHandler(job.id)}
                id={`${job.id}`}
            >
                <td className={`job_column job_view `}>
                    <span className="view_icon"></span>
                </td>
                <td
                    className={`job_column job_id `}
                    style={{ fontSize: text_fs }}
                >
                    {job.id}
                </td>
                <td
                    className={`job_column job_status ${status_bg}`}
                    style={{ fontSize: text_fs }}
                >
                    {job.status}
                </td>
                <td
                    className={`job_column job_shots`}
                    style={{ fontSize: text_fs }}
                >
                    {job.shots}
                </td>
                <td
                    className={`job_column job_submitted`}
                    style={{ fontSize: text_fs }}
                >
                    {submitted_date + " " + submitted_time}
                </td>
                <td
                    className={`job_column job_circuit_format `}
                    style={{ fontSize: text_fs }}
                >
                    {job.circuit_format}
                </td>
                <td
                    className={`job_column job_target `}
                    style={{ fontSize: text_fs }}
                >
                    {job.target_specification}
                </td>
                <td
                    className={`job_column job_note `}
                    style={{ fontSize: text_fs }}
                >
                    {job.note}
                </td>
            </tr>
            {/**
            <li className="job_item_row" id={`${job.id}`}>
                <Link to={`/jobs/${job.id}`}>
                    <div className={`job_column job_view `}>
                        <span className="view_icon"></span>
                    </div>
                    <div
                        className={`job_column job_id `}
                        style={{ fontSize: text_fs }}
                    >
                        {job.id}
                    </div>
                    <div
                        className={`job_column job_status ${status_bg}`}
                        style={{ fontSize: text_fs }}
                    >
                        {job.status}
                    </div>
                    <div
                        className={`job_column job_shots`}
                        style={{ fontSize: text_fs }}
                    >
                        {job.shots}
                    </div>
                    <div
                        className={`job_column job_submitted`}
                        style={{ fontSize: text_fs }}
                    >
                        {submitted_date + " " + submitted_time}
                    </div>
                    <div
                        className={`job_column job_circuit `}
                        style={{ fontSize: text_fs }}
                    >
                        Circuit Detail &gt;&gt;
                    </div>
                    <div
                        className={`job_column job_circuit_format `}
                        style={{ fontSize: text_fs }}
                    >
                        {job.circuit_format}
                    </div>
                    <div
                        className={`job_column job_target `}
                        style={{ fontSize: text_fs }}
                    >
                        {job.target_specification}
                    </div>
                    <div
                        className={`job_column job_note `}
                        style={{ fontSize: text_fs }}
                    >
                        {job.note}
                    </div>
                </Link>
            </li>
            */}
        </>
    );
};



export default JobListItem;
