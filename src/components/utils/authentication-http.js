export async function fetchLogin(authData) {
  // fetch API
  console.info('current server: ' + process.env.REACT_APP_API_ENDPOINT);
  const login_url = process.env.REACT_APP_API_ENDPOINT + '/login';
  const response = await fetch(login_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });
  if (!response.ok) {
    const error = new Error();
    if (response.status === 401) {
      error.message = 'Authentication failed.';
    } else {
      error.message = 'Internal Server Error! Please try again later.';
    }

    throw error;
  }
  const resData = await response.json();
  return resData;
}
