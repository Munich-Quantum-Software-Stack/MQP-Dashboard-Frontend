import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ResourceMap from '@components/Pages/Resources/ResourceMap';
import ResourceProviderDetail from '@components/Pages/Resources/ResourceProviderDetail';
import { RESOURCE_PROVIDERS } from '@components/Pages/Resources/ResourceMap';
import { fetchResources } from '@utils/resources-http';
import { resourcesResponse } from '@test/fixtures/resources-response';
import store from '@store/index';

jest.mock('@utils/resources-http', () => ({
  fetchResources: jest.fn(),
}));

function ProviderDestination() {
  const { providerId } = useParams();
  return <h1>{providerId} provider</h1>;
}

describe('ResourceMap', () => {
  it('shows the provider groups and current LRZ resource count', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ResourceMap resourceCount={4} />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByRole('heading', { name: 'Resource Map' })).toBeInTheDocument();
    expect(screen.getByText('13')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'HPCQC-as-a-Service Providers' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Quantum-as-a-Service Providers' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View LRZ provider and resources' })).toHaveTextContent(
      '4 Resources',
    );
  });

  it('displays a logo for every provider card', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ResourceMap resourceCount={4} />
        </MemoryRouter>
      </Provider>,
    );

    RESOURCE_PROVIDERS.forEach((provider) => {
      expect(screen.getByAltText(`${provider.name} logo`)).toHaveAttribute('src', provider.logo);
    });
  });

  it('only lets users enter LRZ and marks other providers as coming soon', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ResourceMap resourceCount={4} />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(
      screen.getByRole('link', { name: 'View LRZ provider and resources' }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Coming soon')).toHaveLength(RESOURCE_PROVIDERS.length - 1);
    expect(screen.getByLabelText('AWS provider, coming soon')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('navigates to the selected provider detail route', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/resources']}>
          <Routes>
            <Route path="/resources" element={<ResourceMap resourceCount={4} />} />
            <Route path="/resources/providers/:providerId" element={<ProviderDestination />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'View LRZ provider and resources' }));

    expect(screen.getByRole('heading', { name: 'lrz provider' })).toBeInTheDocument();
  });

  it('lists the current dashboard resources under LRZ', async () => {
    fetchResources.mockResolvedValue(resourcesResponse);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/resources/providers/lrz']}>
            <Routes>
              <Route path="/resources/providers/:providerId" element={<ResourceProviderDetail />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>,
    );

    expect(await screen.findByText('qexa20')).toBeInTheDocument();
    expect(screen.getByText('aqt20')).toBeInTheDocument();
    expect(screen.getByText('qlm')).toBeInTheDocument();
    expect(screen.getByText('muniqc-atoms20')).toBeInTheDocument();
  });
});
