/**
 * TelemetryLanding.js
 *
 * Replaces the legacy Telemetry.js room-grid with a two-tier navigation:
 *   Section A — HPCQCaaS Providers
 *   Section B — QaaS Providers
 *
 * Clicking an institution card navigates to /telemetry/institution/:institutionId.
 * The existing /telemetry/:roomId flow is preserved unchanged.
 */

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import ContentCard from '@components/UI/Card/ContentCard';
import LoadingIndicator from '@components/UI/LoadingIndicator';
import ErrorBlock from '@components/UI/MessageBox/ErrorBlock';
import { fetchInstitutions } from './telemetryInstitutionService';
import IQM_logo from '@assets/images/IQM_logo.png';
import AQT_logo from '@assets/images/Logo-AQT.png';
import planqc_logo from '@assets/images/planqc_logo.png';
import wmi_logo from '@assets/images/wmi-logo.svg';
import './TelemetryLanding.scss';

// Institution logo map — keyed by institution.id
// Logos from src/assets/images are imported above; logos in public/user_logos are referenced by path.
const INSTITUTION_LOGOS = {
  lrz: '/user_logos/lrz_wortbild_square.png',
  cineca: '/user_logos/CINECA.jpeg',
  cesga: '/user_logos/CESGA.jpeg',
  psnc: '/user_logos/PSNC.jpeg',
  aws: '/user_logos/AWS.jpeg',
  dlr: '/user_logos/DLR.jpeg',
  ibm: '/user_logos/IBM.jpeg',
  pasqal: '/user_logos/Pasqal.jpeg',
  quandela: '/user_logos/Quandela.jpeg',
  'iqm-vendor': IQM_logo,
  wmi: wmi_logo,
  planqc: planqc_logo,
  aqt: AQT_logo,
};

// Country code → flag emoji
function countryFlag(code) {
  if (!code || code.length !== 2) return '';
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
}

// Map country code → country name for aria labels
const COUNTRY_NAMES = {
  DE: 'Germany',
  IT: 'Italy',
  ES: 'Spain',
  PL: 'Poland',
  US: 'United States',
  FI: 'Finland',
  AT: 'Austria',
  FR: 'France',
};

function InstitutionCard({ institution, darkmode, fs, onNavigate }) {
  const [hovered, setHovered] = useState(false);
  const totalResources = institution.resources.length;
  const countryName = COUNTRY_NAMES[institution.country] || institution.country;
  const flag = countryFlag(institution.country);

  const cardStyle = hovered
    ? {
        transform: 'translateY(-6px)',
        boxShadow: `0 20px 40px -12px rgba(0,0,0,0.18)`,
        borderLeft: `4px solid ${institution.brandColor || '#6cacde'}`,
      }
    : {};

  return (
    <div
      className={`inst-card ${darkmode ? 'inst-card--dark' : 'inst-card--light'} ${hovered ? 'inst-card--hovered' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`${institution.name}, ${institution.category} provider, ${totalResources} resources`}
      style={cardStyle}
      onClick={() => onNavigate(institution.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNavigate(institution.id);
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/* Institution logo — top right */}
      {INSTITUTION_LOGOS[institution.id] && (
        <img
          src={INSTITUTION_LOGOS[institution.id]}
          alt={`${institution.name} logo`}
          className="inst-card__inst-logo"
        />
      )}

      {/* Header row */}
      <div className="inst-card__header">
        <span className="inst-card__name" style={{ fontSize: +fs * 1.15 }}>
          {institution.name}
        </span>
        <span role="img" aria-label={`${countryName} flag`} className="inst-card__flag">
          {flag}
        </span>
      </div>

      {/* Badges row */}
      <div className="inst-card__badges">
        {institution.hasLRZRooms && <span className="inst-card__live-badge">Live Telemetry</span>}
        <span className="inst-card__resource-badge">
          {totalResources} {totalResources === 1 ? 'Resource' : 'Resources'}
        </span>
      </div>

      {/* Description */}
      <p className="inst-card__desc" style={{ fontSize: +fs * 0.9 }}>
        {institution.shortDescription}
      </p>

      {/* Arrow */}
      <div className="inst-card__arrow" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, darkmode }) {
  return (
    <div className="landing-section-header">
      <h3 className={`landing-section-title ${darkmode ? 'landing-section-title--dark' : ''}`}>
        {title}
      </h3>
      {subtitle && (
        <p
          className={`landing-section-subtitle ${darkmode ? 'landing-section-subtitle--dark' : ''}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function StatBar({ institutions, darkmode, fs }) {
  const stats = useMemo(() => {
    const realResources = institutions.flatMap((i) => i.resources.filter((r) => !r.isPlaceholder));
    const countries = new Set(institutions.map((i) => i.country));
    const technologies = new Set(realResources.map((r) => r.technology));
    return {
      institutionCount: institutions.length,
      resourceCount: realResources.length,
      countryCount: countries.size,
      techCount: technologies.size,
    };
  }, [institutions]);

  return (
    <div className={`landing-statbar ${darkmode ? 'landing-statbar--dark' : ''}`}>
      {[
        { value: stats.institutionCount, label: 'Institutions' },
        { value: stats.resourceCount, label: 'Resources' },
        { value: stats.countryCount, label: 'Countries' },
        { value: stats.techCount, label: 'Technologies' },
      ].map(({ value, label }) => (
        <div key={label} className="landing-statbar__item">
          <span className="landing-statbar__number" style={{ fontSize: +fs * 2 }}>
            {value}
          </span>
          <span className="landing-statbar__label" style={{ fontSize: +fs * 0.85 }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const TelemetryLanding = () => {
  const navigate = useNavigate();
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const page_header_fs = +fs * 2;

  const {
    data: institutions,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['institutions'],
    queryFn: ({ signal }) => fetchInstitutions({ signal }),
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    return (
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
        <ErrorBlock title="Failed to load institutions" message={error?.message || ''} />
      </ContentCard>
    );
  }

  if (isPending) {
    return (
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
        <LoadingIndicator />
        <p>Loading institutions…</p>
      </ContentCard>
    );
  }

  // Sort providers by number of real resources (non-placeholder) so the grid
  // displays centres left-to-right by resource count (descending).
  const sortByResources = (list) =>
    list.slice().sort((a, b) => {
      const aCount = (a.resources || []).filter((r) => !r.isPlaceholder).length;
      const bCount = (b.resources || []).filter((r) => !r.isPlaceholder).length;
      return bCount - aCount;
    });

  const hpcqcasProviders = sortByResources(institutions.filter((i) => i.category === 'HPCQCaaS'));
  const qaasProviders = sortByResources(institutions.filter((i) => i.category === 'QaaS'));

  const handleNavigate = (institutionId) => {
    navigate(`/telemetry/institution/${institutionId}`);
  };

  return (
    <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
      <div className="telemetry-landing">
        {/* Page header */}
        <div className={`telemetry-landing__header${darkmode ? ' telemetry-landing__header--dark' : ''}`}>
          <h2 style={{ fontSize: page_header_fs }}>Resource Map</h2>
          <p
            className={`telemetry-landing__subtitle ${darkmode ? 'telemetry-landing__subtitle--dark' : ''}`}
          >
            Explore quantum computing resources across our partner institutions and providers.
            Select an institution to view its available telemetry data, quantum hardware, and
            services.
          </p>
        </div>

        {/* Statistics bar — top of page */}
        <StatBar institutions={institutions} darkmode={darkmode} fs={fs} />

        {/* Section A — HPCQCaaS */}
        <SectionHeader title="HPCQC-as-a-Service Providers" darkmode={darkmode} />
        <div className="inst-grid">
          {hpcqcasProviders.map((inst) => (
            <InstitutionCard
              key={inst.id}
              institution={inst}
              darkmode={darkmode}
              fs={fs}
              onNavigate={handleNavigate}
            />
          ))}
        </div>

        {/* Divider */}
        <div
          className={`landing-divider ${darkmode ? 'landing-divider--dark' : ''}`}
          role="separator"
        />

        {/* Section B — QaaS */}
        <SectionHeader title="Quantum-as-a-Service Providers" darkmode={darkmode} />
        <div className="inst-grid">
          {qaasProviders.map((inst) => (
            <InstitutionCard
              key={inst.id}
              institution={inst}
              darkmode={darkmode}
              fs={fs}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      </div>
    </ContentCard>
  );
};

export default TelemetryLanding;
