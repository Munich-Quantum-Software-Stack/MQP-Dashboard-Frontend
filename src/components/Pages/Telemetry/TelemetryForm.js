import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import ErrorBlock from '@components/UI/MessageBox/ErrorBlock';
import LoadingIndicator from '@components/UI/LoadingIndicator';
import { getAuthToken } from '@utils/auth';
import Button from '@components/UI/Button/Button';
import Checkbox from '@components/UI/Checkbox/Checkbox';
import AlertCard from '@components/UI/MessageBox/AlertCard';
import { registerLocale, setDefaultLocale, DatePicker } from 'react-datepicker';
import de from 'date-fns/locale/de';
import { fetchTelemetryData } from '@components/utils/telemetry-http';
import { queryClient } from '@utils/query';
import TelemetryData from './TelemetryData_withoutFetching';
// import ToggleMeasurementButton from './ToggleMeasurementButton';

registerLocale('de', de);
setDefaultLocale('de');

const TelemetryForm = ({ measurements }) => {
  const access_token = getAuthToken();
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  // const text_fs = +fs;
  const page_header_fs = +fs * 1.5;
  const currentDate = new Date();
  const minDateCalendar = '01.01.2023';
  const current_timestamp = currentDate.getTime();
  // format time to HH:mm:ss
  const currentTime = currentDate.toLocaleTimeString();
  const _10m_ago = current_timestamp - 600000;
  const _10m_ago_from_currentTime = new Date(_10m_ago).toLocaleTimeString();
  // initial checkboxes
  const initial_measurement_checkboxes = [];
  measurements.forEach((m_item) => {
    initial_measurement_checkboxes.push({ measurement: m_item.measurement, checked: false });
  });
  const initial_sensor_checkboxes = [];
  measurements.forEach((m_item) => {
    const sensors = m_item['sensors'];
    sensors.forEach((sensor_id) => {
      initial_sensor_checkboxes.push({
        measurement: m_item.measurement,
        id: sensor_id,
        checked: false,
      });
    });
  });

  // Define variables
  // const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [fromDateValue, setFromDateValue] = useState(currentDate);
  const [fromTimeValue, setFromTimeValue] = useState(_10m_ago_from_currentTime);
  const [toDateValue, setToDateValue] = useState(currentDate);
  const [toTimeValue, setToTimeValue] = useState(currentTime);
  const [selectGroupByValue, setSelectGroupByValue] = useState('30s');
  const [groupByValue, setGroupByValue] = useState('30s');
  const [measurementCheckboxes, setMeasurementCheckboxes] = useState(
    initial_measurement_checkboxes,
  );
  const [sensorCheckboxes, setSensorCheckboxes] = useState(initial_sensor_checkboxes);
  //const [measurementIsChecked, setMeasurementIsChecked] = useState(false);

  // Fetching data (must be 1st order)
  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: fetchTelemetryData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telemetry'] });
    },
  });

  // Capitalized first letter when displaying data
  const setCapitalizedName = (name) => {
    return String(name).charAt(0).toUpperCase() + String(name).slice(1);
  };

  // Validate time inputs
  const convertToTimestamp = (enterredDate, enterredTime) => {
    const [day, month, year] = enterredDate.split('.');
    const [hour, minute, second] = enterredTime.split(':');
    const inputDateTime = new Date(+year, +month - 1, +day, +hour, +minute, +second);
    return inputDateTime.getTime();
  };

  // Toggle checkbox of measurement item
  // const toggleSelectAllSensorsOfMeasurementHandler = (measurement) => {
  //     //setCheckedSelectAll(!checkedSelectAll);
  //     // TODO: update checked status of all sensors
  //     const measurement_sensors = sensor_checkbox_inputs.filter((sensor) => sensor.measurement === measurement);
  //     setSelectAllSensorsOfMeasurement();

  // }
  // Toggle checkbox of sensor item
  const sensorCheckboxHandle = (sensor_item) => {
    setSensorCheckboxes((prev) =>
      prev.map((item) => (item.id === sensor_item.id ? { ...item, checked: !item.checked } : item)),
    );
  };

  // Show/Hide sensors of selected measurement
  const measurementCheckboxHandler = (measurement_item) => {
    //const updated = measurement_checkbox_inputs.map(item => item.measurement === measurement_item.measurement ? {...item, checked: !item.checked} : item);
    setMeasurementCheckboxes((prev) =>
      prev.map((item) =>
        item.measurement === measurement_item.measurement
          ? { ...item, checked: !item.checked }
          : item,
      ),
    );
  };

  // const toggleSelectAllMeasurementHandler = () => {};

  // Handle form submitting
  const telemetryFormHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);
    const [from_date, from_time, to_date, to_time] = [
      formData.get('from_date'),
      formData.get('from_time'),
      formData.get('to_date'),
      formData.get('to_time'),
    ];
    const from_timestamp = convertToTimestamp(from_date, from_time);
    const to_timestamp = convertToTimestamp(to_date, to_time);

    if (from_timestamp > current_timestamp || to_timestamp > current_timestamp) {
      setValidationError('Cannot get time in future!!!');
      setIsSubmitting(false);
      return;
    }
    if (from_timestamp > to_timestamp) {
      setValidationError('From timestamp must be smaller than to timestamp! Please try again!');
      setIsSubmitting(false);
      return;
    }

    // telemetryFormData
    const telemetryFormData = {
      measurements: formData.getAll('measurements[]'),
      sensors: formData.getAll('sensors[]'),
      from_timestamp: from_timestamp,
      to_timestamp: to_timestamp,
      groupBy: groupByValue,
    };
    mutate({ telemetryFormData, access_token });
    setIsSubmitting(false);
    event.target.reset();
  };

  let telemetryData = '';
  if (isError) {
    telemetryData = <ErrorBlock title={error.message} message={error.code} />;
    return telemetryData;
  }

  if (isPending) {
    telemetryData = <LoadingIndicator>Loading...</LoadingIndicator>;
    return telemetryData;
  }

  if (data) {
    telemetryData = <TelemetryData filename={data.filename} filesize={data.filesize} />;
    return telemetryData;
  }

  return (
    <React.Fragment>
      <div className={`telemetry_form_wrap ${darkmode ? 'dark_bg' : 'white_bg'}`}>
        <h4 className="page_header" style={{ fontSize: page_header_fs }}>
          Telemetry
        </h4>
        <form
          className="telemetryForm"
          onSubmit={telemetryFormHandler}
          method="POST"
          id="telemetryForm"
        >
          {validationError && <AlertCard variant="danger">{validationError}</AlertCard>}
          <div className="row">
            <div className="row time_frame">
              <div className="mb-3 col-md-6 col-lg-6">
                <div>From:</div>
                <div className="datetime_wrap">
                  {/* <input type='text' className='form-control date_input' name='from_date' value={fromDateValue} placeholder='dd.mm.YYYY' onChange={handleFromDateValueChange} /> &nbsp; */}
                  <DatePicker
                    name="from_date"
                    minDate={minDateCalendar}
                    maxDate={currentDate}
                    selected={fromDateValue}
                    onChange={(date) => setFromDateValue(date)}
                    className="form-control date_input"
                    dateFormat="dd.MM.yyyy"
                  />{' '}
                  &nbsp;
                  <input
                    type="time"
                    aria-label="from_time"
                    className="form-control timepicker time_input"
                    name="from_time"
                    value={fromTimeValue}
                    placeholder="HH:ss"
                    onChange={(evt) => setFromTimeValue(evt.target.value)}
                  />{' '}
                  &nbsp;
                </div>
              </div>
              <div className="col-md-6 col-lg-6">
                <div>To:</div>
                <div className="datetime_wrap">
                  {/* <input type='text' className='form-control date_input' name='to_date' value={toDateValue} placeholder='dd.MM.YYYY' onChange={handleToDateValueChange} /> &nbsp; */}
                  <DatePicker
                    name="to_date"
                    minDate={minDateCalendar}
                    maxDate={currentDate}
                    selected={toDateValue}
                    onChange={(date) => setToDateValue(date)}
                    className="form-control date_input"
                    dateFormat="dd.MM.yyyy"
                  />{' '}
                  &nbsp;
                  <input
                    type="time"
                    aria-label="to_time"
                    className="form-control timepicker time_input"
                    name="to_time"
                    value={toTimeValue}
                    placeholder="HH:ss"
                    onChange={(evt) => setToTimeValue(evt.target.value)}
                  />{' '}
                  &nbsp;
                </div>
              </div>
            </div>
            <div className="row time_frame">
              <label htmlFor="group_by">Group by time (s=second, m=minute, h=hour, d=day):</label>
              <div className="col-md-6">
                <select
                  name="group_by"
                  className="form-select groupby_select"
                  aria-label="Group By Time"
                  id="group_by"
                  value={selectGroupByValue}
                  onChange={(opt) => setSelectGroupByValue(opt.target.value)}
                >
                  <option value="30s">30 seconds</option>
                  <option value="1m">1 minute</option>
                  <option value="5m">5 minute</option>
                  <option value="1h">1 hour</option>
                  <option value="1d">1 day</option>
                  <option value="undefined">Customized time</option>
                </select>
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="group_by"
                  value={selectGroupByValue === 'undefined' ? groupByValue : selectGroupByValue}
                  className="form-control"
                  onChange={(evt) => setGroupByValue(evt.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row my-5">
            <div className="d-flex justify-content-between align-items-center">
              <label htmlFor="selectMeasurement">Measurement:</label>
              {/* <ToggleMeasurementButton 
                                id={`toggle_measurements`}
                                className='mx-3 toggle_switch_btn measurement_toggle_btn'
                                onToggle={toggleSelectAllMeasurementHandler}
                                title='Select all measurements'
                                label='Select All'
                            /> */}
            </div>
            <div className="selectMeasurement" id="selectMeasurement">
              {measurementCheckboxes.length > 0 &&
                measurementCheckboxes.map((m_item, m_index) => (
                  <div
                    className="measurement_item_wrap"
                    key={m_index}
                    style={{ backgroundColor: m_item.checked ? '#f2f2f2' : 'white' }}
                  >
                    {/* <input 
                                        type='checkbox' 
                                        name='measurements[]'
                                        id={m_item.measurement}
                                        onChange={() => measurementCheckboxHandler(m_item)} 
                                        value={m_item.measurement}
                                        checked={m_item.checked} 
                                    />&nbsp;
                                    <label htmlFor={m_item.measurement} className=''>{setCapitalizedName(m_item.measurement)}</label> */}
                    <Checkbox
                      label={setCapitalizedName(m_item.measurement)}
                      id={m_item.measurement}
                      name="measurements[]"
                      checkHandler={() => measurementCheckboxHandler(m_item)}
                      index={m_index}
                      value={m_item.measurement}
                      isChecked={m_item.checked}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="row my-3">
            <div className="selected_sensors_container" id="selectSensors">
              <div>Sensors:</div>
              <p>
                <i>
                  <small>Please select measurement(s) to loading sensors.</small>
                </i>
              </p>
              {measurementCheckboxes.length > 0 &&
                measurementCheckboxes.map((m_item, m_index) => (
                  <div
                    className="my-3 measurement_sensors_container"
                    key={m_index}
                    id={m_item.measurement}
                    style={{ display: m_item.checked ? 'block' : 'none' }}
                  >
                    <div className="form-control measurement_sensors_wrap">
                      <h4 className="measurement_header page_header_fs">
                        {setCapitalizedName(m_item.measurement)}
                        {/* <ToggleMeasurementButton 
                                            id={`toggle_${m_item.measurement}_sensors`}
                                            className='toggle_switch_btn measurement_toggle_btn'
                                            onToggle={() => toggleSelectAllSensorsOfMeasurementHandler(m_item.measurement)}
                                            title={`Select all sensors of ${setCapitalizedName(m_item.measurement)}`}
                                        /> */}
                      </h4>
                      <ul className="sensors_list" id={`${m_item.measurement}_sensors`}>
                        {sensorCheckboxes
                          .filter((s_item) => m_item.measurement === s_item.measurement)
                          .map((s_item, s_index) => (
                            <li className="checkbox-item sensor_item" key={s_index}>
                              <Checkbox
                                label={setCapitalizedName(s_item.id)}
                                id={s_item.id}
                                name="sensors[]"
                                index={s_index}
                                checkHandler={() => sensorCheckboxHandle(s_item)}
                                isChecked={s_item.checked}
                                value={s_item.id}
                              />
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="row">
            <div className="my-5 d-flex justify-content-between align-items-left">
              <Button
                type="submit"
                className="me-5 telemetry_submit_button"
                title="Download"
                id="customized_download"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default TelemetryForm;
