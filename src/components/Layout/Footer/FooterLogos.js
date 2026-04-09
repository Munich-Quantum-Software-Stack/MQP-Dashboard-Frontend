import React from 'react';
import MQSSLogo from '@assets/images/logo-mqss-light.svg';

function FooterLogos() {
  return (
    <div>
      <div className="footer_logos">
        <a
          href="https://www.munich-quantum-valley.de/de/forschung/forschungsbereiche/mqss"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="MQSS"
        >
          <img src={MQSSLogo} className="footer_logo_img" alt="Munich Quantum Software Stack" />
        </a>
      </div>
    </div>
  );
}

export default FooterLogos;
