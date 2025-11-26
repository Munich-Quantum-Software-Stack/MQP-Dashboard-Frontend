import React from 'react';
import { useSelector } from 'react-redux';
import BlankCard from 'src/components/UI/Card/BlankCard';
import './Funding.scss';

// Import logos from assets
import StMWiLogo from 'src/assets/images/stmwi.png';
import BMFTRLogo from 'src/assets/images/bmftr.png';
import BMWKLogo from 'src/assets/images/bmwk.png';
import EULogo from 'src/assets/images/EU.png';

const Funding = () => {
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const page_header_fs = +fs * 1.5;
  const text_fs = +fs;

  // Array of funders with their logo paths and names
  const funders = [
    {
      name: 'Bavarian State Ministry of Science and Art',
      logo: '/images/funding/bavarian_ministry.png',
      className: 'bavarian-ministry-logo',
    },
    {
      name: 'Bavarian State Ministry for Economic Affairs, Regional Development and Energy',
      logo: StMWiLogo,
    },
    {
      name: 'Federal Ministry of Research, Technology and Space ',
      logo: BMFTRLogo,
    },
    {
      name: 'Federal Ministry for Economic Affairs and Energy ',
      logo: BMWKLogo,
    },
    {
      name: 'European Union ',
      logo: EULogo,
    },
    {
      name: 'EuroHPC Joint Undertaking',
      logo: '/images/funding/euro_hpc.png',
    },
    {
      name: 'European Commission',
      logo: '/images/funding/european_commission.png',
    },
    {
      name: 'Quantum Flagship',
      logo: '/images/funding/quantum_flagship.png',
    },
  ];

  return (
    <BlankCard className={`information_container ${darkmode ? 'dark_bg' : 'white_bg'} h-100`}>
      <div className="funding-page">
        <h4 className="page_header" style={{ fontSize: page_header_fs * 1.2, fontWeight: 'bold' }}>
          Funding Acknowledgements
        </h4>
        <p style={{ fontSize: text_fs * 1.1, marginBottom: '2rem', fontWeight: 'bold' }}>
          The Munich Quantum Portal acknowledges the support and funding from the following
          organizations:
        </p>

        <div className="funding-logos-container">
          {funders.map((funder, index) => (
            <div key={index} className="funding-logo-item">
              <img
                src={funder.logo}
                alt={`${funder.name} logo`}
                className={`funding-logo ${funder.className || ''}`}
              />
              <p className="funding-org-name" style={{ fontSize: text_fs * 0.9 }}>
                {funder.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </BlankCard>
  );
};

export default Funding;
