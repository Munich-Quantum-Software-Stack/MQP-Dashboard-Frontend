
export async function fetchJobs({ signal, access_token }) {
    // console.log("token: ");
    // console.log(access_token);
    const url = process.env.REACT_APP_API_ENDPOINT + "/jobs";
    const response = await fetch(
        url,
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + access_token,
                "Content-Type": "application/json",
            },
        },
        { signal }
    );

    if (!response.ok) {
        const error = new Error("Could not fetch jobs!");
        error.code = response.status;
        throw error;
    }
    const {jobs} = await response.json();
    // console.log("responsed jobs:");
    // console.log(jobs);
    return jobs;
    
}


export async function fetchJob({ signal, access_token, id }) {
    const url = process.env.REACT_APP_API_ENDPOINT + "/jobs/" + id;
    const response = await fetch(
        url,
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + access_token,
                "Content-Type": "application/json",
            },
        },
        { signal }
    );

    if (!response.ok) {
        const error = new Error("Could not fetch job!");
        error.code = response.status;
        throw error;
    }
    const { job } = await response.json();
    // console.log("responsed jobs:");
    // console.log(jobs);
    return job;
}