import React from 'react';

const UpdatedDate = ({ prefix = 'Updated:', date = null }) => {
  const dateToShow = date ? new Date(date) : new Date();
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const formatted = dateToShow.toLocaleDateString('en-US', options);
  return <div className="updated_date">{`${prefix} ${formatted}`}</div>;
};

export default UpdatedDate;
