import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ContentCard from '@components/UI/Card/ContentCard';
import PaneCard from '@components/UI/Card/PaneCard';
import LoadingIndicator from '@components/UI/LoadingIndicator';
import ErrorBlock from '@components/UI/MessageBox/ErrorBlock';
import IQM_logo from '@assets/images/IQM_logo.png';
import './Telemetry.scss';
import '@components/Pages/Resources/Resources.scss';
import './TelemetryResources.scss';

const TelemetryRoomDetail = () => {
  const { roomId } = useParams();

  const navigate = useNavigate();
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const page_header_fs = +fs * 1.5;
  const resource_name_fs = +fs * 1.5;
  const resource_subtitle_fs = +fs * 1.05;
  const resource_text_fs = +fs;

  const [roomData, setRoomData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [showGraphModal, setShowGraphModal] = useState(false);

  // Dummy Graph Component - SVG graph mimicking Grafana style
  const DummyGraph = ({ sensor }) => {
    // Generate dummy data points for SVG graph
    const generatePoints = () => {
      const points = [];
      for (let i = 0; i <= 20; i++) {
        const x = (i / 20) * 400;
        const y = 100 + Math.sin(i * 0.5) * 40 + Math.random() * 20;
        points.push(`${x},${y}`);
      }
      return points.join(' ');
    };

    return (
      <div style={{ padding: '20px' }}>
        <div
          style={{
            background: darkmode ? '#1f2937' : '#f9fafb',
            borderRadius: '8px',
            padding: '20px',
            border: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
          }}
        >
          <div
            style={{
              marginBottom: '15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span
                style={{
                  color: darkmode ? '#9ca3af' : '#6b7280',
                  fontSize: '12px',
                }}
              >
                SENSOR DATA
              </span>
              <h4
                style={{
                  margin: '5px 0',
                  color: darkmode ? '#f3f4f6' : '#1f2937',
                }}
              >
                {sensor?.name}
              </h4>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  color: '#10b981',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                {sensor?.type === 'temperature'
                  ? '22.4°C'
                  : sensor?.type === 'humidity'
                    ? '45.2%'
                    : sensor?.type === 'pressure'
                      ? '1013 hPa'
                      : '0.02 µg/m³'}
              </span>
              <div style={{ color: '#10b981', fontSize: '12px' }}>▲ 2.1% from last hour</div>
            </div>
          </div>
          <svg width="100%" height="200" viewBox="0 0 420 200" style={{ overflow: 'visible' }}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={40 + i * 40}
                x2="400"
                y2={40 + i * 40}
                stroke={darkmode ? '#374151' : '#e5e7eb'}
                strokeWidth="1"
              />
            ))}
            {/* Y-axis labels */}
            <text
              x="-5"
              y="45"
              fill={darkmode ? '#9ca3af' : '#6b7280'}
              fontSize="10"
              textAnchor="end"
            >
              100
            </text>
            <text
              x="-5"
              y="85"
              fill={darkmode ? '#9ca3af' : '#6b7280'}
              fontSize="10"
              textAnchor="end"
            >
              75
            </text>
            <text
              x="-5"
              y="125"
              fill={darkmode ? '#9ca3af' : '#6b7280'}
              fontSize="10"
              textAnchor="end"
            >
              50
            </text>
            <text
              x="-5"
              y="165"
              fill={darkmode ? '#9ca3af' : '#6b7280'}
              fontSize="10"
              textAnchor="end"
            >
              25
            </text>
            {/* Gradient fill */}
            <defs>
              <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area under curve */}
            <polygon points={`0,180 ${generatePoints()} 400,180`} fill="url(#graphGradient)" />
            {/* Line */}
            <polyline points={generatePoints()} fill="none" stroke="#3b82f6" strokeWidth="2" />
            {/* X-axis labels */}
            <text x="0" y="195" fill={darkmode ? '#9ca3af' : '#6b7280'} fontSize="10">
              00:00
            </text>
            <text x="100" y="195" fill={darkmode ? '#9ca3af' : '#6b7280'} fontSize="10">
              06:00
            </text>
            <text x="200" y="195" fill={darkmode ? '#9ca3af' : '#6b7280'} fontSize="10">
              12:00
            </text>
            <text x="300" y="195" fill={darkmode ? '#9ca3af' : '#6b7280'} fontSize="10">
              18:00
            </text>
            <text x="380" y="195" fill={darkmode ? '#9ca3af' : '#6b7280'} fontSize="10">
              Now
            </text>
          </svg>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginTop: '15px',
              fontSize: '12px',
              color: darkmode ? '#9ca3af' : '#6b7280',
            }}
          >
            <span>Min: {sensor?.type === 'temperature' ? '18.2°C' : '38.1%'}</span>
            <span>Max: {sensor?.type === 'temperature' ? '24.8°C' : '52.3%'}</span>
            <span>Avg: {sensor?.type === 'temperature' ? '21.5°C' : '45.2%'}</span>
          </div>
        </div>
      </div>
    );
  };

  // Graph Modal Component
  const GraphModal = ({ sensor, onClose }) => (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: darkmode ? '#111827' : '#ffffff',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
            📊 {sensor?.name} - Live Data
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: darkmode ? '#9ca3af' : '#6b7280',
            }}
          >
            ×
          </button>
        </div>
        <DummyGraph sensor={sensor} />
        <div
          style={{
            padding: '16px 20px',
            borderTop: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              color: darkmode ? '#9ca3af' : '#6b7280',
            }}
          >
            Last updated: {new Date().toLocaleTimeString()}
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
                background: darkmode ? '#1f2937' : '#f9fafb',
                color: darkmode ? '#f3f4f6' : '#1f2937',
                cursor: 'pointer',
              }}
            >
              Export CSV
            </button>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: '#3b82f6',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              Open in Grafana
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor);
    setShowGraphModal(true);
  };

  // Room data object
  const roomsData = {
    'warm-lab': {
      name: 'Warm Lab (E.U.020)',
      icon: '🔆',
      quantumDevices: [
        {
          id: 'warm-qexa20',
          name: 'QExa20',
          vendor: 'IQM',
          fidelity: '98.5%',
          qubits: 20,
          topology: 'Super Conducting',
          passes: ['Decomposition', 'Mapping', 'Optimization'],
          times: {
            avg_compilation: '1.8s',
            avg_execution: '0.9s',
            uptime: '99.1%',
          },
        },
      ],
      environmentSensors: {
        temperature: {
          floor: [
            { id: 'temp-floor-1', name: 'Floor Temp 1', value: '22.4°C' },
            { id: 'temp-floor-2', name: 'Floor Temp 2', value: '21.8°C' },
          ],
          wall: [
            { id: 'temp-wall-1', name: 'Wall Temp 1', value: '23.1°C' },
            { id: 'temp-wall-2', name: 'Wall Temp 2', value: '22.9°C' },
          ],
          roof: [{ id: 'temp-roof-1', name: 'Roof Temp 1', value: '24.2°C' }],
        },
        humidity: [
          { id: 'humid-1', name: 'Humidity Sensor 1', value: '45%' },
          { id: 'humid-2', name: 'Humidity Sensor 2', value: '42%' },
        ],
        pressure: [{ id: 'pressure-1', name: 'Pressure Sensor 1', value: '1013 hPa' }],
        dust: [{ id: 'dust-1', name: 'Dust Sensor 1', value: '0.02 µg/m³' }],
      },
    },
    'cold-lab': {
      name: 'Cold Lab (E.U.044)',
      icon: '❄️',
      quantumDevices: [
        {
          id: 'daqc-q5',
          name: 'QExa20',
          vendor: 'IQM',
          fidelity: '98.5%',
          qubits: 20,
          topology: 'Super Conducting',
          passes: ['Decomposition', 'Mapping', 'Optimization'],
          times: {
            avg_compilation: '1.8s',
            avg_execution: '0.9s',
            uptime: '99.1%',
          },
        },
        {
          id: 'daqc-q20',
          name: 'Q5',
          vendor: 'IQM',
          fidelity: '97.2%',
          qubits: 5,
          topology: 'Super Conducting',
          passes: ['Decomposition', 'Mapping', 'Optimization'],
          times: {
            avg_compilation: '2.8s',
            avg_execution: '1.2s',
            uptime: '98.4%',
          },
        },
        {
          id: 'marmot-aqt',
          name: 'Q20',
          vendor: 'IQM',
          fidelity: '99.4%',
          qubits: 20,
          topology: 'Super Conducting',
          passes: ['Decomposition', 'Mapping', 'Optimization', 'Error mitigation'],
          times: {
            avg_compilation: '3.7s',
            avg_execution: '0.9s',
            uptime: '97.6%',
          },
        },
      ],
      environmentSensors: {
        temperature: {
          floor: [
            { id: 'cold-temp-floor-1', name: 'Floor Temp 1', value: '4.2K' },
            { id: 'cold-temp-floor-2', name: 'Floor Temp 2', value: '4.1K' },
          ],
          wall: [{ id: 'cold-temp-wall-1', name: 'Wall Temp 1', value: '4.3K' }],
          roof: [{ id: 'cold-temp-roof-1', name: 'Roof Temp 1', value: '4.5K' }],
        },
        pressure: [
          {
            id: 'cold-pressure-1',
            name: 'Pressure Sensor 1',
            value: '1.2 mbar',
          },
          {
            id: 'cold-pressure-2',
            name: 'Pressure Sensor 2',
            value: '0.8 mbar',
          },
        ],
        helium: [
          { id: 'he-level-1', name: 'Helium Level 1', value: '85%' },
          { id: 'he-level-2', name: 'Helium Level 2', value: '92%' },
        ],
      },
    },
    'compute-cube': {
      name: 'Compute Cube (NSR1)',
      icon: '🖥️',
      quantumDevices: [
        {
          id: 'q-exa',
          name: 'QExa20',
          vendor: 'IQM',
          fidelity: '99.2%',
          qubits: 20,
          topology: 'Super Conducting',
          passes: ['Optimization', 'Routing', 'Scheduling'],
          times: {
            avg_compilation: '3.2s',
            avg_execution: '0.5s',
            uptime: '98.7%',
          },
        },
        {
          id: 'euro-q-exa',
          name: 'Q5',
          vendor: 'IQM',
          fidelity: '98.7%',
          qubits: 5,
          topology: 'Super Conducting',
          passes: ['Gate fusion', 'Routing', 'Scheduling'],
          times: {
            avg_compilation: '2.5s',
            avg_execution: '0.8s',
            uptime: '96.2%',
          },
        },
        {
          id: 'qaptiva-800',
          name: 'Q20',
          vendor: 'IQM',
          fidelity: '97.8%',
          qubits: 20,
          topology: 'Super Conducting',
          passes: ['Optimization', 'Translation', 'Scheduling'],
          times: {
            avg_compilation: '4.1s',
            avg_execution: '0.7s',
            uptime: '92.3%',
          },
        },
      ],
      environmentSensors: {
        temperature: {
          floor: [{ id: 'cc-temp-floor-1', name: 'Floor Temp 1', value: '20.1°C' }],
          wall: [
            { id: 'cc-temp-wall-1', name: 'Wall Temp 1', value: '21.3°C' },
            { id: 'cc-temp-wall-2', name: 'Wall Temp 2', value: '20.8°C' },
          ],
          roof: [{ id: 'cc-temp-roof-1', name: 'Roof Temp 1', value: '22.1°C' }],
        },
        humidity: [{ id: 'cc-humid-1', name: 'Humidity Sensor 1', value: '38%' }],
        power: [
          { id: 'cc-power-1', name: 'Power Monitor 1', value: '45.2 kW' },
          { id: 'cc-power-2', name: 'Power Monitor 2', value: '38.7 kW' },
        ],
      },
    },
    cloud: {
      name: 'Cloud',
      icon: '☁️',
      quantumDevices: [
        {
          id: 'maqcs',
          name: 'QExa20',
          vendor: 'IQM',
          fidelity: '98.5%',
          qubits: 20,
          topology: 'Super Conducting',
          passes: ['Decomposition', 'Mapping', 'Optimization'],
          times: {
            avg_compilation: '1.8s',
            avg_execution: '0.9s',
            uptime: '99.1%',
          },
        },
        {
          id: 'munichqc-atoms',
          name: 'Q5',
          vendor: 'IQM',
          fidelity: '97.2%',
          qubits: 5,
          topology: 'Super Conducting',
          passes: ['Decomposition', 'Mapping', 'Optimization'],
          times: {
            avg_compilation: '2.8s',
            avg_execution: '1.2s',
            uptime: '98.4%',
          },
        },
      ],
      environmentSensors: {
        temperature: {
          floor: [{ id: 'cloud-temp-floor-1', name: 'Floor Temp 1', value: '19.8°C' }],
          wall: [{ id: 'cloud-temp-wall-1', name: 'Wall Temp 1', value: '20.2°C' }],
          roof: [{ id: 'cloud-temp-roof-1', name: 'Roof Temp 1', value: '21.0°C' }],
        },
        pressure: [
          {
            id: 'cloud-pressure-1',
            name: 'Pressure Sensor 1',
            value: '1015 hPa',
          },
        ],
        network: [
          { id: 'cloud-network-1', name: 'Network Latency', value: '12ms' },
          { id: 'cloud-network-2', name: 'Bandwidth Usage', value: '2.4 Gbps' },
        ],
      },
    },
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // eslint-disable-next-line security/detect-object-injection
    const room = roomsData[roomId];

    if (!room) {
      setError('Room not found. Please select a valid room.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setRoomData(room);
      setIsLoading(false);
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const handleBackClick = () => {
    navigate('/telemetry');
  };

  if (isLoading) {
    return (
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
        <LoadingIndicator />
        <p>Loading room details...</p>
      </ContentCard>
    );
  }

  if (error || !roomData) {
    return (
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
        <ErrorBlock title="Failed to load room details" message={error || 'Room not found'} />
        <div className="telemetry-back-btn-bottom">
          <button onClick={handleBackClick} className="btn btn-secondary">
            ← Back to Telemetry
          </button>
        </div>
      </ContentCard>
    );
  }

  return (
    <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
      <div
        className="room-header"
        style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}
      >
        <h2 style={{ fontSize: page_header_fs, margin: 0 }}>
          <span className="room-icon mr-2">{roomData.icon}</span>
          {roomData.name}
        </h2>
      </div>
      {/* Quantum Devices Section */}
      {roomData.quantumDevices.length > 0 && (
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

      <div className="mt-5">
        <h3
          style={{
            marginBottom: '24px',
            color: darkmode ? '#f3f4f6' : '#1f2937',
          }}
        >
          Environment Monitoring
        </h3>

        {roomData.environmentSensors && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Temperature Sensors - Organized by location */}
            {roomData.environmentSensors.temperature && (
              <div
                className="sensor-category"
                style={{
                  background: darkmode ? 'transparent' : '#fff',
                  borderRadius: '16px',
                  padding: darkmode ? '0' : '20px',
                  boxShadow: darkmode ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <h4
                  style={{
                    color: darkmode ? '#f59e0b' : '#b45309',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  🌡️ Temperature Sensors
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  {/* Floor Sensors */}
                  {roomData.environmentSensors.temperature.floor?.length > 0 && (
                    <div
                      style={{
                        flex: '1',
                        minWidth: '250px',
                        background: darkmode
                          ? '#1f2937'
                          : 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: `1px solid ${darkmode ? '#374151' : '#fed7aa'}`,
                        boxShadow: darkmode ? 'none' : '0 2px 4px rgba(251, 146, 60, 0.1)',
                      }}
                    >
                      <h5
                        style={{
                          color: darkmode ? '#fcd34d' : '#c2410c',
                          marginBottom: '12px',
                          fontWeight: '600',
                          fontSize: '14px',
                        }}
                      >
                        ⬇️ Floor Sensors
                      </h5>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '10px',
                        }}
                      >
                        {roomData.environmentSensors.temperature.floor.map((sensor) => (
                          <div
                            key={sensor.id}
                            onClick={() =>
                              handleSensorClick({
                                ...sensor,
                                type: 'temperature',
                              })
                            }
                            style={{
                              background: darkmode ? '#111827' : '#ffffff',
                              padding: '14px 16px',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              border: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
                              flex: '1',
                              minWidth: '120px',
                              boxShadow: darkmode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = darkmode
                                ? '0 4px 12px rgba(0,0,0,0.3)'
                                : '0 4px 12px rgba(0,0,0,0.15)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = darkmode
                                ? 'none'
                                : '0 1px 2px rgba(0,0,0,0.05)';
                            }}
                          >
                            <div
                              style={{
                                fontWeight: '600',
                                color: darkmode ? '#f3f4f6' : '#374151',
                                fontSize: '13px',
                              }}
                            >
                              {sensor.name}
                            </div>
                            <div
                              style={{
                                color: '#ea580c',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                margin: '4px 0',
                              }}
                            >
                              {sensor.value}
                            </div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: darkmode ? '#6b7280' : '#9ca3af',
                              }}
                            >
                              Click for graph →
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Wall Sensors */}
                  {roomData.environmentSensors.temperature.wall?.length > 0 && (
                    <div
                      style={{
                        flex: '1',
                        minWidth: '250px',
                        background: darkmode
                          ? '#1f2937'
                          : 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: `1px solid ${darkmode ? '#374151' : '#fed7aa'}`,
                        boxShadow: darkmode ? 'none' : '0 2px 4px rgba(251, 146, 60, 0.1)',
                      }}
                    >
                      <h5
                        style={{
                          color: darkmode ? '#fcd34d' : '#c2410c',
                          marginBottom: '12px',
                          fontWeight: '600',
                          fontSize: '14px',
                        }}
                      >
                        ↔️ Wall Sensors
                      </h5>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '10px',
                        }}
                      >
                        {roomData.environmentSensors.temperature.wall.map((sensor) => (
                          <div
                            key={sensor.id}
                            onClick={() =>
                              handleSensorClick({
                                ...sensor,
                                type: 'temperature',
                              })
                            }
                            style={{
                              background: darkmode ? '#111827' : '#ffffff',
                              padding: '14px 16px',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              border: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
                              flex: '1',
                              minWidth: '120px',
                              boxShadow: darkmode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = darkmode
                                ? '0 4px 12px rgba(0,0,0,0.3)'
                                : '0 4px 12px rgba(0,0,0,0.15)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = darkmode
                                ? 'none'
                                : '0 1px 2px rgba(0,0,0,0.05)';
                            }}
                          >
                            <div
                              style={{
                                fontWeight: '600',
                                color: darkmode ? '#f3f4f6' : '#374151',
                                fontSize: '13px',
                              }}
                            >
                              {sensor.name}
                            </div>
                            <div
                              style={{
                                color: '#ea580c',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                margin: '4px 0',
                              }}
                            >
                              {sensor.value}
                            </div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: darkmode ? '#6b7280' : '#9ca3af',
                              }}
                            >
                              Click for graph →
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Roof Sensors */}
                  {roomData.environmentSensors.temperature.roof?.length > 0 && (
                    <div
                      style={{
                        flex: '1',
                        minWidth: '250px',
                        background: darkmode
                          ? '#1f2937'
                          : 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: `1px solid ${darkmode ? '#374151' : '#fed7aa'}`,
                        boxShadow: darkmode ? 'none' : '0 2px 4px rgba(251, 146, 60, 0.1)',
                      }}
                    >
                      <h5
                        style={{
                          color: darkmode ? '#fcd34d' : '#c2410c',
                          marginBottom: '12px',
                          fontWeight: '600',
                          fontSize: '14px',
                        }}
                      >
                        ⬆️ Roof Sensors
                      </h5>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '10px',
                        }}
                      >
                        {roomData.environmentSensors.temperature.roof.map((sensor) => (
                          <div
                            key={sensor.id}
                            onClick={() =>
                              handleSensorClick({
                                ...sensor,
                                type: 'temperature',
                              })
                            }
                            style={{
                              background: darkmode ? '#111827' : '#ffffff',
                              padding: '14px 16px',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              border: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
                              flex: '1',
                              minWidth: '120px',
                              boxShadow: darkmode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = darkmode
                                ? '0 4px 12px rgba(0,0,0,0.3)'
                                : '0 4px 12px rgba(0,0,0,0.15)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = darkmode
                                ? 'none'
                                : '0 1px 2px rgba(0,0,0,0.05)';
                            }}
                          >
                            <div
                              style={{
                                fontWeight: '600',
                                color: darkmode ? '#f3f4f6' : '#374151',
                                fontSize: '13px',
                              }}
                            >
                              {sensor.name}
                            </div>
                            <div
                              style={{
                                color: '#ea580c',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                margin: '4px 0',
                              }}
                            >
                              {sensor.value}
                            </div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: darkmode ? '#6b7280' : '#9ca3af',
                              }}
                            >
                              Click for graph →
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other Sensor Categories */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {/* Humidity */}
              {roomData.environmentSensors.humidity?.length > 0 && (
                <div
                  style={{
                    flex: '1',
                    minWidth: '280px',
                    background: darkmode
                      ? '#1f2937'
                      : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: `1px solid ${darkmode ? '#374151' : '#bfdbfe'}`,
                    boxShadow: darkmode ? 'none' : '0 2px 4px rgba(59, 130, 246, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      color: darkmode ? '#60a5fa' : '#1d4ed8',
                      marginBottom: '15px',
                      fontWeight: '600',
                      fontSize: '16px',
                    }}
                  >
                    💧 Humidity Sensors
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {roomData.environmentSensors.humidity.map((sensor) => (
                      <div
                        key={sensor.id}
                        onClick={() => handleSensorClick({ ...sensor, type: 'humidity' })}
                        style={{
                          background: darkmode ? '#111827' : '#ffffff',
                          padding: '14px 16px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
                          flex: '1',
                          minWidth: '120px',
                          boxShadow: darkmode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = darkmode
                            ? '0 4px 12px rgba(0,0,0,0.3)'
                            : '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = darkmode
                            ? 'none'
                            : '0 1px 2px rgba(0,0,0,0.05)';
                        }}
                      >
                        <div
                          style={{
                            fontWeight: '600',
                            color: darkmode ? '#f3f4f6' : '#374151',
                            fontSize: '13px',
                          }}
                        >
                          {sensor.name}
                        </div>
                        <div
                          style={{
                            color: '#2563eb',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            margin: '4px 0',
                          }}
                        >
                          {sensor.value}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: darkmode ? '#6b7280' : '#9ca3af',
                          }}
                        >
                          Click for graph →
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pressure */}
              {roomData.environmentSensors.pressure?.length > 0 && (
                <div
                  style={{
                    flex: '1',
                    minWidth: '280px',
                    background: darkmode
                      ? '#1f2937'
                      : 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: `1px solid ${darkmode ? '#374151' : '#d8b4fe'}`,
                    boxShadow: darkmode ? 'none' : '0 2px 4px rgba(139, 92, 246, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      color: darkmode ? '#a78bfa' : '#7c3aed',
                      marginBottom: '15px',
                      fontWeight: '600',
                      fontSize: '16px',
                    }}
                  >
                    🔵 Pressure Sensors
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {roomData.environmentSensors.pressure.map((sensor) => (
                      <div
                        key={sensor.id}
                        onClick={() => handleSensorClick({ ...sensor, type: 'pressure' })}
                        style={{
                          background: darkmode ? '#111827' : '#ffffff',
                          padding: '14px 16px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
                          flex: '1',
                          minWidth: '120px',
                          boxShadow: darkmode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = darkmode
                            ? '0 4px 12px rgba(0,0,0,0.3)'
                            : '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = darkmode
                            ? 'none'
                            : '0 1px 2px rgba(0,0,0,0.05)';
                        }}
                      >
                        <div
                          style={{
                            fontWeight: '600',
                            color: darkmode ? '#f3f4f6' : '#374151',
                            fontSize: '13px',
                          }}
                        >
                          {sensor.name}
                        </div>
                        <div
                          style={{
                            color: '#7c3aed',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            margin: '4px 0',
                          }}
                        >
                          {sensor.value}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: darkmode ? '#6b7280' : '#9ca3af',
                          }}
                        >
                          Click for graph →
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dust */}
              {roomData.environmentSensors.dust?.length > 0 && (
                <div
                  style={{
                    flex: '1',
                    minWidth: '280px',
                    background: darkmode
                      ? '#1f2937'
                      : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: `1px solid ${darkmode ? '#374151' : '#fecaca'}`,
                    boxShadow: darkmode ? 'none' : '0 2px 4px rgba(239, 68, 68, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      color: darkmode ? '#f87171' : '#dc2626',
                      marginBottom: '15px',
                      fontWeight: '600',
                      fontSize: '16px',
                    }}
                  >
                    🌫️ Dust Sensors
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {roomData.environmentSensors.dust.map((sensor) => (
                      <div
                        key={sensor.id}
                        onClick={() => handleSensorClick({ ...sensor, type: 'dust' })}
                        style={{
                          background: darkmode ? '#111827' : '#ffffff',
                          padding: '14px 16px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
                          flex: '1',
                          minWidth: '120px',
                          boxShadow: darkmode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = darkmode
                            ? '0 4px 12px rgba(0,0,0,0.3)'
                            : '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = darkmode
                            ? 'none'
                            : '0 1px 2px rgba(0,0,0,0.05)';
                        }}
                      >
                        <div
                          style={{
                            fontWeight: '600',
                            color: darkmode ? '#f3f4f6' : '#374151',
                            fontSize: '13px',
                          }}
                        >
                          {sensor.name}
                        </div>
                        <div
                          style={{
                            color: '#dc2626',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            margin: '4px 0',
                          }}
                        >
                          {sensor.value}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: darkmode ? '#6b7280' : '#9ca3af',
                          }}
                        >
                          Click for graph →
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Helium */}
              {roomData.environmentSensors.helium?.length > 0 && (
                <div
                  style={{
                    flex: '1',
                    minWidth: '280px',
                    background: darkmode
                      ? '#1f2937'
                      : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: `1px solid ${darkmode ? '#374151' : '#a7f3d0'}`,
                    boxShadow: darkmode ? 'none' : '0 2px 4px rgba(16, 185, 129, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      color: darkmode ? '#34d399' : '#059669',
                      marginBottom: '15px',
                      fontWeight: '600',
                      fontSize: '16px',
                    }}
                  >
                    🧪 Helium Level
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {roomData.environmentSensors.helium.map((sensor) => (
                      <div
                        key={sensor.id}
                        onClick={() => handleSensorClick({ ...sensor, type: 'helium' })}
                        style={{
                          background: darkmode ? '#111827' : '#ffffff',
                          padding: '14px 16px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
                          flex: '1',
                          minWidth: '120px',
                          boxShadow: darkmode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = darkmode
                            ? '0 4px 12px rgba(0,0,0,0.3)'
                            : '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = darkmode
                            ? 'none'
                            : '0 1px 2px rgba(0,0,0,0.05)';
                        }}
                      >
                        <div
                          style={{
                            fontWeight: '600',
                            color: darkmode ? '#f3f4f6' : '#374151',
                            fontSize: '13px',
                          }}
                        >
                          {sensor.name}
                        </div>
                        <div
                          style={{
                            color: '#059669',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            margin: '4px 0',
                          }}
                        >
                          {sensor.value}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: darkmode ? '#6b7280' : '#9ca3af',
                          }}
                        >
                          Click for graph →
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Power */}
              {roomData.environmentSensors.power?.length > 0 && (
                <div
                  style={{
                    flex: '1',
                    minWidth: '280px',
                    background: darkmode
                      ? '#1f2937'
                      : 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: `1px solid ${darkmode ? '#374151' : '#fde047'}`,
                    boxShadow: darkmode ? 'none' : '0 2px 4px rgba(234, 179, 8, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      color: darkmode ? '#facc15' : '#a16207',
                      marginBottom: '15px',
                      fontWeight: '600',
                      fontSize: '16px',
                    }}
                  >
                    ⚡ Power Monitors
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {roomData.environmentSensors.power.map((sensor) => (
                      <div
                        key={sensor.id}
                        onClick={() => handleSensorClick({ ...sensor, type: 'power' })}
                        style={{
                          background: darkmode ? '#111827' : '#ffffff',
                          padding: '14px 16px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
                          flex: '1',
                          minWidth: '120px',
                          boxShadow: darkmode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = darkmode
                            ? '0 4px 12px rgba(0,0,0,0.3)'
                            : '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = darkmode
                            ? 'none'
                            : '0 1px 2px rgba(0,0,0,0.05)';
                        }}
                      >
                        <div
                          style={{
                            fontWeight: '600',
                            color: darkmode ? '#f3f4f6' : '#374151',
                            fontSize: '13px',
                          }}
                        >
                          {sensor.name}
                        </div>
                        <div
                          style={{
                            color: '#ca8a04',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            margin: '4px 0',
                          }}
                        >
                          {sensor.value}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: darkmode ? '#6b7280' : '#9ca3af',
                          }}
                        >
                          Click for graph →
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Network */}
              {roomData.environmentSensors.network?.length > 0 && (
                <div
                  style={{
                    flex: '1',
                    minWidth: '280px',
                    background: darkmode
                      ? '#1f2937'
                      : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: `1px solid ${darkmode ? '#374151' : '#86efac'}`,
                    boxShadow: darkmode ? 'none' : '0 2px 4px rgba(34, 197, 94, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      color: darkmode ? '#4ade80' : '#16a34a',
                      marginBottom: '15px',
                      fontWeight: '600',
                      fontSize: '16px',
                    }}
                  >
                    🌐 Network Monitors
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {roomData.environmentSensors.network.map((sensor) => (
                      <div
                        key={sensor.id}
                        onClick={() => handleSensorClick({ ...sensor, type: 'network' })}
                        style={{
                          background: darkmode ? '#111827' : '#ffffff',
                          padding: '14px 16px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
                          flex: '1',
                          minWidth: '120px',
                          boxShadow: darkmode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = darkmode
                            ? '0 4px 12px rgba(0,0,0,0.3)'
                            : '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = darkmode
                            ? 'none'
                            : '0 1px 2px rgba(0,0,0,0.05)';
                        }}
                      >
                        <div
                          style={{
                            fontWeight: '600',
                            color: darkmode ? '#f3f4f6' : '#374151',
                            fontSize: '13px',
                          }}
                        >
                          {sensor.name}
                        </div>
                        <div
                          style={{
                            color: '#16a34a',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            margin: '4px 0',
                          }}
                        >
                          {sensor.value}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: darkmode ? '#6b7280' : '#9ca3af',
                          }}
                        >
                          Click for graph →
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Graph Modal */}
      {showGraphModal && selectedSensor && (
        <GraphModal
          sensor={selectedSensor}
          onClose={() => {
            setShowGraphModal(false);
            setSelectedSensor(null);
          }}
        />
      )}

      <div className="telemetry-back-btn-bottom" style={{ marginTop: '30px', textAlign: 'left' }}>
        <button
          onClick={handleBackClick}
          className="btn btn-warning btn-lg"
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          ← Back to Telemetry
        </button>
      </div>
    </ContentCard>
  );
};

export default TelemetryRoomDetail;
