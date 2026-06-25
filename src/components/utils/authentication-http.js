/**
 * authentication-http.js - HTTP utility for user login authentication
 */

// Authenticate user credentials and return access token on success
export async function fetchLogin(authData) {
  console.info('current server: ' + process.env.REACT_APP_API_ENDPOINT);
  const login_url = process.env.REACT_APP_API_ENDPOINT + '/login';
  let response;
  try {
    response = await fetch(login_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authData),
    });
  } catch (networkError) {
    const error = new Error('Cannot reach authentication service. Please check your network/VPN.');
    throw error;
  }

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
