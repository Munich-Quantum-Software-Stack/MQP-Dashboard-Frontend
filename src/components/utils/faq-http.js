import axios from "axios";

export async function queryFetchFAQs({ signal, access_token }) {
    const response = await axios.get("/api/faqs", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        signal,
    });
    return response.data;
}