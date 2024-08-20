
// fetch jobs by sending HTTP request
export async function fetchJobs(access_token) {
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
        }
    );

    if (!response.ok) {
        const error = new Error("Could not fetch jobs!");
        if (response.status === 401) {
            error.message = "Unauthorized!";
        }
        if (response.status === 403) {
            error.message = "Forbidden!";
        }
        error.code = response.status;
        //error.message = response.error_message;
        console.log("Response: ");
        console.log(response);
        throw error;
    }
    const {jobs} = await response.json();
    return jobs;
    
}


// fetch jobs by useQuery()
export async function queryFetchJobs({ signal, access_token }) {
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
        error.message = response.error_message;
        console.log("Response: ");
        console.log(response);
        throw error;
    }
    const {jobs} = await response.json();
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