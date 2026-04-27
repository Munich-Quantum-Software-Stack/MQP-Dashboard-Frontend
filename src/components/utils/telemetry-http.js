/**
 * telemetry-http.js - HTTP utility for fetching telemetry data through QDMI Deamon
 */


export async function fetchSensors({signal, access_token}) {
    //const url = process.env.REACT_APP_API_ENDPOINT + '/telemetry/sensors';
    const url = 'http://127.0.0.1:5000/telemetry/sensors';
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        },
        signal,
    });

    if (!response || !response.ok ) {
        // Extract error details from response body if available
        let errorMessage = 'Could not fetch measurement data!';
        const error = new Error(errorMessage);
        error.code = response.status;
        throw error;
    }
    const data = await response.json();
    // console.log("sensors data:");
    // console.log(data);
    return data;
}

export async function fetchTelemetryData({ access_token, telemetryFormData }) {
    // console.log("telemetryFormData");
    // console.log(telemetryFormData);

    //const url = process.env.REACT_APP_API_ENDPOINT + '/telemetry';
    const url = 'http://127.0.0.1:5000/telemetry';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(telemetryFormData)
    });
    
    if (!response.ok ) {
        // Extract error details from response body if available
        let errorMessage = 'An error occurs! Could not fetch telemetry data!';

        const error = new Error(errorMessage);
        error.code = response.status;

        console.error('Telemetry request failed:', response);
        throw error;
    }

    
    const data = await response.json();
    // console.log("telemetry data:");
    // console.log(data);
    return data;
}




export async function downloadTelemetryData({formData, access_token}) {
    // console.log("download form data:");
    // console.log(formData);
    //const url = process.env.REACT_APP_API_ENDPOINT + '/telemetry/download';
    const url = 'http://127.0.0.1:5000/telemetry/download';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    if (!response || !response.ok ) {
        // Extract error details from response body if available
        let errorMessage = 'Could not download data!';
        const error = new Error(errorMessage);
        error.code = response.status;
        throw error;
    }
    const blob = await response.blob();
    return blob;
}