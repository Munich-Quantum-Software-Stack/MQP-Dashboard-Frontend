import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { fetchResources } from '@utils/resources-http';
import { getAuthToken } from '@utils/auth';
import { getResourceLogo } from '@utils/vendorConfig';
import LoadingIndicator from '@components/UI/LoadingIndicator';
import ErrorBlock from '@components/UI/MessageBox/ErrorBlock';
import AvailabilityChart from './AvailabilityChart';

const FALLBACK_LOGO = '/user_logos/lrz_wortbild_square.png';

function StatusContent() {
  const fs = useSelector((state) => state.accessibilities.font_size);
  const h1_fs = +fs * 3.2;
  const access_token = getAuthToken();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['resources'],
    queryFn: ({ signal }) => fetchResources({ signal, access_token }),
  });

  let content;
  if (isPending) {
    content = (
      <div className="text-center">
        <LoadingIndicator />
        <p>Loading data...</p>
      </div>
    );
  } else if (isError) {
    content = <ErrorBlock title={error.message} message={error.code} />;
  } else {
    content = (
      <div className="status_resource_grid">
        {data.resources.map((resource) => {
          const available = !resource.maintenance && resource.status !== 'Offline';
          const logo = getResourceLogo(resource.name) || FALLBACK_LOGO;
          return (
            <div className="status_resource_item" key={resource.name}>
              <div className="status_resource_box">
                <div className="status_resource_head">
                  <div className="status_resource_info">
                    <div className="status_resource_name" style={{ fontSize: +fs * 1.1 }}>
                      {resource.name}
                    </div>
                    <div className="status_resource_meta" style={{ fontSize: +fs * 0.85 }}>
                      {resource.quantum_technology}
                    </div>
                    <div className="status_resource_meta" style={{ fontSize: +fs * 0.85 }}>
                      {resource.qubits} Qubits
                    </div>
                  </div>
                  <img className="status_resource_logo" src={logo} alt={`${resource.name} logo`} />
                </div>
              </div>
              <AvailabilityChart available={available} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="mb-2 text-center" style={{ marginBottom: '0.75rem' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: h1_fs }}
          className="welcome_text page_header"
        >
          Welcome to Quantum Pathway Program
        </motion.h1>
      </div>
      <h2 className="status_backends_title">Quantum Backends</h2>
      {content}
    </React.Fragment>
  );
}

export default StatusContent;
