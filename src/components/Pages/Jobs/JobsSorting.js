import React, { useState } from "react";


const JobsSorting = (props) => {
    const [sortItem, setSortItem] = useState('id');
    const selectSortItemHandler = (event) => {
        setSortItem(event.target.value);
        props.onSorting(event.target.value);
    }
    return (
        <div className="action_container sorting_container">
            <label>Sorting by:</label>
        <select
          className="form-control sorting_input"
          onSelect={selectSortItemHandler}
          selected={sortItem}
        >
          <option value="id">ID</option>
          <option value="status">Status</option>
          <option value="date">Date</option>
        </select>
      </div>
    );
};

export default JobsSorting;