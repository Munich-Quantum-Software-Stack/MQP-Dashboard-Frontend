import React from 'react';

export default function ErrorBlock({ title, message }) {
  return (
    <div className="error-block-container">
      <div className="text-center my-5">
        <h3>{title}</h3>
        <div>{message}</div>
      </div>
    </div>
  );
}
