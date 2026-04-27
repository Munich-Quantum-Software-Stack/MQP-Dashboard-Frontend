import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '@components/UI/Button/Button';
import { getAuthToken } from '@utils/auth';
import { downloadTelemetryData } from '@components/utils/telemetry-http';
// import { queryClient } from '@utils/query';
import ErrorBlock from '@components/UI/MessageBox/ErrorBlock';
import LoadingIndicator from '@components/UI/LoadingIndicator';
import { useMutation } from '@tanstack/react-query';
import './Telemetry.scss';

function TelemetryData({ filesize, filename }) {
  const access_token = getAuthToken();
  // const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const text_fs = +fs;
  const page_header_fs = +fs * 1.5;
  const navigate = useNavigate();
  // Downloading data (must be 1st order)
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: downloadTelemetryData,
    onSuccess: (data) => {
      //queryClient.invalidateQueries({ queryKey: ['download'] });
      // create downloadLink
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      setTimeout(() => {
        navigate('/telemetry');
      }, 300);
    },
  });

  const downloadFileHandler = async (event) => {
    event.preventDefault();
    /**
     * Handle fetching download file
     */
    const formData = {
      filename: filename,
    };
    mutate({ formData, access_token });
    event.target.reset();
  };
  if (isError) {
    return <ErrorBlock title={error.message} message={error.code} />;
  }
  if (isPending) {
    // return progress bar animation
    return <LoadingIndicator>Loading...</LoadingIndicator>;
  }

  return (
    <React.Fragment>
      <h4 className="page_header" style={{ fontSize: page_header_fs }}>
        Telemetry
      </h4>
      <div className="mt-5" style={{ fontSize: text_fs }}>
        <p>
          Your telemetry data is saved to file <i>{filename}</i> with filesize: {filesize} bytes.
        </p>
        <p>Would you like to download it?</p>
        <form method="POST" onSubmit={downloadFileHandler} id="downloadForm">
          <input type="hidden" name={filename} value={filename} />
          <Button type="submit" className="auto_width_button download_btn">
            Continue downloading data.
          </Button>
          <a href="/telemetry">
            <Button className="auto_width_button gray_btn cancel_btn">Cancel</Button>
          </a>
        </form>
      </div>
    </React.Fragment>
  );
}

export default TelemetryData;
