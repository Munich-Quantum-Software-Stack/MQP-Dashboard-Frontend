// TelemetryRoomDetail.js - All functionality commented out but code preserved
import React from "react";
import { useParams } from "react-router-dom";
import ContentCard from '../../UI/Card/ContentCard';
import { useSelector } from 'react-redux';

// Placeholder component that replaces the original TelemetryRoomDetail component
const TelemetryRoomDetail = () => {
  const { roomId } = useParams();
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  
  return (
    <ContentCard className={`${darkmode ? "dark_bg" : "white_bg"}`}>
      <h2>Telemetry Room Detail (Currently Unavailable)</h2>
      <p>The telemetry room detail view is currently not available.</p>
      <p>Room ID: {roomId}</p>
    </ContentCard>
  );
};

export default TelemetryRoomDetail;

// Below is the original commented out code:
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import ContentCard from '../../UI/Card/ContentCard';
// import LoadingIndicator from '../../UI/LoadingIndicator';
// import ErrorBlock from '../../UI/MessageBox/ErrorBlock';
// import './Telemetry.scss';
// import '../Resources/Resources.scss'; 
// import './TelemetryResources.scss';
// 
// const TelemetryRoomDetail = () => {
//     const { roomId } = useParams();
//     console.log("Room ID from URL params:", roomId); // Debug log
//     
//     const navigate = useNavigate();
//     const darkmode = useSelector((state) => state.accessibilities.darkmode);
//     const fs = useSelector((state) => state.accessibilities.font_size);
//     const page_header_fs = +fs * 1.5;
//     const text_fs = +fs;
//     
//     const quantumCardStyle = {
//         backgroundColor: '#f9e8d9', 
//         borderRadius: '4px',
//         padding: '20px',
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//     };
//     
//     const cardTitleStyle = {
//         fontSize: `${text_fs * 1.5}px`,
//         fontWeight: '700',
//         marginBottom: '5px',
//         color: '#000'
//     };
//     
//     const cardDividerStyle = {
//         width: '40px',
//         height: '2px',
//         backgroundColor: '#DE5215', 
//         marginBottom: '16px'
//     };
//     
//     const statusDotStyle = {
//         width: '12px',
//         height: '12px',
//         borderRadius: '50%',
//         backgroundColor: '#5cb85c', 
//         display: 'inline-block',
//         marginRight: '8px'
//     };
//     
//     const propertyLabelStyle = {
//         fontWeight: '500',
//         marginRight: '5px',
//         fontSize: `${text_fs}px`
//     };
// 
//     const [roomData, setRoomData] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
// 
//     // Room data object - Defining outside of useEffect to ensure it's available throughout the component
//     const roomsData = {
//         "warm-lab": {
//             name: "Warm Lab (E.U.020)",
//             icon: "🔆",
//             quantumDevices: [
//                 {
//                     id: "warm-qexa20",
//                     name: "QExa20",
//                     vendor: "IQM",
//                     fidelity: "98.5%",
//                     qubits: 20,
//                     topology: "Super Conducting",
//                     passes: ["Decomposition", "Mapping", "Optimization"],
//                     times: {
//                         avg_compilation: "1.8s",
//                         avg_execution: "0.9s",
//                         uptime: "99.1%"
//                     }
//                 }
//             ],
//             environmentDevices: [
//                 { id: "temp-warm-1", name: "Temperature Sensor 1", type: "temperature" },
//                 { id: "temp-warm-2", name: "Temperature Sensor 2", type: "temperature" },
//                 { id: "humid-warm-1", name: "Humidity Sensor 1", type: "humidity" },
//                 { id: "pressure-warm-1", name: "Pressure Sensor 1", type: "pressure" }
//             ]
//         },
//         "cold-lab": {
//             name: "Cold Lab (E.U.044)",
//             icon: "❄️",
//             quantumDevices: [
//                 {
//                     id: "daqc-q5",
//                     name: "QExa20",
//                     vendor: "IQM",
//                     fidelity: "98.5%",
//                     qubits: 20,
//                     topology: "Super Conducting",
//                     passes: ["Decomposition", "Mapping", "Optimization"],
//                     times: {
//                         avg_compilation: "1.8s",
//                         avg_execution: "0.9s",
//                         uptime: "99.1%"
//                     }
//                 },
//                 {
//                     id: "daqc-q20",
//                     name: "Q5",
//                     vendor: "IQM",
//                     fidelity: "97.2%",
//                     qubits: 5,
//                     topology: "Super Conducting",
//                     passes: ["Decomposition", "Mapping", "Optimization"],
//                     times: {
//                         avg_compilation: "2.8s",
//                         avg_execution: "1.2s",
//                         uptime: "98.4%"
//                     }
//                 },
//                 {
//                     id: "marmot-aqt",
//                     name: "Q20",
//                     vendor: "IQM",
//                     fidelity: "99.4%",
//                     qubits: 20,
//                     topology: "Super Conducting",
//                     passes: ["Decomposition", "Mapping", "Optimization", "Error mitigation"],
//                     times: {
//                         avg_compilation: "3.7s",
//                         avg_execution: "0.9s",
//                         uptime: "97.6%"
//                     }
//                 }
//             ],
//             environmentDevices: [
//                 { id: "temp-cold-1", name: "Temperature Sensor 1", type: "temperature" },
//                 { id: "temp-cold-2", name: "Temperature Sensor 2", type: "temperature" },
//                 { id: "temp-cold-3", name: "Temperature Sensor 3", type: "temperature" },
//                 { id: "pressure-cold-1", name: "Pressure Sensor 1", type: "pressure" },
//                 { id: "he-level", name: "Helium Level Sensor", type: "level" }
//             ]
//         },
//         "compute-cube": {
//             name: "Compute Cube (NSR1)",
//             icon: "🖥️",
//             quantumDevices: [
//                 {
//                     id: "q-exa",
//                     name: "QExa20",
//                     vendor: "IQM",
//                     fidelity: "99.2%",
//                     qubits: 20,
//                     topology: "Super Conducting",
//                     passes: ["Optimization", "Routing", "Scheduling"],
//                     times: {
//                         avg_compilation: "3.2s",
//                         avg_execution: "0.5s",
//                         uptime: "98.7%"
//                     }
//                 },
//                 {
//                     id: "euro-q-exa",
//                     name: "Q5",
//                     vendor: "IQM",
//                     fidelity: "98.7%",
//                     qubits: 5,
//                     topology: "Super Conducting",
//                     passes: ["Gate fusion", "Routing", "Scheduling"],
//                     times: {
//                         avg_compilation: "2.5s",
//                         avg_execution: "0.8s",
//                         uptime: "96.2%"
//                     }
//                 },
//                 {
//                     id: "qaptiva-800",
//                     name: "Q20",
//                     vendor: "IQM",
//                     fidelity: "97.8%",
//                     qubits: 20,
//                     topology: "Super Conducting",
//                     passes: ["Optimization", "Translation", "Scheduling"],
//                     times: {
//                         avg_compilation: "4.1s",
//                         avg_execution: "0.7s",
//                         uptime: "92.3%"
//                     }
//                 }
//             ],
//             environmentDevices: [
//                 { id: "temp-cc-1", name: "Temperature Sensor 1", type: "temperature" },
//                 { id: "temp-cc-2", name: "Temperature Sensor 2", type: "temperature" },
//                 { id: "humid-cc-1", name: "Humidity Sensor 1", type: "humidity" },
//                 { id: "power-cc-1", name: "Power Monitor", type: "power" }
//             ]
//         },
//         "cloud": {
//             name: "Cloud",
//             icon: "☁️",
//             quantumDevices: [
//                 {
//                     id: "maqcs",
//                     name: "QExa20",
//                     vendor: "IQM",
//                     fidelity: "98.5%",
//                     qubits: 20,
//                     topology: "Super Conducting",
//                     passes: ["Decomposition", "Mapping", "Optimization"],
//                     times: {
//                         avg_compilation: "1.8s",
//                         avg_execution: "0.9s",
//                         uptime: "99.1%"
//                     }
//                 },
//                 {
//                     id: "munichqc-atoms",
//                     name: "Q5",
//                     vendor: "IQM",
//                     fidelity: "97.2%",
//                     qubits: 5,
//                     topology: "Super Conducting",
//                     passes: ["Decomposition", "Mapping", "Optimization"],
//                     times: {
//                         avg_compilation: "2.8s",
//                         avg_execution: "1.2s",
//                         uptime: "98.4%"
//                     }
//                 },
//             ],
//             environmentDevices: [
//                 { id: "temp-cold-1", name: "Temperature Sensor 1", type: "temperature" },
//                 { id: "temp-cold-2", name: "Temperature Sensor 2", type: "temperature" },
//                 { id: "temp-cold-3", name: "Temperature Sensor 3", type: "temperature" },
//                 { id: "pressure-cold-1", name: "Pressure Sensor 1", type: "pressure" },
//                 { id: "he-level", name: "Helium Level Sensor", type: "level" }
//             ]
//         }
//     };
// 
//     useEffect(() => {
//         console.log("useEffect triggered, roomId:", roomId);
//         console.log("Available rooms:", Object.keys(roomsData));
//         
//         setIsLoading(true);
//         setError(null);
//         
//         // Directly load the room data without try/catch in a setTimeout
//         const room = roomsData[roomId];
//         console.log("Found room data:", room);
//         
//         if (!room) {
//             console.error("Room not found for ID:", roomId);
//             setError('Room not found. Please select a valid room.');
//             setIsLoading(false);
//             return;
//         }
//         
//         // Short timeout just for a smoother UX transition
//         setTimeout(() => {
//             setRoomData(room);
//             setIsLoading(false);
//             console.log("Room data loaded successfully");
//         }, 300);
//         
//     }, [roomId]);
// 
//     const handleBackClick = () => {
//         navigate('/telemetry');
//     };
// 
//     if (isLoading) {
//         return (
//             <ContentCard className={`${darkmode ? "dark_bg" : "white_bg"}`}>
//                 <LoadingIndicator />
//                 <p>Loading room details...</p>
//             </ContentCard>
//         );
//     }
// 
//     if (error || !roomData) {
//         return (
//             <ContentCard className={`${darkmode ? "dark_bg" : "white_bg"}`}>
//                 <ErrorBlock 
//                     title="Failed to load room details" 
//                     message={error || "Room not found"}
//                 />
//                 <div className="telemetry-back-btn-bottom">
//                     <button 
//                         onClick={handleBackClick}
//                         className="btn btn-secondary"
//                     >
//                         ← Back to Telemetry
//                     </button>
//                 </div>
//             </ContentCard>
//         );
//     }
// 
//     return (
//         <ContentCard className={`${darkmode ? "dark_bg" : "white_bg"}`}>
//             <div className="room-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
//                 <h2 style={{ fontSize: page_header_fs, margin: 0 }}>
//                     <span className="room-icon mr-2">{roomData.icon}</span>
//                     {roomData.name}
//                 </h2>
//             </div>
//             {/* Quantum Devices Section */}
//             {roomData.quantumDevices.length > 0 && (
//                 <div>
//                     <h3>Quantum Devices</h3>
//                     <div className="resources_list" style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
//                         {roomData.quantumDevices.map(device => (
//                             <div
//                                 key={device.id}
//                                 className="resource_item_wrap"
//                                 style={{ minWidth: "340px", maxWidth: "400px", flex: "1 1 340px" }}
//                             >
//                                 <div style={quantumCardStyle} className="quantum-resource-card">
//                                     {/* Header section with device name and vendor */}
//                                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
//                                         <div>
//                                             <h2 style={cardTitleStyle}>{device.name}</h2>
//                                             <div style={cardDividerStyle}></div>
//                                         </div>
//                                         {device.vendor && (
//                                             <div style={{ fontWeight: '500', fontSize: `${text_fs}px` }}>
//                                                 {device.vendor}
//                                             </div>
//                                         )}
//                                     </div>
//                                     
//                                     {/* Status indicator */}
//                                     <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//                                         <span style={statusDotStyle}></span>
//                                         <span style={{ fontSize: `${text_fs}px` }}>Online</span>
//                                     </div>
//                                     
//                                     {/* Device information */}
//                                     <div style={{ marginBottom: '10px' }}>
//                                         <div style={{ marginBottom: '8px' }}>
//                                             <span style={propertyLabelStyle}>Qubits:</span>
//                                             <span style={{ fontSize: `${text_fs}px` }}>{device.qubits}</span>
//                                         </div>
//                                         
//                                         <div style={{ marginBottom: '8px' }}>
//                                             <span style={propertyLabelStyle}>Quantum Technology:</span>
//                                             <span style={{ fontStyle: 'italic', fontSize: `${text_fs}px` }}>{device.topology}</span>
//                                         </div>
//                                     </div>
//                                     
//                                     {/* Additional details that can be shown in expanded view */}
//                                     <div>
//                                         <div style={{ marginBottom: '8px' }}>
//                                             <span style={propertyLabelStyle}>Fidelity:</span>
//                                             <span style={{ fontSize: `${text_fs}px` }}>{device.fidelity}</span>
//                                         </div>
//                                         <div style={{ marginBottom: '8px', display: 'none' }}>
//                                             <span style={propertyLabelStyle}>Passes:</span>
//                                             <span style={{ fontSize: `${text_fs}px` }}>{device.passes.join(", ")}</span>
//                                         </div>
//                                         <div style={{ marginBottom: '8px', display: 'none' }}>
//                                             <span style={propertyLabelStyle}>Avg. Compilation:</span>
//                                             <span style={{ fontSize: `${text_fs}px` }}>{device.times.avg_compilation}</span>
//                                         </div>
//                                         <div style={{ marginBottom: '8px', display: 'none' }}>
//                                             <span style={propertyLabelStyle}>Avg. Execution:</span>
//                                             <span style={{ fontSize: `${text_fs}px` }}>{device.times.avg_execution}</span>
//                                         </div>
//                                         <div style={{ marginBottom: '8px', display: 'none' }}>
//                                             <span style={propertyLabelStyle}>Uptime:</span>
//                                             <span style={{ fontSize: `${text_fs}px` }}>{device.times.uptime}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//             
//             <div className="mt-4">
//                 <h3>Environment Monitoring</h3>
//                 <div className="row">
//                     {roomData.environmentDevices.map(device => (
//                         <div key={device.id} className="col-md-3 mb-3">
//                             <div className={`env-sensor-card p-3 device-${device.id} ${darkmode ? "dark_card" : "light_card"}`}>
//                                 <h4>{device.name}</h4>
//                                 <p><strong>Type:</strong> {device.type}</p>
//                                 <p><strong>Status:</strong> <span className="badge bg-success">Active</span></p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//            
//             <div className="telemetry-back-btn-bottom" style={{ marginTop: '30px', textAlign: 'center' }}>
//                 <button 
//                     onClick={handleBackClick}
//                     className="btn btn-warning btn-lg"
//                     style={{ padding: '10px 20px', fontSize: '16px' }}
//                 >
//                     ← Back to Telemetry
//                 </button>
//             </div>
//         </ContentCard>
//     );
// };
// export default TelemetryRoomDetail;
