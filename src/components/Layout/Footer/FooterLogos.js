import React from 'react';
import MQSSLogo from '@assets/images/logo-mqss-light.svg';
import MQVLogo from '@assets/images/MQV_LOGO_F_BUNT.png';

function FooterLogos() {
  return (
    <div>
      <div className="footer_logos">
        <a
          href="https://www.munich-quantum-valley.de/de/forschung/forschungsbereiche/mqss"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={MQSSLogo} className="footer_logo_img" alt="Munich Quantum Software Stack" />
        </a>
        <a href="https://www.munich-quantum-valley.de" target="_blank" rel="noopener noreferrer">
          <img src={MQVLogo} className="footer_logo_img" alt="Munich Quantum Valley" />
        </a>
      </div>
    </div>
  );
}

export default FooterLogos;
