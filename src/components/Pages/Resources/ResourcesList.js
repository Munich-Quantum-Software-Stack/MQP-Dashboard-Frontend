import React from "react";
import { useSelector } from "react-redux";
import ResourceItem from "./ResourceItem";
import BlankCard from "../../UI/Card/BlankCard";
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

    // console.log("available resources: ");
    // console.log(available_resources);
    let restricted_resources = [];
    function isRestrictedResource(resource) {
        let isAvailableResource = available_resources.find(
            (res) => res.name === resource.name
        );
        if (isAvailableResource !== undefined) {
            return true;
        } else {
            return false;
        }
    }
    for (let i = 0; i < resources.length; i++) {
        let isRestricted = isRestrictedResource(resources[i]);
        //console.log("restricted: " + isRestricted);
        if (!isRestricted) {
            //console.log(resources[i]);
            restricted_resources.push(resources[i]);
        }
    }

    // console.log("restricted resources: ");
    // console.log(restricted_resources);
    return (
        <React.Fragment>
            <div className="available_resources_list">
                <h4
                    className="page_header"
                    style={{ fontSize: page_header_fs }}
                >
                    Available System Resources
                </h4>
                <div className="resources_list">
                    {available_resources.map((resource) => (
                        <ResourceItem
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
            <div className="mt-5 other_resources_list">
                <h4
                    className="page_header"
                    style={{ fontSize: page_header_fs }}
                >
                    Resources under maintenance
                </h4>
                <div className="resources_list">
                    {restricted_resources.map((resource) => (
                        <ResourceItem
                            disable={true}
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
        </React.Fragment>
    );
};

export default ResourcesList;
