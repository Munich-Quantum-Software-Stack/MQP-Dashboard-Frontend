import React from 'react';
import { useSelector } from 'react-redux';
import ContentCard from '@components/UI/Card/ContentCard';
import { useQuery } from '@tanstack/react-query';
import { fetchSensors } from '@components/utils/telemetry-http';
import LoadingIndicator from '@components/UI/LoadingIndicator';
import ErrorBlock from '@components/UI/MessageBox/ErrorBlock';
import { getAuthToken } from '@utils/auth';
import TelemetryForm from './TelemetryForm';
import BlankCard from '@components/UI/Card/BlankCard';
import './Telemetry.scss';

function Telemetry() {
  const access_token = getAuthToken();
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  // const fs = useSelector((state) => state.accessibilities.font_size);

  // fetch sensors data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['sensors'],
    queryFn: ({ signal }) => fetchSensors({ signal, access_token }),
    staleTime: 3000,
    signal: AbortSignal.timeout(5000),
  });
  let measurementContent;
  if (isError) {
    return (
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
        <ErrorBlock title={error.message} message={error.code} />
      </ContentCard>
    );
  }

  if (isLoading) {
    measurementContent = (
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'} `}>
        <LoadingIndicator />
        <p>Loading data...</p>
      </ContentCard>
    );
  }

  if (data) {
    // Validate loading data
    if (data.length === 0 || data === 'undefined') {
      measurementContent = (
        <BlankCard className={`${darkmode ? 'dark_bg' : 'white_bg'} h-100`}>
          <p>Measurements is undefined! Could not fetch sensors data.</p>
        </BlankCard>
      );
    }
    measurementContent = <TelemetryForm measurements={data} />;
  }
  return (
    <React.Fragment>
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
        <div className="environment_monitoring_container">{measurementContent}</div>
      </ContentCard>
    </React.Fragment>
  );
}
export default Telemetry;
