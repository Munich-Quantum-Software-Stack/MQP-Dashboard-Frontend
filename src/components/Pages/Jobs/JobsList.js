import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Pagination from "react-bootstrap/Pagination";
import JobListItem from "./JobIListtem";


function JobsList({ jobs }) {
    const fs = useSelector((state) => state.accessibilities.font_size);
    const text_fs = +fs;

    const nbJobsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    //const [nbJobsPerPage, setNbJobsPerPage] = useState(3);
    const [jobItems, setJobItems] = useState([]);
    const total_page = Math.ceil(jobs.length / nbJobsPerPage);
    let pageItems = [];
    for (let number = 1; number <= total_page; number++) {
        pageItems.push(number);
    }

    useEffect(() => {
        const jobsListPerPage = jobs.slice(
            (currentPage - 1) * nbJobsPerPage,
            currentPage * nbJobsPerPage
        );
        setJobItems(jobsListPerPage);
    }, [currentPage, jobs]);

    const pageHandler = (pageItem) => {
        const pageNb = parseInt(pageItem.target.innerText);
        setCurrentPage(pageNb);
    }

    const prevPageHandler = () => {
        setCurrentPage(currentPage - 1);
     }

    const nextPageHandler = () => { 
        setCurrentPage(currentPage + 1);
    }
    
    return (
        <React.Fragment>
            <div className="d-flex flex-col gap-5">
                {total_page > 1 && (
                    <Pagination>
                        <Pagination.First
                            disabled={currentPage === 1}
                            onClick={prevPageHandler}
                        />
                        {pageItems.map((page) => (
                            <Pagination.Item
                                key={page}
                                active={page === currentPage}
                                onClick={pageHandler}
                            >
                                {page}
                            </Pagination.Item>
                        ))}
                        <Pagination.Last
                            disabled={currentPage === total_page}
                            onClick={nextPageHandler}
                        />
                    </Pagination>
                )}
            </div>

            <div className="jobsList_wrap_fix">
                <div className="jobsList_wrap_auto">
                    <ul className=" jobsList">
                        <li
                            className="job_item_row job_row_header"
                            key="job_header"
                            style={{ fontSize: text_fs }}
                        >
                            <div className={`job_column job_view`}></div>
                            <div className="job_column job_id">ID</div>
                            <div className="job_column job_status">Status</div>
                            <div className="job_column job_shots">Shots</div>
                            <div className="job_column job_circuit">
                                Circuit
                            </div>
                            <div className="job_column job_circuit_format">
                                Circuit Format
                            </div>
                            <div className="job_column job_target">
                                Target Specification
                            </div>
                            <div className="job_column job_note">Note</div>
                        </li>

                        {jobItems.map((job) => (
                            <JobListItem key={job.id} job={job} />
                        ))}
                    </ul>
                </div>
            </div>
        </React.Fragment>
    );
}

export default JobsList;
