import React, { useState } from 'react';

/**
 * JobsFilterForm - Filter controls with property selector (ID/Date) and value input field
 */
const JobsFilterForm = (props) => {
  // Track selected filter property and its value
  const [filteredItem, setFilteredItem] = useState('');
  const [filteredItemValue, setFilteredItemValue] = useState('');

  const selectFilterItemHandler = (event) => {
    setFilteredItem(event.target.value);
  };

  const filteredValueChangeHandler = (event) => {
    setFilteredItemValue(event.target.value);
  };

  return (
    <React.Fragment>
      {/* Dropdown to select which property to filter by */}
      <select
        className="form-control filter_input"
        name="filter_property"
        onSelect={selectFilterItemHandler}
        selected={filteredItem}
      >
        <option value="id">ID</option>

        <option value="date">Date</option>
      </select>

      {/* Text input for the filter value */}
      <input
        type="text"
        className="form-control filter_input"
        name="filter_value"
        value={filteredItemValue}
        onChange={filteredValueChangeHandler}
      />
    </React.Fragment>
  );
};

export default JobsFilterForm;
