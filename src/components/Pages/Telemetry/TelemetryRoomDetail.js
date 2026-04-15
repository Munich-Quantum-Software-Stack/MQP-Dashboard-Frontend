import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ContentCard from '@components/UI/Card/ContentCard';
import PaneCard from '@components/UI/Card/PaneCard';
import ErrorBlock from '@components/UI/MessageBox/ErrorBlock';
import IQM_logo from '@assets/images/IQM_logo.png';
import GrafanaPanel from './components/GrafanaPanel';
import SensorSelector from './components/SensorSelector';
import DownloadBar from './components/DownloadBar';
import { getRoomData } from './telemetryService';
import { buildPanelViewUrl } from '@components/Pages/Telemetry/grafanaConfig';
import './Telemetry.scss';
import '@components/Pages/Resources/Resources.scss';
import './TelemetryResources.scss';

const RoomDetailSkeleton = ({ darkmode }) => {
  const shimmer = {
    background: darkmode
      ? 'linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%)'
      : 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite',
    borderRadius: '6px',
  };
  return (
    <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
      {/* Room header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
        <div style={{ ...shimmer, width: '32px', height: '32px', borderRadius: '50%' }} />
        <div style={{ ...shimmer, width: '240px', height: '28px' }} />
      </div>
      {/* Device cards */}
      <div style={{ ...shimmer, width: '160px', height: '22px', marginBottom: '16px' }} />
      <div className="resources_list" style={{ marginBottom: '32px' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="col-12 col-md-6 col-lg-6 col-xl-4 col-xxl-3 resource_item_wrap">
            <div style={{ ...shimmer, height: '180px', borderRadius: '10px' }} />
          </div>
        ))}
      </div>
      {/* Sensor selector placeholder */}
      <div style={{ ...shimmer, width: '200px', height: '22px', marginBottom: '16px' }} />
      <div style={{ ...shimmer, height: '120px', borderRadius: '10px' }} />
    </ContentCard>
  );
};

const TelemetryRoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const page_header_fs = +fs * 1.5;
  const resource_name_fs = +fs * 1.5;
  const resource_subtitle_fs = +fs * 1.05;
  const resource_text_fs = +fs;

  const [roomState, setRoomState] = useState({ status: 'loading', data: null, error: null });
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [showGraphModal, setShowGraphModal] = useState(false);
  const [selection, setSelection] = useState({
    selectedIds: [],
    from: new Date(Date.now() - 86400000),
    to: new Date(),
    groupBy: '5m',
  });

  const loadRoom = useCallback(() => {
    setRoomState({ status: 'loading', data: null, error: null });
    getRoomData(roomId)
      .then((room) => setRoomState({ status: 'ready', data: room, error: null }))
      .catch((err) =>
        setRoomState({ status: 'error', data: null, error: err.message || 'Failed to load room' }),
      );
  }, [roomId]);

  useEffect(() => {
    loadRoom();
  }, [loadRoom]);

  const handleSensorClick = useCallback((sensor) => {
    setSelectedSensor(sensor);
    setShowGraphModal(true);
  }, []);

  const handleSelectionChange = useCallback((newSelection) => {
    setSelection(newSelection);
  }, []);

  const handleBackClick = () => navigate('/telemetry/institution/lrz');

  const closeModal = () => {
    setShowGraphModal(false);
    setSelectedSensor(null);
  };

  if (roomState.status === 'loading') {
    return <RoomDetailSkeleton darkmode={darkmode} />;
  }

  if (roomState.status === 'error') {
    return (
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
        <ErrorBlock
          title="Failed to load room details"
          message={roomState.error || 'Room not found'}
        />
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button onClick={loadRoom} className="btn btn-primary">
            ↺ Retry
          </button>
          <button onClick={handleBackClick} className="btn btn-secondary">
            ← Back to Telemetry
          </button>
        </div>
      </ContentCard>
    );
  }

  const roomData = roomState.data;

  // Keep this variable for future Grafana button restore. ESLint: it may be unused while the
  // button is commented out — suppress the unused-vars warning so commits pass linting.
  // eslint-disable-next-line no-unused-vars
  const panelViewUrl =
    showGraphModal && selectedSensor
      ? buildPanelViewUrl(selectedSensor.grafanaPanelRef, selection.from, selection.to)
      : null;

  return (
    <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
      {/* Back button — top left */}
      <div style={{ marginBottom: '16px', textAlign: 'left' }}>
        <button
          onClick={handleBackClick}
          className={`inst-detail__back-btn${darkmode ? ' inst-detail__back-btn--dark' : ''}`}
          aria-label="Back to Rooms"
        >
          ← Back to Rooms
        </button>
      </div>

      {/* Room header */}
      <div
        className="room-header"
        style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}
      >
        <h2 style={{ fontSize: page_header_fs, margin: 0 }}>
          <span className="room-icon mr-2">{roomData.icon}</span>
          {roomData.name}
        </h2>
      </div>

      {/* Quantum Devices */}
      {roomData.quantumDevices?.length > 0 && (
        <div>
          <h3>Quantum Devices</h3>
          <div className="resources_list">
            {roomData.quantumDevices.map((device) => (
              <div
                key={device.id}
                className="col-12 col-xs-6 col-md-6 col-lg-6 col-xl-4 col-xxl-3 resource_item_wrap"
              >
                <PaneCard className="resource_item resource_bg_1">
                  <div className="resource_item_body">
                    <div className="d-flex justify-content-between">
                      <div className="resource_item_title">
                        <h5
                          className="pane_title resource_title"
                          style={{ fontSize: resource_name_fs }}
                        >
                          {device.name}
                        </h5>
                        <div className="short_divider"></div>
                      </div>
                      <div className="resource_item_logo">
                        <div className="resource_log_wrap">
                          <img src={IQM_logo} alt={device.vendor} />
                        </div>
                      </div>
                    </div>
                    <div className="pane_desc">
                      <div className="my-2" style={{ fontSize: resource_text_fs }}>
                        {device.vendor} {device.name}
                      </div>
                    </div>
                    <div className="resource_status mb-2">
                      <div className="pane_subtitle" style={{ fontSize: resource_subtitle_fs }}>
                        Status:
                      </div>
                      <div className="status_icon_wrap d-flex justify-content-start">
                        <div className="status_icon">
                          <span className="online_icon"></span>
                        </div>
                        <div className="mx-2" style={{ fontSize: resource_text_fs }}>
                          Online
                        </div>
                      </div>
                    </div>
                    <div className="resource_qubit mb-2">
                      <div className="pane_subtitle" style={{ fontSize: resource_subtitle_fs }}>
                        Qubits: <b>{device.qubits}</b>
                      </div>
                    </div>
                    <div className="resource_technology mb-2">
                      <div className="pane_subtitle" style={{ fontSize: resource_subtitle_fs }}>
                        Quantum Technology:
                      </div>
                      <div className="resource_value" style={{ fontSize: resource_text_fs }}>
                        <i>{device.topology}</i>
                      </div>
                    </div>
                  </div>
                </PaneCard>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Environment Monitoring — collapsible sensor selector */}
      <div className="mt-5">
        <h3 style={{ marginBottom: '20px', color: darkmode ? '#f3f4f6' : '#1f2937' }}>
          Environment Monitoring
        </h3>
        {roomData.environmentSensors && (
          <SensorSelector
            environmentSensors={roomData.environmentSensors}
            darkmode={darkmode}
            onChange={handleSelectionChange}
            onSensorClick={handleSensorClick}
          />
        )}
      </div>

      {/* Sticky download bar — visible when ≥1 sensor selected */}
      <DownloadBar
        selectedIds={selection.selectedIds}
        from={selection.from}
        to={selection.to}
        groupBy={selection.groupBy}
        darkmode={darkmode}
      />

      {/* Graph modal */}
      {showGraphModal && selectedSensor && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: darkmode ? '#111827' : '#ffffff',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
              }}
            >
              <h3 style={{ margin: 0, color: darkmode ? '#f3f4f6' : '#1f2937' }}>
                📊 {selectedSensor.name} — Live Data
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: darkmode ? '#9ca3af' : '#6b7280',
                }}
                aria-label="Close graph"
              >
                ×
              </button>
            </div>

            <GrafanaPanel
              sensor={selectedSensor}
              from={selection.from}
              to={selection.to}
              isDarkMode={darkmode}
            />

            <div
              style={{
                padding: '16px 20px',
                borderTop: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '12px', color: darkmode ? '#9ca3af' : '#6b7280' }}>
                Last updated: {new Date().toLocaleTimeString()}
              </span>
              {/*
              <button
                className={`btn-open-grafana${!panelViewUrl ? ' btn-disabled' : ''}`}
                disabled={!panelViewUrl}
                title={
                  panelViewUrl
                    ? `Open ${selectedSensor?.name} panel in Grafana`
                    : 'No Grafana panel configured for this sensor'
                }
                onClick={() => {
                  if (panelViewUrl) {
                    window.open(panelViewUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: panelViewUrl ? '#3b82f6' : '#9ca3af',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: panelViewUrl ? 'pointer' : 'not-allowed',
                  opacity: panelViewUrl ? 1 : 0.6,
                }}
              >
                Open in Grafana ↗
              </button>
              */}
            </div>
          </div>
        </div>
      )}
    </ContentCard>
  );
};

export default TelemetryRoomDetail;
