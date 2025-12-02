import JobsFilterForm from './JobsFilterForm';

/**
 * JobsFilter - Container wrapper that renders the jobs filter form with label
 */
const JobsFilter = (props) => {
  return (
    <div className="action_container filter_container">
      <label>Filter by:</label>
      <JobsFilterForm />
    </div>
  );
};

export default JobsFilter;
