import React from 'react';
import { useSelector } from 'react-redux';
import ContentCard from '@components/UI/Card/ContentCard';
import { useQuery } from '@tanstack/react-query';
import { fetchResources } from '@utils/resources-http';
import ResourceMap from '@components/Pages/Resources/ResourceMap';
import LoadingIndicator from '@components/UI/LoadingIndicator';
import ErrorBlock from '@components/UI/MessageBox/ErrorBlock';
import { getAuthToken } from '@utils/auth';

function Resources() {
  const access_token = getAuthToken();
  const darkmode = useSelector((state) => state.accessibilities.darkmode);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['resources'],
    queryFn: ({ signal }) => fetchResources({ signal, access_token }),
  });

  let resourcesContent;
  if (isError) {
    return (
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'} `}>
        <ErrorBlock title={error.message} message={error.code} />
      </ContentCard>
    );
  }
  if (isPending) {
    resourcesContent = (
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'} `}>
        <LoadingIndicator />
        <p>Loading data...</p>
      </ContentCard>
    );
  }

  if (data) {
    resourcesContent = <ResourceMap resourceCount={data.resources.length} />;
  }

  return <React.Fragment>{resourcesContent}</React.Fragment>;
}

export default Resources;
