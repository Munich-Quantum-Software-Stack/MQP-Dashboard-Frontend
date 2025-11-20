import React from 'react';
import { useSelector } from 'react-redux';
import MaintenanceResourceItem from 'src/components/Pages/Resources/MaintenanceResourceItem';
import ActiveResourceItem from 'src/components/Pages/Resources/ActiveResourceItem';
import BlankCard from 'src/components/UI/Card/BlankCard';

const ResourcesList = ({ resources, available_resources }) => {
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const page_header_fs = +fs * 1.5;

  if (resources.length === 0) {
    return (
      <BlankCard className={`${darkmode ? 'dark_bg' : 'white_bg'} h-100`}>
        <h5>No Resource found.</h5>
      </BlankCard>
    );
  }

  const active_resources = [];
  const maintenance_resources = [];
  const restrictedNames = new Set();
  let availableLookup = null;

  if (Array.isArray(available_resources)) {
    availableLookup = new Set();
    available_resources.forEach((resource) => {
      if (resource && typeof resource.name === 'string') {
        availableLookup.add(resource.name);
      }
    });
  }

  for (const resource of resources) {
    if (resource.maintenance === true || resource.status === 'Offline') {
      maintenance_resources.push(resource);
    } else {
      active_resources.push(resource);
      if (availableLookup && !availableLookup.has(resource.name)) {
        restrictedNames.add(resource.name);
      }
    }
  }

  return (
    <React.Fragment>
      {active_resources.length > 0 && (
        <div className="available_resources_list">
          <h4 className="page_header" style={{ fontSize: page_header_fs }}>
            Available System Resources
          </h4>
          <div className="resources_list">
            {active_resources
              .filter((resource) => !resource.maintenance && resource.status !== 'Offline')
              .map((resource) => (
                <ActiveResourceItem
                  isRestricted={restrictedNames.has(resource.name)}
                  key={resource.name}
                  name={resource.name}
                  status={resource.status}
                  note={resource.note}
                  qubits={resource.qubits}
                  quantum_technology={resource.quantum_technology}
                  connectivity={resource.connectivity}
                />
              ))}
          </div>
        </div>
      )}

      {maintenance_resources.length > 0 && (
        <div className="mt-5 other_resources_list">
          <h4 className="page_header" style={{ fontSize: page_header_fs }}>
            Resources under maintenance
          </h4>
          <div className="resources_list">
            {maintenance_resources.map((resource) => (
              <MaintenanceResourceItem
                key={resource.name}
                name={resource.name}
                status={resource.maintenance}
                note={resource.note}
                qubits={resource.qubits}
                quantum_technology={resource.quantum_technology}
                connectivity={resource.connectivity}
              />
            ))}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ResourcesList;
