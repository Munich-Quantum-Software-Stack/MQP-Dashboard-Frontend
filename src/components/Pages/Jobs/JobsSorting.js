import React from "react";
import Form from "react-bootstrap/Form";

const STATUS_OPTIONS = [
    { value: "ALL", label: "All" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "COMPLETED", label: "Completed" },
    { value: "SUBMITTED", label: "Submitted" }
];

const JobsSorting = ({ sortKey = "ID", sortOrder = "DESC", statusFilter = "ALL", onSorting }) => {

    const handleKeyChange = (e) => {
        const newKey = (e.target.value || "ID").toUpperCase();
        
        if (newKey === "STATUS") {
            onSorting(newKey, "DESC", "SUBMITTED");
        } else {
            onSorting(newKey, sortOrder, "ALL");
        }
    };
    
    const handleOrderChange = (e) => {
        const newOrder = e.target.value || "DESC";
        console.log("Order changed to:", newOrder);
        onSorting(sortKey, newOrder, statusFilter);
    };
    
    const handleStatusChange = (e) => {
        const newFilter = e.target.value || "ALL";
        onSorting(sortKey, sortOrder, newFilter);
    };

    return (
        <div className="action_container sorting_container">
            <div className="sorting_items_wrap" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Form.Label style={{ marginBottom: 0, whiteSpace: "nowrap" }}>Sorting by:</Form.Label>
                <Form.Select aria-label="Sorting Items" value={sortKey} onChange={handleKeyChange} style={{ width: "160px" }}>
                    <option value="ID">ID</option>
                    <option value="STATUS">Status</option>
                    <option value="DATE">Date</option>
                </Form.Select>

                {(sortKey === "ID" || sortKey === "DATE") && (
                    <Form.Select aria-label="Sorting Order" value={sortOrder} onChange={handleOrderChange} style={{ width: "140px" }}>
                        <option value="DESC">Descending</option>
                        <option value="ASC">Ascending</option>
                    </Form.Select>
                )}

                {sortKey === "STATUS" && (
                    <>
                        <Form.Label style={{ marginBottom: 0, whiteSpace: "nowrap", marginLeft: "0.5rem" }}>Filter:</Form.Label>
                        <Form.Select aria-label="Status Filter" value={statusFilter} onChange={handleStatusChange} style={{ minWidth: "160px" }}>
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>
                    </>
                )}
            </div>
        </div>
    );
};

export default JobsSorting;