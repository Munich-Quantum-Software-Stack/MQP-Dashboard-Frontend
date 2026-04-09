/**
 * InstitutionDetail.js
 *
 * Displays a single institution's quantum resource grid.
 * Route: /telemetry/institution/:institutionId
 *
 * - LRZ resources with roomId → navigate to /telemetry/:roomId
 * - Non-placeholder resources without roomId → toast/modal "not yet available"
 * - Placeholder resources → greyed-out, no click
 */

import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import ContentCard from '@components/UI/Card/ContentCard';
import PaneCard from '@components/UI/Card/PaneCard';
import LoadingIndicator from '@components/UI/LoadingIndicator';
import ErrorBlock from '@components/UI/MessageBox/ErrorBlock';
import { fetchInstitutionById } from './telemetryInstitutionService';
import { MOCK_ROOMS } from './telemetryService';
import {
  getResourceBgClass,
  getResourceLogo,
  getLogoSizeHint,
} from '@components/utils/vendorConfig';
import '@components/Pages/Resources/Resources.scss';
import './Telemetry.scss';
import './InstitutionDetail.scss';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function countryFlag(code) {
  if (!code || code.length !== 2) return '';
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
}

function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

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

const STATUS_INFO = {
  Online: { icon: '●', className: 'inst-resource-status--online', label: 'Online' },
  Offline: { icon: '●', className: 'inst-resource-status--offline', label: 'Offline' },
  Maintenance: { icon: '▲', className: 'inst-resource-status--maintenance', label: 'Maintenance' },
  Unknown: { icon: '○', className: 'inst-resource-status--unknown', label: 'Unknown' },
};

// ---------------------------------------------------------------------------
// "Not available" toast
// ---------------------------------------------------------------------------
function NotAvailableToast({ onClose }) {
  return (
    <div className="inst-toast" role="alert" aria-live="polite">
      <span className="inst-toast__msg">Live telemetry not yet available for this resource.</span>
      <button className="inst-toast__close" onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Resource card
// ---------------------------------------------------------------------------
function ResourceCard({ resource, institutionHasLRZRooms, darkmode, fs, onNotAvailable }) {
  const navigate = useNavigate();
  const resource_name_fs = +fs * 1.35;
  const resource_text_fs = +fs;
  const resource_subtitle_fs = +fs * 1.0;

  const bgClass = getResourceBgClass(resource.name, resource.vendor, resource.technology);
  const logo = getResourceLogo(resource.name, resource.vendor);
  const logoHint = getLogoSizeHint(resource.name);
  const status = STATUS_INFO[resource.status] || STATUS_INFO['Unknown'];

  const isClickable = !resource.isPlaceholder;
  const clickable = isClickable;

  const handleClick = useCallback(() => {
    if (!clickable) return;
    if (institutionHasLRZRooms && resource.roomId) {
      navigate(`/telemetry/${resource.roomId}`);
      return;
    }
    onNotAvailable();
  }, [clickable, institutionHasLRZRooms, resource.roomId, navigate, onNotAvailable]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!clickable) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [clickable, handleClick],
  );

  const wrapperProps = resource.isPlaceholder
    ? {
        role: 'presentation',
        'aria-disabled': 'true',
        'aria-label': `${resource.name}, coming soon`,
        style: { opacity: 0.45, cursor: 'not-allowed' },
      }
    : {
        role: 'button',
        tabIndex: 0,
        'aria-label': `${resource.name} by ${resource.vendor}, ${resource.technology}, ${resource.status}`,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        style: { cursor: 'pointer' },
      };

  return (
    <div className="col-12 col-xs-6 col-md-6 col-lg-6 col-xl-4 col-xxl-3 resource_item_wrap">
      <PaneCard
        className={`resource_item ${bgClass} ${resource.isPlaceholder ? 'inst-resource--placeholder' : ''}`}
        {...wrapperProps}
      >
        {/* Placeholder overlay */}
        {resource.isPlaceholder && (
          <div className="inst-resource__coming-soon" aria-hidden="true">
            <span>Coming Soon</span>
          </div>
        )}

        {/* Title + logo */}
        <div className="d-flex justify-content-between">
          <div className="resource_item_title">
            <h5 className="pane_title resource_title" style={{ fontSize: resource_name_fs }}>
              {resource.name}
              {resource.isBeta && <span className="beta_badge">BETA</span>}
            </h5>
            <div className="short_divider" />
          </div>
          {logo && (
            <div className="resource_item_logo">
              <div className="resource_log_wrap">
                <img
                  src={logo}
                  alt={`${resource.vendor} logo`}
                  style={logoHint.height ? { height: logoHint.height } : {}}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Vendor */}
        <div className="pane_desc">
          <div className="my-1" style={{ fontSize: resource_text_fs }}>
            <strong>Vendor:</strong> {resource.vendor}
          </div>
          {resource.note && (
            <div className="my-1" style={{ fontSize: resource_text_fs }}>
              {resource.note}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="resource_status mb-2">
          <div className="pane_subtitle" style={{ fontSize: resource_subtitle_fs }}>
            Status:
          </div>
          <div
            className="status_icon_wrap d-flex align-items-center"
            style={{ paddingLeft: '6px' }}
          >
            <span className={`inst-resource-status ${status.className}`} aria-hidden="true">
              {status.icon}
            </span>
            <span className="mx-2" style={{ fontSize: resource_text_fs }}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Qubits */}
        {resource.qubits !== null && (
          <div className="resource_qubit mb-2">
            <div className="pane_subtitle" style={{ fontSize: resource_subtitle_fs }}>
              Qubits: <b>{resource.qubits}</b>
            </div>
          </div>
        )}

        {/* Technology */}
        <div className="resource_technology mb-2">
          <div className="pane_subtitle" style={{ fontSize: resource_subtitle_fs }}>
            Technology:
          </div>
          <div className="resource_value" style={{ fontSize: resource_text_fs }}>
            <i>{resource.technology}</i>
          </div>
        </div>
      </PaneCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LRZ Room Grid — shown instead of the flat resource list for LRZ.
// Reuses .telemetry-grid / .telemetry-room-card from Telemetry.scss so the
// visual language exactly matches the original room-selection view.
// ---------------------------------------------------------------------------

// SVG icons matching the original Telemetry.js room cards
const ROOM_ICONS = {
  'warm-lab': (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="12" fill="#f59e0b" />
      <g stroke="#f59e0b" strokeWidth="3" strokeLinecap="round">
        <line x1="32" y1="8" x2="32" y2="16" />
        <line x1="32" y1="48" x2="32" y2="56" />
        <line x1="8" y1="32" x2="16" y2="32" />
        <line x1="48" y1="32" x2="56" y2="32" />
        <line x1="14.5" y1="14.5" x2="20.5" y2="20.5" />
        <line x1="43.5" y1="43.5" x2="49.5" y2="49.5" />
        <line x1="14.5" y1="49.5" x2="20.5" y2="43.5" />
        <line x1="43.5" y1="20.5" x2="49.5" y2="14.5" />
      </g>
    </svg>
  ),
  'cold-lab': (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="16" fill="none" stroke="#3b82f6" strokeWidth="2" />
      <circle cx="32" cy="32" r="8" fill="#3b82f6" opacity="0.3" />
      <g stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
        <line x1="32" y1="12" x2="32" y2="20" />
        <line x1="29" y1="14" x2="35" y2="14" />
        <line x1="32" y1="44" x2="32" y2="52" />
        <line x1="29" y1="50" x2="35" y2="50" />
        <line x1="12" y1="32" x2="20" y2="32" />
        <line x1="14" y1="29" x2="14" y2="35" />
        <line x1="44" y1="32" x2="52" y2="32" />
        <line x1="50" y1="29" x2="50" y2="35" />
        <line x1="18" y1="18" x2="24" y2="24" />
        <line x1="40" y1="40" x2="46" y2="46" />
        <line x1="18" y1="46" x2="24" y2="40" />
        <line x1="40" y1="24" x2="46" y2="18" />
      </g>
    </svg>
  ),
  'compute-cube': (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect
        x="12"
        y="16"
        width="40"
        height="28"
        rx="2"
        fill="#374151"
        stroke="#6b7280"
        strokeWidth="2"
      />
      <rect x="16" y="20" width="32" height="20" rx="1" fill="#1f2937" />
      <rect x="20" y="24" width="24" height="12" rx="1" fill="#60a5fa" opacity="0.3" />
      <rect x="24" y="48" width="16" height="4" fill="#6b7280" />
      <rect x="20" y="52" width="24" height="2" fill="#9ca3af" />
      <circle cx="18" cy="18" r="1.5" fill="#10b981" />
    </svg>
  ),
  cloud: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path
        d="M48 36c4.4 0 8-3.6 8-8s-3.6-8-8-8c-.7 0-1.4.1-2 .2C44.8 14.5 39 10 32 10c-8.8 0-16 7.2-16 16 0 .7 0 1.3.1 2C10.5 29 6 34.1 6 40c0 6.6 5.4 12 12 12h30c5.5 0 10-4.5 10-10 0-4.4-2.9-8.2-7-9.5"
        fill="#e5e7eb"
        stroke="#9ca3af"
        strokeWidth="2"
      />
      <circle cx="24" cy="38" r="2" fill="#9ca3af" opacity="0.5" />
      <circle cx="32" cy="42" r="2" fill="#9ca3af" opacity="0.5" />
      <circle cx="40" cy="38" r="2" fill="#9ca3af" opacity="0.5" />
    </svg>
  ),
};

const ROOM_DESCRIPTIONS = {
  'warm-lab': 'Environment monitoring for the warm laboratory area',
  'cold-lab': 'Environment monitoring for the cryogenic laboratory area',
  'compute-cube': 'Environment monitoring for the quantum computing hardware',
  cloud: 'Devices operating through our cloud',
};

function LRZRoomGrid({ darkmode, fs }) {
  const navigate = useNavigate();
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const rooms = Object.values(MOCK_ROOMS);

  return (
    <>
      <div className="inst-detail__resources-header">
        <p
          className={`inst-detail__resources-title ${
            darkmode ? 'inst-detail__resources-title--dark' : ''
          }`}
          style={{ fontSize: +fs * 1.0 }}
        >
          Select a room to view environment data and device telemetry
        </p>
      </div>

      <div className="telemetry-grid">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`telemetry-room-card ${hoveredRoom === room.id ? 'hovered' : ''} ${darkmode ? 'dark' : ''}`}
            role="button"
            tabIndex={0}
            aria-label={`${room.name}, enter room`}
            style={{ '--card-color': room.color }}
            onClick={() => navigate(`/telemetry/${room.id}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(`/telemetry/${room.id}`);
              }
            }}
            onMouseEnter={() => setHoveredRoom(room.id)}
            onMouseLeave={() => setHoveredRoom(null)}
            onFocus={() => setHoveredRoom(room.id)}
            onBlur={() => setHoveredRoom(null)}
          >
            <div className="card-icon">{ROOM_ICONS[room.id]}</div>
            <h3 className="card-title" style={{ fontSize: `${+fs * 1.15}px` }}>
              {room.name}
            </h3>
            <p className="card-description" style={{ fontSize: `${fs}px` }}>
              {ROOM_DESCRIPTIONS[room.id] || ''}
            </p>
            <div className="card-arrow">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* LRZ facility stats */}
      <div className="telemetry-stats">
        <div className="stat-item">
          <span className="stat-number">4</span>
          <span className="stat-label">Monitored Locations</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">6</span>
          <span className="stat-label">Active Sensors</span>
          <span className="stat-note">(more to come)</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">8</span>
          <span className="stat-label">Quantum Devices</span>
          <span className="stat-note">(more to come)</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">97%</span>
          <span className="stat-label">Uptime</span>
          <span className="stat-note">(subject to change)</span>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Institution logo / avatar
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
function InstitutionLogo({ institution }) {
  const [imgError, setImgError] = useState(false);
  if (institution.logoFile && !imgError) {
    return (
      <img
        src={`/user_logos/${institution.logoFile}`}
        alt={`${institution.name} logo`}
        className="inst-detail__logo-img"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div
      className="inst-detail__logo-avatar"
      style={{ backgroundColor: institution.brandColor || '#6cacde' }}
      aria-label={`${institution.name} initials`}
    >
      {initials(institution.name)}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const InstitutionDetail = () => {
  const { institutionId } = useParams();
  const navigate = useNavigate();
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const page_header_fs = +fs * 1.75;

  const [showToast, setShowToast] = useState(false);

  const {
    data: institution,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['institution', institutionId],
    queryFn: ({ signal }) => fetchInstitutionById(institutionId, { signal }),
    staleTime: 5 * 60 * 1000,
  });

  const handleNotAvailable = useCallback(() => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  }, []);

  if (isError) {
    return (
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
        <ErrorBlock title="Institution not found" message={error?.message || ''} />
      </ContentCard>
    );
  }

  if (isPending) {
    return (
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
        <LoadingIndicator />
        <p>Loading institution…</p>
      </ContentCard>
    );
  }

  const countryName = COUNTRY_NAMES[institution.country] || institution.country;
  const flag = countryFlag(institution.country);

  return (
    <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
      <div className={`inst-detail ${darkmode ? 'inst-detail--dark' : ''}`}>
        {/* Breadcrumb
        <nav className="inst-detail__breadcrumb" aria-label="Breadcrumb">
          <button
            className="inst-detail__breadcrumb-link"
            onClick={() => navigate('/telemetry')}
            aria-label="Back to Telemetry landing page"
          >
            Telemetry
          </button>
          <span className="inst-detail__breadcrumb-sep" aria-hidden="true"> › </span>
          <span className="inst-detail__breadcrumb-current" aria-current="page">
            {institution.name}
          </span>
        </nav>
        */}

        {/* Back button */}
        <button
          className={`inst-detail__back-btn ${darkmode ? 'inst-detail__back-btn--dark' : ''}`}
          onClick={() => navigate('/telemetry')}
          aria-label="Back to Quantum Resource Map"
        >
          ← Back to Quantum Resource Map
        </button>

        {/* Institution header */}
        <div className="inst-detail__header">
          <div className="inst-detail__header-info">
            <div className="inst-detail__title-row">
              <h2 style={{ fontSize: page_header_fs }} className="inst-detail__name">
                {institution.name}
              </h2>
              <span role="img" aria-label={`${countryName} flag`} className="inst-detail__flag">
                {flag}
              </span>
            </div>

            <p className={`inst-detail__desc ${darkmode ? 'inst-detail__desc--dark' : ''}`}>
              {institution.shortDescription}
            </p>

            <div className="inst-detail__meta">
              <span
                className={`inst-detail__country ${darkmode ? 'inst-detail__country--dark' : ''}`}
              >
                {countryName}
              </span>
              {institution.websiteUrl && (
                <a
                  href={institution.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inst-detail__website"
                  aria-label={`Visit ${institution.name} website (opens in new tab)`}
                >
                  Visit website ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Room grid (LRZ) OR flat resource grid (all other institutions) */}
        {institution.hasLRZRooms ? (
          <LRZRoomGrid darkmode={darkmode} fs={fs} />
        ) : (
          <>
            <div className="inst-detail__resources-header">
              <h3
                className={`inst-detail__resources-title ${
                  darkmode ? 'inst-detail__resources-title--dark' : ''
                }`}
                style={{ fontSize: +fs * 1.25 }}
              >
                Quantum Resources ({institution.resources.length})
              </h3>
            </div>

            <div className="resources_list inst-detail__resource-grid">
              {institution.resources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  institutionHasLRZRooms={institution.hasLRZRooms}
                  darkmode={darkmode}
                  fs={fs}
                  onNotAvailable={handleNotAvailable}
                />
              ))}
            </div>
          </>
        )}

        {/* Not-available toast */}
        {showToast && <NotAvailableToast onClose={() => setShowToast(false)} />}
      </div>
    </ContentCard>
  );
};

export default InstitutionDetail;
