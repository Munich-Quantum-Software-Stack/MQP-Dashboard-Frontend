import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import PaneCard from '@components/UI/Card/PaneCard';
import {
  getResourceBgClass,
  getResourceLogo,
  getLogoSizeHint,
} from '@components/utils/vendorConfig';
import { getAuthToken } from '@utils/auth';
import { fetchResourceDetail } from '@utils/resources-http';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return a human-readable relative time string (e.g. "3 days ago"). */
function relativeTime(isoString) {
  if (!isoString) return '—';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffMonths / 12)} year${Math.floor(diffMonths / 12) > 1 ? 's' : ''} ago`;
}

/** Map status string → pill CSS modifier class. */
function statusPillClass(status) {
  if (!status) return '';
  const s = status.toLowerCase();
  if (s === 'online') return 'online';
  if (s === 'offline') return 'offline';
  return 'maintenance';
}

// ---------------------------------------------------------------------------
// Back face sub-component
// ---------------------------------------------------------------------------

function ResourceCardBack({ resourceName, onBack, onMore, fontSize }) {
  const access_token = getAuthToken();

  const { data, isPending, isError } = useQuery({
    queryKey: ['resource-detail', resourceName],
    queryFn: ({ signal }) => fetchResourceDetail({ signal, access_token, resourceName }),
    staleTime: 60_000,
    // enabled is controlled by the parent — this component only mounts when flipped
  });

  const textFs = fontSize;

  if (isPending) {
    return (
      <div className="resource_card_back_content resource_back_loading">
        <button
          className="resource_back_nav_btn"
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          aria-label="Go back to front of card"
        >
          ← Back
        </button>
        <div className="resource_back_spinner_wrap">
          <div className="lds-ring"><div /><div /><div /><div /></div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="resource_card_back_content">
        <button
          className="resource_back_nav_btn"
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          aria-label="Go back to front of card"
        >
          ← Back
        </button>
        <p className="resource_back_error">Could not load details.</p>
      </div>
    );
  }

  const statusClass = statusPillClass(data.status);

  return (
    <div className="resource_card_back_content" style={{ fontSize: textFs }}>
      {/* Navigation row */}
      <div className="resource_back_nav_row">
        <button
          className="resource_back_nav_btn"
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          aria-label="Go back to front of card"
        >
          ← Back
        </button>
      </div>

      {/* Status badge */}
      <div className="resource_back_row">
        <span className="resource_back_label">Status</span>
        <span className={`status_pill ${statusClass}`}>{data.status || '—'}</span>
      </div>

      <div className="resource_back_row">
        <span className="resource_back_label">Qubits</span>
        <span className="resource_back_value">{data.qubits ?? '—'}</span>
      </div>

      <div className="resource_back_row">
        <span className="resource_back_label">QPU Version</span>
        <span className="resource_back_value">{data.qpu_version || '—'}</span>
      </div>

      <div className="resource_back_row">
        <span className="resource_back_label">Fabrication Round</span>
        <span className="resource_back_value">{data.fabrication_round || '—'}</span>
      </div>

      <div className="resource_back_row">
        <span className="resource_back_label">Pending Jobs</span>
        <span className="resource_back_value">{data.pending_jobs ?? '—'}</span>
      </div>

      <div className="resource_back_row">
        <span className="resource_back_label">T1 / T2 (µs)</span>
        <span className="resource_back_value">
          {data.t1_us ?? '—'} / {data.t2_us ?? '—'}
        </span>
      </div>

      <div className="resource_back_row">
        <span className="resource_back_label">Last Calibrated</span>
        <span className="resource_back_value">{relativeTime(data.last_calibrated_at)}</span>
      </div>

      {/* More → button */}
      <div className="resource_back_footer">
        <button
          className="resource_more_btn"
          onClick={(e) => { e.stopPropagation(); onMore(); }}
          aria-label={`Open full detail page for ${resourceName}`}
        >
          More →
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * ActiveResourceItem — Displays a single quantum resource card with a 3D flip
 * that reveals live metadata on the back face.
 */
const ActiveResourceItem = (props) => {
  const fs = useSelector((state) => state.accessibilities.font_size);
  const resource_name_fs = +fs * 1.5;
  const resource_subtitle_fs = +fs * 1.05;
  const resource_text_fs = +fs;

  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  // Determine logo and background color based on resource vendor (via shared vendorConfig)
  const resource_name = props.name.trim().toLowerCase();
  const resource_logo_src = getResourceLogo(props.name) || '';
  const resource_bg = getResourceBgClass(props.name);
  const logoSizeHint = getLogoSizeHint(props.name);

  const handleFlip = () => setIsFlipped(true);
  const handleUnflip = () => setIsFlipped(false);
  const handleMore = () => navigate(`/resources/${encodeURIComponent(props.name)}`);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  // Framer Motion variants for the 3D flip animation
  // Front face fades out via opacity + rotateY (stays in normal flow).
  // Back face uses rotateY from its base 180deg position (absolute overlay).
  const frontVariants = {
    front: { rotateY: 0, opacity: 1, transition: { duration: 0.45, ease: 'easeInOut' } },
    back:  { rotateY: -90, opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } },
  };
  const backVariants = {
    front: { rotateY: 90, opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } },
    back:  { rotateY: 0, opacity: 1, transition: { duration: 0.45, ease: 'easeInOut' } },
  };

  return (
    <div className="col-12 col-xs-6 col-md-6 col-lg-6 col-xl-4 col-xxl-3 resource_item_wrap">
      {/* Perspective container — position:relative so back face overlays the front */}
      <div className="resource_flip_wrapper">
        {/* Front face — stays in normal flow so wrapper height sizes to content */}
        <motion.div
          className="resource_card_front"
          variants={frontVariants}
          animate={isFlipped ? 'back' : 'front'}
          style={{ pointerEvents: isFlipped ? 'none' : 'auto' }}
          tabIndex={0}
          role="button"
          aria-label={`Show details for ${props.name}`}
          onClick={handleFlip}
          onKeyDown={handleKeyDown}
        >
          <PaneCard className={`resource_item ${resource_bg}`}>
            {/* Overlay for restricted resources not available to user's budget */}
            {props.isRestricted === 'true' && (
              <div className="disabled_bg_layer">
                <div className="disabled_icon"></div>
                <p className="my-3 disabled_text">
                  This resource is not available to your budget. Please contact the MQP Admin if you
                  are interested in it.
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
                  <div className="status_icon_wrap d-flex justify-content-start">
                    <div className="status_icon">
                      <span className="offline_icon"></span>
                    </div>
                    <div className="mx-2" style={{ fontSize: resource_text_fs }}>
                      Offline
                    </div>
                  </div>
                )}
                {!props.status && (
                  <div className="status_icon_wrap d-flex justify-content-start">
                    <div className="status_icon">
                      <span className="online_icon"></span>
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

              {/* ⓘ icon to hint the card is interactive */}
              <div className="resource_flip_hint" aria-label="Show details">ⓘ</div>
            </div>
          </PaneCard>
        </motion.div>

        {/* Back face — absolute overlay, only fetches data once isFlipped is true */}
        <motion.div
          className="resource_card_back"
          variants={backVariants}
          animate={isFlipped ? 'back' : 'front'}
          style={{ pointerEvents: isFlipped ? 'auto' : 'none' }}
          aria-hidden={!isFlipped}
        >
          {isFlipped && (
            <ResourceCardBack
              resourceName={props.name}
              onBack={handleUnflip}
              onMore={handleMore}
              fontSize={resource_text_fs}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ActiveResourceItem;

