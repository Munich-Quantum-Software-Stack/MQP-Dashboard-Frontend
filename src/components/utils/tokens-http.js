

export async function fetchUserLimits({ signal, access_token }) {
    const fetch_url =
        process.env.REACT_APP_API_ENDPOINT + "/tokens/user_limits";
    const response = await fetch(
        fetch_url,
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + access_token,
                "Content-Type": "application/json",
            },
        },
        {signal}
    );

    if (!response.ok) {
        const error = new Error("Could not fetch user limits!");
        error.code = response.status;
        throw error;
    } else {
        const data = await response.json();
        // console.log("responsed user limits:");
        // console.log(data);
        return data;
    }
}

export async function fetchTokens({ signal, access_token }) {
    const url = process.env.REACT_APP_API_ENDPOINT + "/tokens";
    // console.log("access token: ");
    // console.log(access_token);
    const response = await fetch(
        url,
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + access_token,
                "Content-Type": "application/json",
            },
        },
        {signal}
    );
    // console.log("response: ");
    // console.log(response);
    if (!response.ok) {
        const error = new Error("Could not fetch tokens.");
        error.code = response.status;
        throw error;
    }

    const { tokens } = await response.json();
    // console.log("responsed tokens:");
    // console.log(tokens);
    return tokens;
}


export async function createNewToken({ tokenData, access_token }) {

    const url = process.env.REACT_APP_API_ENDPOINT + "/tokens/new";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tokenData),
    });
    console.log("response:");
    console.log(response);
    
    if (!response.ok) {
        const error = new Error();
        if (response.status === 403) {
            error.message = "Token Name is invalid. Please try another one.";
        }
        else {
            error.message = "Could not create new token due to internal error.";
        }        
        
        throw error;
    }

    const { token_data } = await response.json();
    // console.log("responsed tokens:");
    // console.log(token_data);
    return token_data;
}

export async function revokeToken({ tokenName, access_token }) {

    const url = process.env.REACT_APP_API_ENDPOINT + "/tokens";
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token_name: tokenName }),
    });
    // console.log("response:");
    // console.log(response);
    if (!response.ok) {
        const resData = await response.json();
        //const error = new Error("Could not revoke token");
        const error = new Error(JSON.stringify(resData.error_message));
        error.code = response.status;
        throw error;
    }
    const { message } = await response.json();
    return message;
}


