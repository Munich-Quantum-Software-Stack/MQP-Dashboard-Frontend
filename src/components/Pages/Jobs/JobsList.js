import React from 'react';
import { useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import BlankCard from '@components/UI/Card/BlankCard';
import JobListItem from '@components/Pages/Jobs/JobListItem';

/**
 * JobsList - Renders a table of jobs or empty state message when no jobs exist
 */
function JobsList({ jobs }) {
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const text_fs = +fs;

  const jobsArray = Array.isArray(jobs) ? jobs : [];

  return (
    <React.Fragment>
      {/* Show empty state or jobs table based on data availability */}
      {!jobsArray || jobsArray.length === 0 ? (
        <BlankCard className={`${darkmode ? 'dark_bg' : 'white_bg'} h-100`}>
          <h5>No Job found.</h5>
        </BlankCard>
      ) : (
        <Table
          responsive
          bordered
          striped
          hover
          variant={`${darkmode ? 'dark' : 'light'} `}
          className="jobsList_table"
        >
          {/* Table header with column labels */}
          <thead>
            <tr
              className="job_item_row job_row_header"
              key="job_header"
              style={{ fontSize: text_fs }}
            >
              <td className={`job_column job_view`}></td>
              <td className="job_column job_id">ID</td>
              <td className="job_column job_status">Status</td>
              <td className="job_column job_shots">Shots</td>
              <td className="job_column job_submitted">Submitted</td>
              <td className="job_column job_circuit_format">Circuit Format</td>
              <td className="job_column job_target">Target Specification</td>
              <td className="job_column job_note">Note</td>
              <td className="job_column job_actions">Actions</td>
            </tr>
          </thead>
          {/* Render each job as a clickable row */}
          <tbody>
            {jobsArray.map((job) => (
              <JobListItem key={job.id} job={job} />
            ))}
          </tbody>
        </Table>
      )}
    </React.Fragment>
  );
}

export default JobsList;
