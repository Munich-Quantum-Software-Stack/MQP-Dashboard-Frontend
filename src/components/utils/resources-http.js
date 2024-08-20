

export async function fetchResources({ signal, access_token }) {
    const url = process.env.REACT_APP_API_ENDPOINT + "/resources";
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
        const error = new Error("Could not fetch resources!");
        error.code = response.status;
        error.message = response.error_message;
        console.log("responsed resources:");
        console.log(resources);
        throw error;
    }
    const { resources, available_resources } =
        await response.json();
    //console.log("responsed resources:");
    //console.log(resources);
    return { resources, available_resources };
}
