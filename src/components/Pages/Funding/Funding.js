import React from 'react';
import { useSelector } from 'react-redux';
import BlankCard from '@components/UI/Card/BlankCard';
import './Funding.scss';

// Import logos from assets
import BavarianMinistryLogo from '@assets/images/bavarian_ministry.png';
import StMWiLogo from '@assets/images/stmwi.png';
import BMFTRLogo from '@assets/images/bmftr.png';
import BMWKLogo from '@assets/images/bmwk.png';
import EULogo from '@assets/images/EU.png';
import EuroHPCLogo from '@assets/images/euro_hpc.png';
import EuropeanCommissionLogo from '@assets/images/european_commission.png';
import QuantumFlagshipLogo from '@assets/images/quantum_flagship.png';

const Funding = () => {
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const page_header_fs = +fs * 1.5;
  const text_fs = +fs;

  // Array of funders with their logo paths and names
  const funders = [
    {
      name: 'Bavarian State Ministry of Science and Art',
      logo: BavarianMinistryLogo,
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
      logo: EuroHPCLogo,
    },
    {
      name: 'European Commission',
      logo: EuropeanCommissionLogo,
    },
    {
      name: 'Quantum Flagship',
      logo: QuantumFlagshipLogo,
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
