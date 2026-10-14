import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { fetchResources } from '@utils/resources-http';
import { getAuthToken } from '@utils/auth';
import { RESOURCE_PROVIDERS } from '@components/Pages/Resources/ResourceMap';
import ResourcesList from '@components/Pages/Resources/ResourcesList';
import LoadingIndicator from '@components/UI/LoadingIndicator';
import ErrorBlock from '@components/UI/MessageBox/ErrorBlock';
import './ResourceMap.scss';

function ResourceProviderDetail() {
  const { providerId } = useParams();
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const fsStyle = { '--rm-fs': `${fs}px` };
  const access_token = getAuthToken();
  const provider = RESOURCE_PROVIDERS.find((item) => item.id === providerId);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['resources'],
    queryFn: ({ signal }) => fetchResources({ signal, access_token }),
    enabled: providerId === 'lrz',
  });

  if (!provider) {
    return (
      <main
        className={`resource-provider-detail ${darkmode ? 'dark_bg' : 'white_bg'}`}
        style={fsStyle}
      >
        <Link className="resource-map-back-link" to="/resources">
          ← Back to Resource Map
        </Link>
        <h1>Provider not found</h1>
      </main>
    );
  }

  if (providerId === 'lrz' && isError) {
    return (
      <main
        className={`resource-provider-detail ${darkmode ? 'dark_bg' : 'white_bg'}`}
        style={fsStyle}
      >
        <Link className="resource-map-back-link" to="/resources">
          ← Back to Resource Map
        </Link>
        <ErrorBlock title={error.message} message={error.code} />
      </main>
    );
  }

  return (
    <main
      className={`resource-provider-detail ${darkmode ? 'dark_bg' : 'white_bg'}`}
      style={fsStyle}
    >
      <Link className="resource-map-back-link" to="/resources">
        ← Back to Resource Map
      </Link>
      <header className="resource-provider-detail-header">
        <div>
          <p>{provider.category}</p>
          <h1>
            {provider.name} <span>{provider.country}</span>
          </h1>
          <p>{provider.description}</p>
        </div>
        {provider.logo && <img src={provider.logo} alt={`${provider.name} logo`} />}
      </header>

      {providerId === 'lrz' &&
        (isPending ? (
          <div className="resource-provider-loading">
            <LoadingIndicator />
            <p>Loading resources...</p>
          </div>
        ) : (
          <ResourcesList
            resources={data.resources}
            available_resources={data.available_resources || null}
          />
        ))}

      {providerId !== 'lrz' && (
        <p className="resource-provider-coming-soon">
          Resource listings for this provider will be available here.
        </p>
      )}
    </main>
  );
}

export default ResourceProviderDetail;
