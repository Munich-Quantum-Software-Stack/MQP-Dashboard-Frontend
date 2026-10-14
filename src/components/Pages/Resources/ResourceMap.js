import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import IQM_logo from '@assets/images/IQM_logo.png';
import WMI_logo from '@assets/images/wmi-logo.svg';
import AQT_logo from '@assets/images/Logo-AQT.png';
import PlanQC_logo from '@assets/images/planqc_logo.png';
import './ResourceMap.scss';

export const RESOURCE_PROVIDERS = [
  {
    id: 'lrz',
    name: 'LRZ',
    country: '🇩🇪',
    resources: 9,
    logo: '/user_logos/lrz_wortbild_e_rgb.svg',
    description:
      "Leibniz Supercomputing Centre operates Germany's flagship HPC-integrated quantum computing facility, providing seamless HPCQC workflows and live telemetry.",
    category: 'HPCQC-as-a-Service Providers',
  },
  {
    id: 'aws',
    name: 'AWS',
    country: '🇺🇸',
    resources: 5,
    logo: '/user_logos/AWS.jpeg',
    description:
      'Amazon Web Services provides cloud access to multiple quantum hardware providers through a unified HPC-capable cloud platform.',
    category: 'HPCQC-as-a-Service Providers',
  },
  {
    id: 'psnc',
    name: 'PSNC',
    country: '🇵🇱',
    resources: 3,
    logo: '/user_logos/PSNC.jpeg',
    description:
      'Poznań Supercomputing and Networking Centre provides HPC-integrated quantum computing with a diverse multi-technology quantum stack.',
    category: 'HPCQC-as-a-Service Providers',
  },
  {
    id: 'dlr',
    name: 'DLR',
    country: '🇩🇪',
    resources: 3,
    logo: '/user_logos/DLR.jpeg',
    description:
      'German Aerospace Center operates quantum computing resources for aerospace, materials simulation, and optimisation applications.',
    category: 'HPCQC-as-a-Service Providers',
  },
  {
    id: 'cineca',
    name: 'CINECA',
    country: '🇮🇹',
    resources: 2,
    logo: '/user_logos/CINECA.jpeg',
    description:
      "CINECA is Italy's leading supercomputing centre, integrating quantum processors with the CINECA HPC ecosystem for hybrid HPC-QC workloads.",
    category: 'HPCQC-as-a-Service Providers',
  },
  {
    id: 'cesga',
    name: 'CESGA',
    country: '🇪🇸',
    resources: 2,
    logo: '/user_logos/CESGA.jpeg',
    description:
      'Galician Supercomputing Centre offers quantum computing resources integrated with HPC systems in Spain.',
    category: 'HPCQC-as-a-Service Providers',
  },
  {
    id: 'ibm',
    name: 'IBM',
    country: '🇺🇸',
    resources: 2,
    logo: '/user_logos/IBM.jpeg',
    description:
      'IBM Quantum provides cloud-accessible superconducting quantum processors, including the latest Eagle and Heron generation systems.',
    category: 'HPCQC-as-a-Service Providers',
  },
  {
    id: 'iqm',
    name: 'IQM',
    country: '🇫🇮',
    resources: 3,
    logo: IQM_logo,
    description:
      'IQM Quantum Computers is a European superconducting quantum hardware manufacturer and cloud provider offering production-grade processors.',
    category: 'Quantum-as-a-Service Providers',
  },
  {
    id: 'wmi',
    name: 'WMI',
    country: '🇩🇪',
    resources: 2,
    logo: WMI_logo,
    description:
      'Walther-Meissner-Institut is a leading German research institute developing superconducting quantum devices and computing platforms.',
    category: 'Quantum-as-a-Service Providers',
  },
  {
    id: 'planqc',
    name: 'PlanQC',
    country: '🇩🇪',
    resources: 2,
    logo: PlanQC_logo,
    description:
      'PlanQC develops neutral-atom quantum computers based on the Munich Quantum Valley research ecosystem.',
    category: 'Quantum-as-a-Service Providers',
  },
  {
    id: 'aqt',
    name: 'AQT',
    country: '🇦🇹',
    resources: 2,
    logo: AQT_logo,
    description:
      'Alpine Quantum Technologies provides trapped-ion quantum processors with industry-leading gate fidelities.',
    category: 'Quantum-as-a-Service Providers',
  },
  {
    id: 'pasqal',
    name: 'PASQAL',
    country: '🇫🇷',
    resources: 2,
    logo: '/user_logos/Pasqal.jpeg',
    description:
      'PASQAL builds neutral-atom quantum processors based on arrays of individually controlled atoms.',
    category: 'Quantum-as-a-Service Providers',
  },
  {
    id: 'quandela',
    name: 'QUANDELA',
    country: '🇫🇷',
    resources: 2,
    logo: '/user_logos/Quandela.jpeg',
    description:
      'Quandela develops photonic quantum computing platforms using bright, single-photon emitters for scalable linear-optical quantum computation.',
    category: 'Quantum-as-a-Service Providers',
  },
];

const RESOURCE_CATEGORIES = ['HPCQC-as-a-Service Providers', 'Quantum-as-a-Service Providers'];

function ProviderCard({ provider, resourceCount }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const isAvailable = provider.id === 'lrz';
  const CardTag = isAvailable ? Link : 'div';
  const cardProps = isAvailable
    ? {
        to: `/resources/providers/${provider.id}`,
        'aria-label': `View ${provider.name} provider and resources`,
      }
    : {
        tabIndex: 0,
        'aria-disabled': 'true',
        'aria-label': `${provider.name} provider, coming soon`,
      };

  return (
    <CardTag
      className={`resource-provider-card${isAvailable ? '' : ' is-disabled'}`}
      {...cardProps}
    >
      {!isAvailable && (
        <span className="resource-coming-soon" role="tooltip">
          Coming soon
        </span>
      )}
      <div className="resource-provider-heading">
        <div>
          <h3>
            {provider.name} <span aria-label={provider.country}>{provider.country}</span>
          </h3>
          <div className="resource-provider-badges">
            <span className="resource-count-badge">
              {provider.id === 'lrz' && resourceCount !== undefined
                ? `${resourceCount} Resources`
                : `${provider.resources} Resources`}
            </span>
          </div>
        </div>
        <span
          className={`resource-provider-logo${logoFailed || !provider.logo ? '' : ' has-logo'}`}
        >
          {provider.logo && !logoFailed ? (
            <img
              src={provider.logo}
              alt={`${provider.name} logo`}
              onError={() => setLogoFailed(true)}
            />
          ) : (
            provider.name
          )}
        </span>
      </div>
      <p>{provider.description}</p>
      {isAvailable && (
        <span className="resource-provider-arrow" aria-hidden="true">
          →
        </span>
      )}
    </CardTag>
  );
}

function ResourceMap({ resourceCount }) {
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);

  return (
    <main className={`resource-map${darkmode ? ' dark_bg' : ''}`} style={{ '--rm-fs': `${fs}px` }}>
      <header className="resource-map-header">
        <h1>Resource Map</h1>
        <p>
          Explore quantum computing resources across our partner institutions and providers. Select
          an institution to view its available telemetry data, quantum hardware, and services.
        </p>
      </header>

      <section className="resource-map-stats" aria-label="Resource map summary">
        <div>
          <strong>13</strong>
          <span>Institutions</span>
        </div>
        <div>
          <strong>9</strong>
          <span>Resources</span>
        </div>
        <div>
          <strong>8</strong>
          <span>Countries</span>
        </div>
        <div>
          <strong>5</strong>
          <span>Technologies</span>
        </div>
      </section>

      {RESOURCE_CATEGORIES.map((category) => (
        <section className="resource-provider-section" key={category}>
          <h2>{category}</h2>
          <div className="resource-provider-grid">
            {RESOURCE_PROVIDERS.filter((provider) => provider.category === category).map(
              (provider) => (
                <ProviderCard key={provider.id} provider={provider} resourceCount={resourceCount} />
              ),
            )}
          </div>
        </section>
      ))}
    </main>
  );
}

export default ResourceMap;
