import { getAuthToken } from "src/components/utils/auth";
const access_token = getAuthToken();
// const transformResourced = tempResources.map((resource) => ({
//     id: resource.id,
//     resource: resource.resource,
//     budget_used: resource.budget_used,
//     allocation: resource.allocation,
//     used_color: resource.used_color,
//     remaining_color: resource.remaining_color,
// }));

export async function fetchBudgets() {
    const url = process.env.REACT_APP_API_ENDPOINT + "/budgets";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = new Error("Could not fetch budgets!");
        error.code = response.status;
        throw error;
    }
    const { budgets } = await response.json();
    console.log("responsed budgets:");
    console.log(budgets);
    return budgets;
}