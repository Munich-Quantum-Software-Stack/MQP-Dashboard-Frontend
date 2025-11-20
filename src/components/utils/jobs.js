// sorting by ID
function sortingJobsByID(jobs, sortOrder) {
  let sortedJobs = [...jobs];
  // ascending
  if (sortOrder === 'asc') {
    sortedJobs = sortedJobs.sort((job_1, job_2) => job_1.id - job_2.id);
  }
  // descending
  else {
    sortedJobs = jobs.sort((job_1, job_2) => job_2.id - job_1.id);
  }
  return sortedJobs;
}

// sorting by datetime
function sortingJobsByDate(jobs, sortOrder) {
  let sortedJobs = [...jobs];
  // ascending
  if (sortOrder === 'asc') {
    sortedJobs = jobs.sort(
      (job_1, job_2) =>
        new Date(job_1.timestamp_submitted).getTime() -
        new Date(job_2.timestamp_submitted).getTime(),
    );
  }
  // descending
  else {
    //sortedJobs = sortedJobs.reverse();
    sortedJobs = jobs.sort(
      (job_1, job_2) =>
        new Date(job_2.timestamp_submitted).getTime() -
        new Date(job_1.timestamp_submitted).getTime(),
    );
  }
  return sortedJobs;
}

export function sortingJobs(sortItems, jobs) {
  let sortedJobs;
  if (sortItems.sortKey.trim() === 'id') {
    sortedJobs = sortingJobsByID(jobs, sortItems.sortOrder);
  }
  if (sortItems.sortKey.trim() === 'date') {
    sortedJobs = sortingJobsByDate(jobs, sortItems.sortOrder);
  }

  return sortedJobs;
}
