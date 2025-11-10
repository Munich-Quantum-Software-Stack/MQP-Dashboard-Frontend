import React from "react";
import { useSelector } from "react-redux";
import MaintenanceResourceItem from "src/components/Pages/Resources/MaintenanceResourceItem";
import ActiveResourceItem from "src/components/Pages/Resources/ActiveResourceItem";
import BlankCard from "src/components/UI/Card/BlankCard";

const ResourcesList = ({ resources, available_resources }) => {
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const page_header_fs = +fs * 1.5;

    if (resources.length === 0) {
        return (
            <BlankCard className={`${darkmode ? "dark_bg" : "white_bg"} h-100`}>
                <h5>No Resource found.</h5>
            </BlankCard>
        );
    }

    let active_resources = [];
    let maintenance_resources = [];
    let restricted_resources = [];    
    
    for (let i = 0; i < resources.length; i++) {
        const resource = resources[i];
        
        if (resource.maintenance === true || resource.status === "Offline") {
            maintenance_resources.push(resource);
        } else {
            active_resources.push(resource);
            if (available_resources && !available_resources.some(r => r.name === resource.name)) {
                restricted_resources.push(resource);
            }
        }
    }

    if (!available_resources) {
        available_resources = active_resources;
    }

    return (
        <React.Fragment>

            {active_resources.length > 0 && (
                <div className="available_resources_list">
                    <h4
                        className="page_header"
                        style={{ fontSize: page_header_fs }}
                    >
                        Available System Resources
                    </h4>
                    <div className="resources_list">
                        {active_resources.filter(resource => !resource.maintenance && resource.status !== "Offline").map((resource) => (
                            <ActiveResourceItem
                                isRestricted={restricted_resources.some(r => r.name === resource.name)}
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
                    <h4
                        className="page_header"
                        style={{ fontSize: page_header_fs }}
                    >
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
