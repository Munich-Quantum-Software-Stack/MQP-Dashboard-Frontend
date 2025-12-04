import React from 'react';
import { useSelector } from 'react-redux';
//import { Link } from "react-router-dom";
import PaneCard from '@components/UI/Card/PaneCard';
import IQM_logo from '@assets/images/IQM_logo.png';
import Eviden_QLM_logo from '@assets/images/eviden-logo.png';
import WMI_logo from '@assets/images/wmi-logo.svg';
import AQT_logo from '@assets/images/Logo-AQT.png';
import MUNICQ_Atoms_logo from '@assets/images/MunicQC_Atoms.png';
import PlanQC_logo from '@assets/images/planqc_logo.png';

/**
 * ResourceItem - Base component for displaying a quantum resource card with vendor branding
 */
const ResourceItem = (props) => {
  const fs = useSelector((state) => state.accessibilities.font_size);
  const resource_name_fs = +fs * 1.5;
  const resource_subtitle_fs = +fs * 1.05;
  const resource_text_fs = +fs;

  // Resource name to vendor mapping for logo and background selection
  const IQM_resources = ['qexa20', 'q5', 'q20'];
  const Eviden_QLM_resources = ['qlm'];
  const WMI_resources = ['wmi3'];
  const Atom_resources = ['muniqc-atoms20'];
  const AQT_resources = ['aqt20'];

  // Determine logo and background color based on resource vendor
  const resource_name = props.name.trim().toLowerCase();
  let resource_logo_src = '';
  let resource_bg = '';
  if (IQM_resources.indexOf(resource_name) > -1) {
    resource_logo_src = IQM_logo;
    resource_bg = 'resource_bg_1';
  }
  if (Eviden_QLM_resources.indexOf(resource_name) > -1) {
    resource_logo_src = Eviden_QLM_logo;
    resource_bg = 'resource_bg_2';
  }
  if (WMI_resources.indexOf(resource_name) > -1) {
    resource_logo_src = WMI_logo;
    resource_bg = 'resource_bg_3';
  }
  if (AQT_resources.indexOf(resource_name) > -1) {
    resource_logo_src = AQT_logo;
    resource_bg = 'resource_bg_4';
  }
  if (Atom_resources.indexOf(resource_name) > -1) {
    resource_logo_src = MUNICQ_Atoms_logo;
    resource_bg = 'resource_bg_5';
  }
  if (resource_name === 'maqcs') {
    resource_logo_src = PlanQC_logo;
    resource_bg = 'resource_bg_7';
  }
  if (resource_name === 'eqe1') {
    resource_logo_src = IQM_logo;
    resource_bg = 'resource_bg_8';
  }
  return (
    <div className="col-12 col-xs-6 col-md-6 col-lg-6 col-xl-4 col-xxl-3 resource_item_wrap">
      <PaneCard
        className={`resource_item ${resource_bg} ${props.disable === 'true' ? 'disabled_bg' : ''}`}
      >
        {/* Overlay layer for disabled resources */}
        {props.disable === 'true' && <div className="disabled_bg_layer"></div>}
        {/* Resource header with name and vendor logo */}
        <div className="d-flex justify-content-between">
          <div className="resource_item_title">
            <h5 className="pane_title resource_title" style={{ fontSize: resource_name_fs }}>
              {props.name}
            </h5>
            <div className="short_divider"></div>
          </div>
          {resource_logo_src && (
            <div className="resource_item_logo">
              {resource_name === 'wmi3' && (
                <div className="resource_log_wrap" style={{ height: 50 }}>
                  <img src={resource_logo_src} alt={resource_name} />
                </div>
              )}
              {resource_name === 'muniqc-atoms20' && (
                <div className="resource_log_wrap">
                  <img src={resource_logo_src} alt={resource_name} style={{ height: 50 }} />
                </div>
              )}
              {resource_name !== 'wmi3' && resource_name !== 'muniqc-atoms20' && (
                <div className="resource_log_wrap">
                  <img src={resource_logo_src} alt={resource_name} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pane_desc">
          <div className="my-2" style={{ fontSize: resource_text_fs }}>
            {props.note}
          </div>
        </div>
        {/* Online/Offline status indicator */}
        <div className="resource_status mb-2">
          <div className="pane_subtitle" style={{ fontSize: resource_subtitle_fs }}>
            Status:
          </div>

          {props.status && (
            <div className=" status_icon_wrap d-flex justify-content-start">
              <div className="status_icon">
                <span className=" offline_icon"></span>
              </div>
              <div className="mx-2" style={{ fontSize: resource_text_fs }}>
                Offline
              </div>
            </div>
          )}
          {!props.status && (
            <div className=" status_icon_wrap d-flex justify-content-start">
              <div className="status_icon">
                <span className=" online_icon"></span>
              </div>
              <div className="mx-2" style={{ fontSize: resource_text_fs }}>
                Online
              </div>
            </div>
          )}
        </div>

        {/* Resource specifications: qubit count and quantum technology type */}
        <div className="resource_qubit mb-2">
          <div className="pane_subtitle" style={{ fontSize: resource_subtitle_fs }}>
            Qubits: <b>{props.qubits}</b>
          </div>
        </div>
        <div className="resource_technology mb-2">
          <div className="pane_subtitle" style={{ fontSize: resource_subtitle_fs }}>
            Quantum Technology:
          </div>
          <div className="resource_value" style={{ fontSize: resource_text_fs }}>
            <i>{props.quantum_technology}</i>
          </div>
        </div>
        {/* <div className="resource_connectivity">
            <div className="pane_subtitle">
                Connectivity: {props.connectivity}
            </div>
        </div>
        <div className="resource_budgets">
                <div className="pane_subtitle">Budgets</div>
                <div className="budget_chart">
                    <p>
                        {" "}
                        {props.budgets_remaining} of{" "}
                        {props.budgets_allocation}{" "}
                    </p>
                </div>
            </div> 
            */}
      </PaneCard>
    </div>
  );
};

export default ResourceItem;
