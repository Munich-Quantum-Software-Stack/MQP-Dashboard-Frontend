//filepath: /src/components/Pages/Jobs/JobCircuits.js
import React from 'react';

/**
 * JobCircuits - Displays both submitted and executed quantum circuit code side by side
 */
const JobCircuits = ({ circuit, executedCircuit }) => {
  return (
    <div className="job_circuits">
      <h4>Submitted Circuit</h4>
      <pre>{circuit || 'N/A'}</pre>
      <h4>Executed Circuit</h4>
      <pre>{executedCircuit || 'N/A'}</pre>
    </div>
  );
};

export default JobCircuits;
