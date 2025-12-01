import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLoaderData } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { getAuthToken } from '@utils/auth';
import ContentCard from '@components/UI/Card/ContentCard';

import { queryClient } from '@utils/query';
import { fetchJob } from '@utils/jobs-http';
import { formatTimestampGMT } from '@utils/date-utils';

const JobDetail = () => {
  // Get job data loaded by the loader function
  const job = useLoaderData();

  // State for collapsible telemetry sections
  const [telemetryExpanded, setTelemetryExpanded] = useState(true);
  const [tempExpanded, setTempExpanded] = useState(true);
  const [floorSensorsExpanded, setFloorSensorsExpanded] = useState(false);
  const [wallSensorsExpanded, setWallSensorsExpanded] = useState(false);
  const [roofSensorsExpanded, setRoofSensorsExpanded] = useState(false);
  const [pressureExpanded, setPressureExpanded] = useState(false);
  const [humidityExpanded, setHumidityExpanded] = useState(false);
  const [dustExpanded, setDustExpanded] = useState(false);
  const [seismometersExpanded, setSeismometersExpanded] = useState(false);
  const [magnetometerExpanded, setMagnetometerExpanded] = useState(false);

  // State for selected telemetry items (checkbox selections)
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Get accessibility settings from Redux store
  const fs = useSelector((state) => state.accessibilities.font_size);
  const text_fs = +fs;
  const page_header_fs = +fs * 1.5;

  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const darkmode_class = darkmode ? 'dark_bg' : 'white_bg';

  const exportJobResultAsJSON = () => {
    const resultObj =
      job.result && typeof job.result === 'string' ? JSON.parse(job.result) : job.result || {};

    const formattedData = {
      id: job.id,
      status: job.status,
      note: job.note || job.status || '',
      shotsCount: job.shots || 0,
      circuitFormat: job.circuit_format || 'unknown',
      executedResource: job.executed_resource || job.target_specification || '',
      submittedDate: formatTimestampGMT(job.timestamp_submitted),
      scheduledDate: formatTimestampGMT(job.timestamp_scheduled),
      completedDate: formatTimestampGMT(job.timestamp_completed),
      cancelledDate: formatTimestampGMT(job.timestamp_cancelled),
      result: resultObj,
    };

    const jsonString = JSON.stringify(formattedData, null, 2);
    const downloadLink = document.createElement('a');
    const fileBlob = new Blob([jsonString], { type: 'application/json' });
    downloadLink.href = URL.createObjectURL(fileBlob);
    downloadLink.download = `result-job-${job.id}.json`;
    downloadLink.click();
  };

  // eslint-disable-next-line no-unused-vars
  const exportJobResultAsCSV = () => {
    const csvContent = [];

    // Add main job details
    csvContent.push(`ID\t${job.id}`);
    csvContent.push(`STATUS\t"${job.status}"`);
    csvContent.push(`Note\t"${job.note || job.status}"`);
    csvContent.push(`Shots count\t${job.shots || 0}`);
    csvContent.push(`Circuit format\t"${job.circuit_format || 'unknown'}"`);
    csvContent.push(
      `Executed Resource\t"${job.executed_resource || job.target_specification || ''}"`,
    );
    csvContent.push(`Submitted Date\t"${formatTimestampGMT(job.timestamp_submitted)}"`);
    csvContent.push(`Scheduled Date\t"${formatTimestampGMT(job.timestamp_scheduled)}"`);
    csvContent.push(`Completed Date\t"${formatTimestampGMT(job.timestamp_completed)}"`);
    csvContent.push(`Cancelled Date\t"${formatTimestampGMT(job.timestamp_cancelled)}"`);

    // Add results section
    if (job.result) {
      csvContent.push('Result');
      // Parse the result if it's a string
      const resultObj = typeof job.result === 'string' ? JSON.parse(job.result) : job.result;
      // Sort and format results
      Object.entries(resultObj)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([state, count]) => {
          csvContent.push(`${state}\t${count}`);
        });
    }

    const csvString = csvContent.join('\n');
    const link = document.createElement('a');
    const file = new Blob([csvString], { type: 'text/csv' });
    link.href = URL.createObjectURL(file);
    link.download = 'result-job-' + job.id + '.csv';
    link.click();
  };

  const tableRows = [
    { label: 'ID:', value: job.id },
    { label: 'Status:', value: job.status },
    { label: 'Note:', value: job.note },
    { label: 'Shots count:', value: job.shots },
    { label: 'Circuit Format:', value: job.circuit_format },
    {
      label: 'Executed Resource:',
      value: job.executed_resource || job.target_specification || '',
    },
    {
      label: 'Submitted Date:',
      value: formatTimestampGMT(job.timestamp_submitted),
    },
    {
      label: 'Scheduled Date:',
      value: formatTimestampGMT(job.timestamp_scheduled),
    },
    {
      label: 'Completed Date:',
      value: formatTimestampGMT(job.timestamp_completed),
    },
    {
      label: 'Cancelled Date:',
      value: formatTimestampGMT(job.timestamp_cancelled),
    },
    {
      label: 'Submitted Circuit:',
      value: <Link to={`circuit`}>Click here to view Submitted Circuit</Link>,
    },
    {
      label: 'Executed Circuit:',
      value: <Link to={`executed-circuit`}>Click here to view Executed Circuit</Link>,
    },
  ];

  // Mock telemetry data - replace with actual data from job when available
  const telemetryData = {
    temp: {
      floor: [
        { id: 'floor1', name: 'Floor Temp 1', value: '4.2K' },
        { id: 'floor2', name: 'Floor Temp 2', value: '4.1K' },
      ],
      wall: [
        { id: 'wall1', name: 'Wall Temp 1', value: '4.3K' },
        { id: 'wall2', name: 'Wall Temp 2', value: '4.2K' },
      ],
      roof: [
        { id: 'roof1', name: 'Roof Temp 1', value: '4.5K' },
        { id: 'roof2', name: 'Roof Temp 2', value: '4.4K' },
      ],
    },
    pressure: [
      { id: 'pressure1', name: 'Pressure 1', value: '1.2 mbar' },
      { id: 'pressureN', name: 'Pressure N', value: '0.8 mbar' },
    ],
    humidity: [
      { id: 'humidity1', name: 'Humidity 1', value: '45%' },
      { id: 'humidity2', name: 'Humidity 2', value: '42%' },
    ],
    dust: [
      { id: 'dust1', name: 'Dust 1', value: '0.02 µg/m³' },
      { id: 'dust2', name: 'Dust 2', value: '0.01 µg/m³' },
    ],
    seismometers: [
      { id: 'seismo1', name: 'Seismometer 1', value: '0.001g' },
      { id: 'seismo2', name: 'Seismometer 2', value: '0.002g' },
    ],
    magnetometer: [
      { id: 'mag1', name: 'Magnetometer 1', value: '0.5 µT' },
      { id: 'mag2', name: 'Magnetometer 2', value: '0.4 µT' },
    ],
  };

  // Get all child IDs for a parent
  const getChildIds = (parentId) => {
    const children = {
      telemetry: [
        'temp',
        'temp.floor',
        'temp.wall',
        'temp.roof',
        'floor1',
        'floor2',
        'wall1',
        'wall2',
        'roof1',
        'roof2',
        'pressure',
        'pressure1',
        'pressureN',
        'humidity',
        'humidity1',
        'humidity2',
        'dust',
        'dust1',
        'dust2',
        'seismometers',
        'seismo1',
        'seismo2',
        'magnetometer',
        'mag1',
        'mag2',
      ],
      temp: [
        'temp.floor',
        'temp.wall',
        'temp.roof',
        'floor1',
        'floor2',
        'wall1',
        'wall2',
        'roof1',
        'roof2',
      ],
      'temp.floor': ['floor1', 'floor2'],
      'temp.wall': ['wall1', 'wall2'],
      'temp.roof': ['roof1', 'roof2'],
      pressure: ['pressure1', 'pressureN'],
      humidity: ['humidity1', 'humidity2'],
      dust: ['dust1', 'dust2'],
      seismometers: ['seismo1', 'seismo2'],
      magnetometer: ['mag1', 'mag2'],
    };
    // eslint-disable-next-line security/detect-object-injection
    return children[parentId] || [];
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (itemId, hasChildren) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      const isCurrentlySelected = newSet.has(itemId);

      if (isCurrentlySelected) {
        // Unselect this item and all children
        newSet.delete(itemId);
        if (hasChildren) {
          getChildIds(itemId).forEach((childId) => newSet.delete(childId));
        }
      } else {
        // Select this item and all children
        newSet.add(itemId);
        if (hasChildren) {
          getChildIds(itemId).forEach((childId) => newSet.add(childId));
        }
      }
      return newSet;
    });
  };

  // Check if item is selected
  const isItemSelected = (itemId) => selectedItems.has(itemId);

  // Check if item is indeterminate (some children selected)
  const isIndeterminate = (itemId) => {
    const children = getChildIds(itemId);
    if (children.length === 0) return false;
    const selectedCount = children.filter((id) => selectedItems.has(id)).length;
    return selectedCount > 0 && selectedCount < children.length;
  };

  // Download selected telemetry data as JSON
  const downloadSelectedTelemetry = () => {
    const selectedData = {};

    // Check temp sensors
    if (
      selectedItems.has('temp') ||
      selectedItems.has('temp.floor') ||
      selectedItems.has('temp.wall') ||
      selectedItems.has('temp.roof')
    ) {
      selectedData.temp = {};
      if (
        selectedItems.has('temp.floor') ||
        selectedItems.has('floor1') ||
        selectedItems.has('floor2')
      ) {
        selectedData.temp.floor = telemetryData.temp.floor.filter(
          (item) =>
            selectedItems.has(item.id) ||
            selectedItems.has('temp.floor') ||
            selectedItems.has('temp') ||
            selectedItems.has('telemetry'),
        );
      }
      if (
        selectedItems.has('temp.wall') ||
        selectedItems.has('wall1') ||
        selectedItems.has('wall2')
      ) {
        selectedData.temp.wall = telemetryData.temp.wall.filter(
          (item) =>
            selectedItems.has(item.id) ||
            selectedItems.has('temp.wall') ||
            selectedItems.has('temp') ||
            selectedItems.has('telemetry'),
        );
      }
      if (
        selectedItems.has('temp.roof') ||
        selectedItems.has('roof1') ||
        selectedItems.has('roof2')
      ) {
        selectedData.temp.roof = telemetryData.temp.roof.filter(
          (item) =>
            selectedItems.has(item.id) ||
            selectedItems.has('temp.roof') ||
            selectedItems.has('temp') ||
            selectedItems.has('telemetry'),
        );
      }
    }

    // Check other sensors
    ['pressure', 'humidity', 'dust', 'seismometers', 'magnetometer'].forEach((category) => {
      // eslint-disable-next-line security/detect-object-injection
      const categoryItems = telemetryData[category].filter(
        (item) =>
          selectedItems.has(item.id) ||
          selectedItems.has(category) ||
          selectedItems.has('telemetry'),
      );
      if (categoryItems.length > 0) {
        // eslint-disable-next-line security/detect-object-injection
        selectedData[category] = categoryItems;
      }
    });

    if (Object.keys(selectedData).length === 0) {
      alert('Please select at least one telemetry item to download');
      return;
    }

    const jsonString = JSON.stringify(selectedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `telemetry-job-${job.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Collapsible tree item component with checkbox
  const TreeItem = ({ id, label, expanded, onToggle, children }) => {
    const hasChildren = !!children;
    const isChecked = isItemSelected(id);
    const indeterminate = isIndeterminate(id);

    return (
      <div style={{ marginLeft: hasChildren ? '0' : '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px 0',
          }}
        >
          {hasChildren && (
            <span
              style={{ marginRight: '8px', fontFamily: 'monospace', cursor: 'pointer' }}
              onClick={onToggle}
            >
              {expanded ? '▼' : '▶'}
            </span>
          )}
          <input
            type="checkbox"
            checked={isChecked}
            ref={(el) => {
              if (el) el.indeterminate = indeterminate;
            }}
            onChange={() => handleCheckboxChange(id, hasChildren)}
            style={{ marginRight: '8px', cursor: 'pointer' }}
          />
          <span
            style={{ cursor: hasChildren ? 'pointer' : 'default' }}
            onClick={hasChildren ? onToggle : undefined}
          >
            {label}
          </span>
        </div>
        {expanded && children && <div style={{ marginLeft: '20px' }}>{children}</div>}
      </div>
    );
  };

  // Telemetry section component
  const TelemetrySection = () => {
    return (
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginTop: '20px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        {/* Telemetry Tree */}
        <div
          style={{
            flex: '1',
            minWidth: '280px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '15px',
            display: 'flex',
            backgroundColor: darkmode ? '#1a1a1a' : '#fff',
            color: darkmode ? '#fff' : '#000',
          }}
        >
          {/* Tree Content */}
          <div
            className="telemetry-tree-scroll"
            style={{
              flex: 1,
              maxHeight: '200px',
              overflowY: 'scroll',
              overflowX: 'hidden',
              paddingRight: '8px',
            }}
          >
            <style>
              {`
              .telemetry-tree-scroll::-webkit-scrollbar {
                width: 8px;
              }
              .telemetry-tree-scroll::-webkit-scrollbar-track {
                background: ${darkmode ? '#222' : '#f1f1f1'};
                border-radius: 4px;
              }
              .telemetry-tree-scroll::-webkit-scrollbar-thumb {
                background: ${darkmode ? '#666' : '#888'};
                border-radius: 4px;
              }
              .telemetry-tree-scroll::-webkit-scrollbar-thumb:hover {
                background: ${darkmode ? '#888' : '#555'};
              }
            `}
            </style>
            <div className="telemetry-tree-scroll" style={{ height: '100%' }}>
              <TreeItem
                id="telemetry"
                label="Telemetry"
                expanded={telemetryExpanded}
                onToggle={() => setTelemetryExpanded(!telemetryExpanded)}
              >
                <TreeItem
                  id="temp"
                  label="Temp"
                  expanded={tempExpanded}
                  onToggle={() => setTempExpanded(!tempExpanded)}
                >
                  <TreeItem
                    id="temp.floor"
                    label="Floor Sensors"
                    expanded={floorSensorsExpanded}
                    onToggle={() => setFloorSensorsExpanded(!floorSensorsExpanded)}
                  >
                    {telemetryData.temp.floor.map((item) => (
                      <TreeItem key={item.id} id={item.id} label={item.name} />
                    ))}
                  </TreeItem>
                  <TreeItem
                    id="temp.wall"
                    label="Wall Sensors"
                    expanded={wallSensorsExpanded}
                    onToggle={() => setWallSensorsExpanded(!wallSensorsExpanded)}
                  >
                    {telemetryData.temp.wall.map((item) => (
                      <TreeItem key={item.id} id={item.id} label={item.name} />
                    ))}
                  </TreeItem>
                  <TreeItem
                    id="temp.roof"
                    label="Roof Sensors"
                    expanded={roofSensorsExpanded}
                    onToggle={() => setRoofSensorsExpanded(!roofSensorsExpanded)}
                  >
                    {telemetryData.temp.roof.map((item) => (
                      <TreeItem key={item.id} id={item.id} label={item.name} />
                    ))}
                  </TreeItem>
                </TreeItem>

                <TreeItem
                  id="pressure"
                  label="Pressure"
                  expanded={pressureExpanded}
                  onToggle={() => setPressureExpanded(!pressureExpanded)}
                >
                  {telemetryData.pressure.map((item) => (
                    <TreeItem key={item.id} id={item.id} label={item.name} />
                  ))}
                </TreeItem>

                <TreeItem
                  id="humidity"
                  label="Humidity"
                  expanded={humidityExpanded}
                  onToggle={() => setHumidityExpanded(!humidityExpanded)}
                >
                  {telemetryData.humidity.map((item) => (
                    <TreeItem key={item.id} id={item.id} label={item.name} />
                  ))}
                </TreeItem>

                <TreeItem
                  id="dust"
                  label="Dust"
                  expanded={dustExpanded}
                  onToggle={() => setDustExpanded(!dustExpanded)}
                >
                  {telemetryData.dust.map((item) => (
                    <TreeItem key={item.id} id={item.id} label={item.name} />
                  ))}
                </TreeItem>

                <TreeItem
                  id="seismometers"
                  label="Seismometers"
                  expanded={seismometersExpanded}
                  onToggle={() => setSeismometersExpanded(!seismometersExpanded)}
                >
                  {telemetryData.seismometers.map((item) => (
                    <TreeItem key={item.id} id={item.id} label={item.name} />
                  ))}
                </TreeItem>

                <TreeItem
                  id="magnetometer"
                  label="Magnetometer"
                  expanded={magnetometerExpanded}
                  onToggle={() => setMagnetometerExpanded(!magnetometerExpanded)}
                >
                  {telemetryData.magnetometer.map((item) => (
                    <TreeItem key={item.id} id={item.id} label={item.name} />
                  ))}
                </TreeItem>
              </TreeItem>
            </div>
          </div>

          {/* Download Button */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              marginLeft: '10px',
            }}
          >
            <button
              onClick={downloadSelectedTelemetry}
              style={{
                padding: '8px 12px',
                backgroundColor: darkmode ? '#4a90d9' : '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                whiteSpace: 'nowrap',
              }}
            >
              ⬇ Download JSON
            </button>
          </div>
        </div>

        {/* Metadata from Device */}
        <div
          style={{
            flex: '1',
            minWidth: '200px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '15px',
          }}
        >
          <h5 style={{ marginBottom: '15px', fontWeight: 'bold' }}>metadata from device</h5>
          <p style={{ marginBottom: '10px' }}>topology</p>
          <p style={{ marginBottom: '10px' }}>fidelity</p>
          <p style={{ marginBottom: '20px' }}>...</p>
          <p style={{ fontStyle: 'italic', color: '#666' }}>Ask Burak for additional details</p>
        </div>

        {/* Metadata from Compilation */}
        <div
          style={{
            flex: '1',
            minWidth: '200px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '15px',
          }}
        >
          <h5 style={{ marginBottom: '15px', fontWeight: 'bold' }}>metadata from compilation</h5>
          <p style={{ marginBottom: '10px' }}>exec time for each pass</p>
          <p style={{ marginBottom: '10px' }}>passes applied</p>
          <p style={{ marginBottom: '20px' }}>...</p>
          <p style={{ fontStyle: 'italic', color: '#666' }}>Ask Burak for additional details</p>
        </div>
      </div>
    );
  };

  const tableRowsBottom = [
    { label: 'Cost:', value: job.cost },
    { label: 'Budget:', value: job.budget },
    { label: 'Target Specification:', value: job.target_specification },
    { label: 'Token Usage:', value: job.token_usage },
  ];

  return (
    <ContentCard>
      {/* Page title with dynamic font size */}
      <h4 style={{ fontSize: page_header_fs }}>Detail of job {job.id}</h4>

      {/* Main content container with dark/light mode styling */}
      <div className={`job_detail_container ${darkmode_class} `}>
        <Table
          responsive
          bordered
          striped
          variant={`${darkmode ? 'dark' : 'light'} `}
          className="mb-0 job_property"
          style={{ fontSize: text_fs }}
        >
          <tbody>
            {/* Map through the tableRows array to render each row */}
            {tableRows.map((row, index) => (
              <tr key={index}>
                <th>{row.label}</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Telemetry Section */}
        <TelemetrySection />

        {/* Download buttons */}
        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            onClick={exportJobResultAsJSON}
            style={{
              backgroundColor: '#f8d052',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 20px',
              marginRight: '10px',
              fontWeight: 'bold',
            }}
          >
            Download report JSON
          </button>
          <button
            type="button"
            onClick={exportJobResultAsCSV}
            style={{
              backgroundColor: '#87CEEB',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 20px',
              fontWeight: 'bold',
            }}
          >
            Download report CSV
          </button>
        </div>

        {/* Bottom table rows */}
        <Table
          responsive
          bordered
          striped
          variant={`${darkmode ? 'dark' : 'light'} `}
          className="mb-0 job_property"
          style={{ fontSize: text_fs }}
        >
          <tbody>
            {tableRowsBottom.map((row, index) => (
              <tr key={index}>
                <th>{row.label}</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Navigation section with back button */}
      <div className="job_detail_actions mt-5">
        <Link
          className="job_detail_btn dashboard_btn back_btn"
          to=".."
          relative="path"
          style={{
            fontSize: text_fs,
            backgroundColor: '#f8d052',
            border: 'none',
            borderRadius: '50px',
            padding: '8px 20px',
            fontWeight: 'bold',
            display: 'inline-block',
            textDecoration: 'none',
            color: 'black',
          }}
        >
          &lt;&lt; Back
        </Link>
      </div>
    </ContentCard>
  );
};

export default JobDetail;

/**
 * Data loader function for the JobDetail component
 * This is called by React Router before rendering the component
 *
 * @param {Object} params - URL parameters including jobId
 * @returns {Promise<Object>} - The job data object
 */
export async function loader({ params }) {
  // Get authentication token for API request
  const access_token = getAuthToken();

  // Fetch job data using React Query
  const job = await queryClient.fetchQuery({
    queryKey: ['jobs', params.jobId],
    queryFn: ({ signal }) => fetchJob({ signal, access_token, id: params.jobId }),
  });

  if (job.no_modify !== undefined) delete job.no_modify;
  if (job.No_Modify !== undefined) delete job.No_Modify;
  if (job['No Modify'] !== undefined) delete job['No Modify'];

  return job;
}
