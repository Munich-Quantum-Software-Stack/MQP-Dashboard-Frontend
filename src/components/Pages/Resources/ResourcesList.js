import React from "react";
import { useSelector } from "react-redux";
import MaintenanceResourceItem from "./MaintenanceResourceItem";
import ActiveResourceItem from "./ActiveResourceItem";
import BlankCard from "../../UI/Card/BlankCard";

const ResourcesList = ({ resources, available_resources }) => {
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const page_header_fs = +fs * 1.5;

    // console.log("resources:");
    // console.log(resources);
    // console.log("available_resources:");
    // console.log(available_resources);
    
    if (resources.length === 0) {
        return (
            <BlankCard className={`${darkmode ? "dark_bg" : "white_bg"} h-100`}>
                <h5>No Resource found.</h5>
            </BlankCard>
        );
    }

    // filtering Resources
    let active_resources = [];
    let maintenance_resources = [];
    let restricted_resources = [];    
    for (let i = 0; i < resources.length; i++) {
        if (resources[i].maintenance === true) {
            maintenance_resources.push(resources[i]);
        }
        else {
            active_resources.push(resources[i]);

            let isRestricted = isRestrictedResource(resources[i]);
            if (isRestricted) {
                restricted_resources.push(resources[i]);
            }
        }
        
    }

    function isRestrictedResource(resource) {
        let isRestrictedResource = false;
        if (available_resources !== null) {
            let found_restricted_resource = available_resources.find(
                (res) => res.name === resource.name
            );
            if (found_restricted_resource === undefined) {
                isRestrictedResource = true;
            } else {
                isRestrictedResource = false;
            }
        }
        return isRestrictedResource;        
        
    }

    if (available_resources === null) {
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
                        {available_resources.map((resource) => (
                            <ActiveResourceItem
                                isRestricted="false"
                                key={resource.name}
                                name={resource.name}
                                status={resource.maintenance}
                                note={resource.note}
                                qubits={resource.qubits}
                                quantum_technology={resource.quantum_technology}
                                connectivity={resource.connectivity}
                            />
                        ))}
                        {restricted_resources.map((resource) => (
                            <ActiveResourceItem
                                isRestricted="true"
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
