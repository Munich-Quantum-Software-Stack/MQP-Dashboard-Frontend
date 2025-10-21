import React, {useState} from "react";

const JobsFilterForm = (props) => {
    const [filteredItem, setFilteredItem] = useState('');
    const [filteredItemValue, setFilteredItemValue] = useState('');

    const selectFilterItemHandler = (event) => {
        setFilteredItem(event.target.value);
    }

    const filteredValueChangeHandler = (event) => {
        setFilteredItemValue(event.target.value);
    }
    return (
      <React.Fragment>

          <select
            className="form-control filter_input"
            name="filter_property"
            onSelect={selectFilterItemHandler}
            selected={filteredItem}
          >
            <option value="id">ID</option>
            {/* <option value="status">Status</option> */}
            <option value="date">Date</option>
          </select>
    
    
          <input
            type="text"
            className="form-control filter_input"
            name="filter_value"
            value={filteredItemValue}
            onChange={filteredValueChangeHandler}
          />

      </React.Fragment>
    );
    

}

export default JobsFilterForm;
