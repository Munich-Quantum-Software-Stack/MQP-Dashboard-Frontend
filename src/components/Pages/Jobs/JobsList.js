import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Pagination from "react-bootstrap/Pagination";
import JobListItem from "./JobIListtem";
import Table from "react-bootstrap/Table";
import BlankCard from "../../UI/Card/BlankCard";
import JobsSorting from "./JobsSorting";
import { sortingJobs } from "../../utils/jobs";
//import JobsFilter from "./JobsFilter";

function JobsList({ jobs }) {
    // console.log("jobs:");
    // console.log(jobs);
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const text_fs = +fs;

    const NB_JOBS_PER_PAGE = 20;
    // current page of pagination
    const [currentPage, setCurrentPage] = useState(1);
    // jobItems per page
    const [jobItems, setJobItems] = useState([]);

    // sortedJobs list
    const [sortItems, setSortItems] = useState({
        sortKey: "id",
        sortOrder: "desc",
    });
    const [sortedJobs, setSortedJobs] = useState(jobs);

    let total_page = Math.ceil(jobs.length / NB_JOBS_PER_PAGE);
    let pageItems = [];
    for (let number = 1; number <= total_page; number++) {
        pageItems.push(number);
    }

    // cut jobs list into number of jobs per page
    useEffect(() => {
        // sorting jobs list by sortItem
        let newSortedJobs = sortingJobs(sortItems, jobs);
        setSortedJobs((prevJobs) => {
            return { ...prevJobs, newSortedJobs };
        });
        // update jobItems per page
        const jobsListPerPage = newSortedJobs.slice(
            (currentPage - 1) * NB_JOBS_PER_PAGE,
            currentPage * NB_JOBS_PER_PAGE
        );
        setJobItems(jobsListPerPage);
    }, [currentPage, sortItems, jobs]);

    const pageHandler = (pageItem) => {
        const pageNb = parseInt(pageItem.target.innerText);
        setCurrentPage(pageNb);
    };

    const prevPageHandler = () => {
        setCurrentPage(currentPage - 1);
    };

    const nextPageHandler = () => {
        setCurrentPage(currentPage + 1);
    };

    const sortingJobsHandler = (inputSortKey, inputSortOrder) => {
        setSortItems((prevItems) => {
            return { ...prevItems, 
                sortKey: inputSortKey,
                sortOrder: inputSortOrder
            };
        });
    };

    return (
        <React.Fragment>
            {jobs.length === 0 && (
                <BlankCard
                    className={`${darkmode ? "dark_bg" : "white_bg"} h-100`}
                >
                    <h5>No Job found.</h5>
                </BlankCard>
            )}
            {jobs.length > 0 && (
                <>
                    <div className="jobs_actions">
                        {/* <JobsFilter /> */}
                        <JobsSorting onSorting={sortingJobsHandler} />
                    </div>
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

                    <Table
                        responsive
                        bordered
                        striped
                        hover
                        variant={`${darkmode ? "dark" : "light"} `}
                        className="jobsList_table"
                    >
                        <thead className="">
                            <tr
                                className="job_item_row job_row_header"
                                key="job_header"
                                style={{ fontSize: text_fs }}
                            >
                                <td className={`job_column job_view`}></td>
                                <td className="job_column job_id">ID</td>
                                <td className="job_column job_status">
                                    Status
                                </td>
                                <td className="job_column job_shots">Shots</td>
                                <td className="job_column job_submitted">
                                    Submitted
                                </td>
                                <td className="job_column job_circuit_format">
                                    Circuit Format
                                </td>
                                <td className="job_column job_target">
                                    Target Specification
                                </td>
                                <td className="job_column job_note">Note</td>
                            </tr>
                        </thead>
                        <tbody>
                            {jobItems.map((job) => (
                                <JobListItem key={job.id} job={job} />
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
        </React.Fragment>
    );
}

export default JobsList;
