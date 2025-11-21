import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import JobsList from './JobsList';
import LoadingIndicator from 'src/components/UI/LoadingIndicator';
import ContentCard from 'src/components/UI/Card/ContentCard';
import JobsSorting from 'src/components/Pages/Jobs/JobsSorting';
import ErrorBlock from 'src/components/UI/MessageBox/ErrorBlock';
import { getAuthToken } from 'src/components/utils/auth';
import { queryFetchJobs } from 'src/components/utils/jobs-http';

import './Jobs.scss';

function Jobs() {
  const access_token = getAuthToken();
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const page_header_fs = +fs * 1.5;
  const [page, setPage] = useState(0);
  const limit = 20;

  const [sortKey, setSortKey] = useState('ID');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const getBackendSortKey = (key) => {
    switch (key) {
      case 'ID':
        return 'ID';
      case 'STATUS':
        return 'status';
      case 'DATE':
        return 'timestamp_submitted';
      default:
        return 'ID';
    }
  };

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['jobs', page, sortKey, sortOrder, statusFilter],
    queryFn: ({ signal }) =>
      queryFetchJobs({
        signal,
        access_token,
        page,
        limit,
        order: sortOrder,
        order_by: getBackendSortKey(sortKey),
        status: statusFilter,
      }),
    keepPreviousData: true,
    retry: 1,
    staleTime: 30000,
    onError: (err) => {
      console.error('Query error:', err);
    },
  });

  if (isError) {
    return (
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'} `}>
        <ErrorBlock title="Error loading jobs" message={error?.message || 'Unknown error'} />
      </ContentCard>
    );
  }

  let content;
  if (isPending) {
    content = (
      <div className="loading-container">
        <LoadingIndicator />
        <p>Loading data...</p>
      </div>
    );
  }

  if (data) {
    content = <JobsList jobs={data.jobs || []} />;
  }
  const totalJobs = data?.totalJobs || 0;
  const totalPages = Math.ceil(totalJobs / limit) || 1;

  const handlePreviousPage = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage((prev) => prev + 1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSorting = (key, order, status = 'ALL') => {
    setSortKey(key);
    setSortOrder(order);

    setStatusFilter(status);

    setPage(0);
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(0, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    if (startPage > 0) {
      pageNumbers.push(
        <button key={0} onClick={() => handlePageChange(0)} className={page === 0 ? 'active' : ''}>
          1
        </button>,
      );
      if (startPage > 1) {
        pageNumbers.push(<span key="ellipsis1">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button key={i} onClick={() => handlePageChange(i)} className={page === i ? 'active' : ''}>
          {i + 1}
        </button>,
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pageNumbers.push(<span key="ellipsis2">...</span>);
      }
      pageNumbers.push(
        <button
          key={totalPages - 1}
          onClick={() => handlePageChange(totalPages - 1)}
          className={page === totalPages - 1 ? 'active' : ''}
        >
          {totalPages}
        </button>,
      );
    }

    return pageNumbers;
  };

  return (
    <React.Fragment>
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'} h-100`}>
        <div className={`listJob_container`}>
          <div className="container_header_wrap">
            <h4 className="page_header" style={{ fontSize: page_header_fs }}>
              Your Jobs
            </h4>
          </div>

          <div className="sorting-section">
            <JobsSorting
              sortKey={sortKey}
              sortOrder={sortOrder}
              statusFilter={statusFilter}
              onSorting={handleSorting}
            />
          </div>

          {!isPending && (
            <div className="pagination_tray">
              <div className="pagination_info">
                {data?.jobs && data.jobs.length > 0 ? (
                  <>
                    Page {page + 1} of {totalPages || 1} • Showing {data.jobs.length || 0} of{' '}
                    {totalJobs} jobs
                  </>
                ) : (
                  <>No jobs found</>
                )}
              </div>

              {totalPages > 1 && (
                <div className="pagination_controls">
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 0}
                    className="pagination_button prev-button"
                  >
                    ← Previous
                  </button>

                  <div className="page-numbers">{renderPageNumbers()}</div>
                  <button
                    onClick={handleNextPage}
                    disabled={page >= totalPages - 1}
                    className="pagination_button next-button"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="jobs_content_container">{content}</div>
        </div>
      </ContentCard>
    </React.Fragment>
  );
}

export default Jobs;
