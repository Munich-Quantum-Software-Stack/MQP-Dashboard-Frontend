export function sortingJobsByID(jobs) {
    let sortedJobs = jobs.sort(
        (job_1, job_2) => job_1.id - job_2.id
    );

    return sortedJobs;
}