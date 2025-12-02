/**
 * resources-http.js - HTTP utility for fetching quantum computing resources from the API
 */

// Fetch all available quantum resources with their status and specifications
export async function fetchResources({ signal, access_token }) {
  const url = process.env.REACT_APP_API_ENDPOINT + '/resources';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    // Extract error details from response body if available
    let errorMessage = 'Could not fetch resources!';
    let errorDetails;

    try {
      const errorBody = await response.json();
      if (errorBody && typeof errorBody.error_message === 'string') {
        errorDetails = errorBody.error_message;
      }
    } catch (parseError) {
      // Swallow JSON parsing issues and fallback to default error message.
    }

    const error = new Error(errorMessage);
    error.code = response.status;
    if (errorDetails) {
      error.details = errorDetails;
    }
    console.error('Resource request failed:', response);
    throw error;
  }

  const data = await response.json();

  return data;
}
