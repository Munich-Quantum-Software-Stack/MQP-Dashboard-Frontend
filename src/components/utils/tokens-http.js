/**
 * tokens-http.js - HTTP utilities for managing API tokens (create, fetch, revoke)
 */

// Fetch user's token creation limits (max tokens allowed)
export async function fetchUserLimits({ signal, access_token }) {
  const fetch_url = process.env.REACT_APP_API_ENDPOINT + '/tokens/user_limits';
  const response = await fetch(fetch_url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    const error = new Error('Could not fetch user limits!');
    error.code = response.status;
    throw error;
  } else {
    const data = await response.json();
    return data;
  }
}

// Fetch all API tokens for the authenticated user
export async function fetchTokens({ signal, access_token }) {
  const url = process.env.REACT_APP_API_ENDPOINT + '/tokens';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    signal,
  });
  if (!response.ok) {
    const error = new Error('Could not fetch tokens.');
    error.code = response.status;
    throw error;
  }

  const { tokens } = await response.json();
  return tokens;
}

// Create a new API token with the given name and expiration
export async function createNewToken({ tokenData, access_token }) {
  const url = process.env.REACT_APP_API_ENDPOINT + '/tokens/new';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tokenData),
  });
  if (!response.ok) {
    console.error('Token creation failed:', response);
    const error = new Error();
    if (response.status === 403) {
      error.message = 'Token Name is invalid. Please try another one.';
    } else {
      error.message = 'Could not create new token due to internal error.';
    }

    throw error;
  }

  const { token_data } = await response.json();
  return token_data;
}

// Revoke/delete an existing API token by name
export async function revokeToken({ tokenName, access_token }) {
  const url = process.env.REACT_APP_API_ENDPOINT + '/tokens';
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token_name: tokenName }),
  });
  if (!response.ok) {
    const resData = await response.json();
    const error = new Error(JSON.stringify(resData.error_message));
    error.code = response.status;
    throw error;
  }
  const { message } = await response.json();
  return message;
}
