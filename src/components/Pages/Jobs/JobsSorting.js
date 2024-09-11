import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";

const JobsSorting = (props) => {
    const [sortKey, setSortKey] = useState("id");
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        props.onSorting(sortKey, sortOrder);
    }, [sortKey, sortOrder]);

    const selectSortKeyChangeHandler = (event) => {
        setSortKey(event.target.value);
    };

    const selectSortOrderChangeHandler = (event) => {
        setSortOrder(event.target.value);
    };

    return (
        <div className="action_container sorting_container">
            <div className="sorting_items_wrap">
                <Form.Label>Sorting by:</Form.Label>
                <Form.Select
                    aria-label="Sorting Items"
                    className="sorting_item_input"
                    value={sortKey}
                    onChange={selectSortKeyChangeHandler}
                >
                    <option value="id">ID</option>
                    {/* <option value="status">Status</option> */}
                    <option value="date">Date</option>
                </Form.Select>
                <Form.Select
                    aria-label="Sorting Order"
                    className="sorting_order_input"
                    value={sortOrder}
                    onChange={selectSortOrderChangeHandler}
                >
                    <option value="desc">DESC</option>
                    <option value="asc">ASC</option>
                </Form.Select>
            </div>
        </div>
    );
};

export default JobsSorting;
