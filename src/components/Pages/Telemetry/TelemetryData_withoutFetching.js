import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '@components/UI/Button/Button';
import BlankCard from '@components/UI/Card/BlankCard';
import ContentCard from '@components/UI/Card/ContentCard';
import './Telemetry.scss';

function TelemetryData({ filesize, filename }) {
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const text_fs = +fs;
  const page_header_fs = +fs * 1.5;
  const [downloadComplete, setDownloadComplete] = useState(false);

  const downloadFileHandler = async (event) => {
    event.preventDefault();
    /**
     * Redirect the browser to download file
     */
    const url = 'http://127.0.0.1:5000/telemetry/download';
    const download_url = url + `?filename=${encodeURIComponent(filename)}`;
    window.location.href = download_url;
    setDownloadComplete(true);
    event.target.reset();
  };
  return (
    <React.Fragment>
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'} `}>
        <h4 className="page_header" style={{ fontSize: page_header_fs }}>
          Telemetry
        </h4>
        {downloadComplete && (
          <BlankCard className={`${darkmode ? 'dark_bg' : 'white_bg'} h-100`}>
            <p style={{ fontSize: text_fs }}>Download started. You can safely leave this page.</p>
          </BlankCard>
        )}
        {!downloadComplete && (
          <>
            <div className="mt-5" style={{ fontSize: text_fs }}>
              <p>
                Your telemetry data is saved to file <i>{filename}</i> with filesize: {filesize}{' '}
                bytes.
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
          </>
        )}
      </ContentCard>
    </React.Fragment>
  );
}

export default TelemetryData;
