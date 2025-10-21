// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import ContentCard from '../../UI/Card/ContentCard';
// import './Telemetry.scss';
// 
// const Telemetry = () => {
//     const navigate = useNavigate();
//     const darkmode = useSelector((state) => state.accessibilities.darkmode);
//     const fs = useSelector((state) => state.accessibilities.font_size);
//     const page_header_fs = +fs * 1.5;
//     const subtitle_fs = +fs * 1.1;
// 
//     // Room data
//     const rooms = [
//         {
//             id: "warm-lab",
//             name: "Warm Lab (E.U.020)",
//             icon: "🔆",
//             description: "Environment monitoring for the warm laboratory area"
//         },
//         {
//             id: "cold-lab",
//             name: "Cold Lab (E.U.044)",
//             icon: "❄️",
//             description: "Environment monitoring for the cryogenic laboratory area"
//         },
//         {
//             id: "compute-cube",
//             name: "Compute Cube (NSR1)",
//             icon: "🖥️",
//             description: "Environment monitoring for the quantum computing hardware"
//         },
//         {
//             id: "cloud",
//             name: "Cloud",
//             icon: "☁️",
//             description: "Devices operating through our cloud"
//         }
//     ];
// 
//     // Card and container styles to match reference image
//     const cardContainerStyle = {
//         display: 'flex',
//         flexWrap: 'wrap',
//         gap: '20px',
//         padding: '20px 0'
//     };
// 
//     const cardStyle = {
//         flex: '1 1 250px',
//         minWidth: '250px',
//         maxWidth: '300px',
//         borderRadius: '8px',
//         padding: '20px',
//         background: 'white',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//         cursor: 'pointer',
//         transition: 'transform 0.2s ease, box-shadow 0.2s ease',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         textAlign: 'center'
//     };
// 
//     const iconStyle = {
//         fontSize: '48px',
//         marginBottom: '15px'
//     };
// 
//     const titleStyle = {
//         fontSize: `${+fs * 1.2}px`,
//         fontWeight: '500',
//         margin: '0 0 10px 0',
//         color: '#333'
//     };
// 
//     const descriptionStyle = {
//         fontSize: `${fs}px`,
//         color: '#666',
//         margin: 0
//     };
// 
//     const handleRoomClick = (roomId) => {
//         console.log("Navigating to room:", roomId);
//         navigate(`/telemetry/${roomId}`);
//     };
// 
//     return (
//         <ContentCard className={`${darkmode ? "dark_bg" : "white_bg"}`}>
//             <div className="telemetry-dashboard">
//                 <h2 style={{ fontSize: page_header_fs }}>Telemetry Dashboard</h2>
//                 <p style={{ fontSize: subtitle_fs, marginBottom: '20px' }}>
//                     Select a room to view environment data and device telemetry:
//                 </p>
//                 
//                 <div style={cardContainerStyle}>
//                     {rooms.map((room) => (
//                         <div 
//                             key={room.id}
//                             style={cardStyle}
//                             className="telemetry-room-card"
//                             onClick={() => handleRoomClick(room.id)}
//                         >
//                             <div style={iconStyle}>
//                                 {room.icon}
//                             </div>
//                             <h3 style={titleStyle}>{room.name}</h3>
//                             <p style={descriptionStyle}>{room.description}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </ContentCard>
//     );
// };
// 
// export default Telemetry;

// Active placeholder component
import React from 'react';

const Telemetry = () => {
    return <React.Fragment />;
};

export default Telemetry;
