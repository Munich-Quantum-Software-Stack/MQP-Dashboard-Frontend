// fetch jobs by sending HTTP request
export async function fetchJobs(access_token) {
  // console.log("token: ");
  // console.log(access_token);
  const url = process.env.REACT_APP_API_ENDPOINT + '/jobs';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error('Could not fetch jobs!');
    if (response.status === 401) {
      error.message = 'Unauthorized!';
    }
    if (response.status === 403) {
      error.message = 'Forbidden!';
    }
    error.code = response.status;
    //error.message = response.error_message;
    console.log('Response: ');
    console.log(response);
    throw error;
  }
  const { jobs } = await response.json();
  return jobs;
}

// fetch jobs by useQuery()
export async function queryFetchJobs({
  signal,
  access_token,
  page = 0,
  limit = 20,
  order = 'DESC',
  order_by = 'ID',
  status,
}) {
  // Build query parameters
  const params = new URLSearchParams();
  params.append('p', page);
  params.append('jpp', limit);
  params.append('order', order);

  // Special handling for ID sorting
  if (order_by === 'ID') {
    params.append('order_by', 'ID');
  } else {
    params.append('order_by', order_by);
  }

  if (status && status !== 'ALL') {
    params.append('filter', status);
  }

  const url = `${process.env.REACT_APP_API_ENDPOINT}/jobs?${params.toString()}`;
  console.log('Fetching jobs with URL:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    const error = new Error('Could not fetch jobs!');
    error.code = response.status;
    error.message = response.error_message;
    console.log('Response error:', response);
    throw error;
  }

  const data = await response.json();
  console.log('API response:', data);

  // Perform client-side numerical sorting for ID if needed
  if (order_by === 'ID' && data.jobs && data.jobs.length > 0) {
    console.log('Performing client-side numerical ID sorting');

    // Sort by ID numerically
    data.jobs.sort((a, b) => {
      const idA = parseInt(a.id, 10);
      const idB = parseInt(b.id, 10);

      if (isNaN(idA) || isNaN(idB)) {
        // Fallback to string comparison if parsing fails
        return order === 'ASC'
          ? String(a.id).localeCompare(String(b.id))
          : String(b.id).localeCompare(String(a.id));
      }

      return order === 'ASC' ? idA - idB : idB - idA;
    });
  }

  return {
    jobs: data.jobs || [],
    totalJobs: data.totaljob_nr || 0,
  };
}

export async function fetchJob({ signal, access_token, id }) {
  const url = process.env.REACT_APP_API_ENDPOINT + '/jobs/' + id;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    const error = new Error('Could not fetch job!');
    error.code = response.status;
    throw error;
  }
  const { job } = await response.json();
  if (!job.circuit) {
    job.circuit =
      'OPENQASM 2.0;\ninclude "qelib1.inc";\n\nqreg q[2];\ncreg c[2];\n\nh q[0];\ncx q[0],q[1];\nmeasure q[0] -> c[0];\nmeasure q[1] -> c[1];';
  }

  if (!job.executed_circuit) {
    job.executed_circuit = job.circuit;
  }

  // Remove the No Modify field
  if (job.no_modify !== undefined) {
    delete job.no_modify;
  }
  if (job.No_Modify !== undefined) {
    delete job.No_Modify;
  }
  if (job['No Modify'] !== undefined) {
    delete job['No Modify'];
  }

  return job;
}
