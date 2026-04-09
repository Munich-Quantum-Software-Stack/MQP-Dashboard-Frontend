import React from 'react';
import { useSelector } from 'react-redux';
//import { Link } from "react-router-dom";
import PaneCard from '@components/UI/Card/PaneCard';
import {
  getResourceBgClass,
  getResourceLogo,
  getLogoSizeHint,
} from '@components/utils/vendorConfig';

/**
 * ActiveResourceItem - Displays a single quantum resource card with logo, status, and specs
 */
const ActiveResourceItem = (props) => {
  const fs = useSelector((state) => state.accessibilities.font_size);
  const resource_name_fs = +fs * 1.5;
  const resource_subtitle_fs = +fs * 1.05;
  const resource_text_fs = +fs;

  // Determine logo and background color based on resource vendor (via shared vendorConfig)
  const resource_name = props.name.trim().toLowerCase();
  const resource_logo_src = getResourceLogo(props.name) || '';
  const resource_bg = getResourceBgClass(props.name);
  const logoSizeHint = getLogoSizeHint(props.name);
  return (
    <div className="col-12 col-xs-6 col-md-6 col-lg-6 col-xl-4 col-xxl-3 resource_item_wrap">
      <PaneCard className={`resource_item ${resource_bg}`}>
        {/* Overlay for restricted resources not available to user's budget */}
        {props.isRestricted === 'true' && (
          <div className="disabled_bg_layer">
            <div className="disabled_icon"></div>
            <p className="my-3 disabled_text">
              This resource is not available to your budget. Please contact the MQP Admin if you are
              interested in it.
            </p>
          </div>
        )}
        <div className="resource_item_body">
          {/* Resource header with name and vendor logo */}
          <div className="d-flex justify-content-between">
            <div className="resource_item_title">
              <h5 className="pane_title resource_title" style={{ fontSize: resource_name_fs }}>
                {props.name}
                {resource_name === 'eqe1' && <span className="beta_badge">BETA</span>}
              </h5>
              <div className="short_divider"></div>
            </div>
            {resource_logo_src && (
              <div className="resource_item_logo">
                <div className="resource_log_wrap">
                  <img
                    src={resource_logo_src}
                    alt={props.name}
                    style={logoSizeHint.height ? { height: logoSizeHint.height } : {}}
                  />
                </div>
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
        </div>
      </PaneCard>
    </div>
  );
};

export default ActiveResourceItem;
