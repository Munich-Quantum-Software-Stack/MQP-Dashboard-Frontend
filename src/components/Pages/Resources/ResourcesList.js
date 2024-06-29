import ResourceItem from "./ResourceItem";

const ResourcesList = ({ resources }) => {
   
  return (
      <div className="row resources_list">
          {resources.map((resource) => (
              <ResourceItem
                  key={resource.name}
                  name={resource.name}
                  status={resource.maintenance}
                  note={resource.note}
                  qubits={resource.qubits}
                  quantum_technology={resource.quantum_technology}
                  connectivity={resource.connectivity}
                  // budgets_remaining={resource.budgets.remaining}
                  // budgets_allocation={resource.budgets.allocation}
              />
          ))}
      </div>
  );
};

export default ResourcesList;
 