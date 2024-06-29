import JobsFilterForm from "./JobsFilterForm";


const JobsFilter = (props) => {
    return (
      <div className="action_container filter_container">
        <label>Filter by:</label>
        <JobsFilterForm />
      </div>
    );
}

export default JobsFilter;