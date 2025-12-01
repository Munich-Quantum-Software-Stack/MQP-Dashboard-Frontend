import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ContentCard from '@components/UI/Card/ContentCard';
import './Telemetry.scss';

const Telemetry = () => {
  const navigate = useNavigate();
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const page_header_fs = +fs * 2;
  const subtitle_fs = +fs * 1.3;
  const [hoveredCard, setHoveredCard] = useState(null);

  // Room data with SVG icons
  const rooms = [
    {
      id: 'warm-lab',
      name: 'Warm Lab (E.U.020)',
      description: 'Environment monitoring for the warm laboratory area',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      darkGradient: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
      icon: (
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
    },
    {
      id: 'cold-lab',
      name: 'Cold Lab (E.U.044)',
      description: 'Environment monitoring for the cryogenic laboratory area',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      darkGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
      icon: (
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
    },
    {
      id: 'compute-cube',
      name: 'Compute Cube (NSR1)',
      description: 'Environment monitoring for the quantum computing hardware',
      color: '#6b7280',
      gradient: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
      darkGradient: 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
      icon: (
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
    },
    {
      id: 'cloud',
      name: 'Cloud',
      description: 'Devices operating through our cloud',
      color: '#9ca3af',
      gradient: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      darkGradient: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)',
      icon: (
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
    },
  ];

  const handleRoomClick = (roomId) => {
    navigate(`/telemetry/${roomId}`);
  };

  return (
    <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
      <div className="telemetry-dashboard">
        <div className="telemetry-header">
          <h2 style={{ fontSize: page_header_fs }}>Telemetry Dashboard</h2>
          <p style={{ fontSize: subtitle_fs }} className="telemetry-subtitle">
            Select a room to view environment data and device telemetry:
          </p>
        </div>

        <div className="telemetry-grid">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`telemetry-room-card ${hoveredCard === room.id ? 'hovered' : ''} ${darkmode ? 'dark' : ''}`}
              onClick={() => handleRoomClick(room.id)}
              onMouseEnter={() => setHoveredCard(room.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                '--card-color': room.color,
                '--card-gradient': darkmode ? room.darkGradient : room.gradient,
              }}
            >
              <div className="card-icon">{room.icon}</div>
              <h3 className="card-title" style={{ fontSize: `${+fs * 1.15}px` }}>
                {room.name}
              </h3>
              <p className="card-description" style={{ fontSize: `${fs}px` }}>
                {room.description}
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

        <div className="telemetry-stats">
          <div className="stat-item">
            <span className="stat-number">4</span>
            <span className="stat-label">Monitored Locations</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24+</span>
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
      </div>
    </ContentCard>
  );
};

export default Telemetry;
