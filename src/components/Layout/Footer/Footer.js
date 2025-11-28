import { useSelector } from 'react-redux';
import { getAuthToken } from '@utils/auth';
function Footer() {
  const fs = useSelector((state) => state.accessibilities.font_size);
  const token = getAuthToken();
  const window_width = window.innerWidth;
  const STANDARD_FOOTER_FS = window_width <= 375 ? 0.8 : 0.85;
  const footer_fs = +fs * STANDARD_FOOTER_FS;
  return (
    <div className="mt-auto footer_container">
      <div className="copyright text-center">
        <span
          style={{
            fontSize: token ? footer_fs : STANDARD_FOOTER_FS + 'rem',
          }}
        >
          &copy; 2024 Developed and operated by Leibniz Supercomputing Centre
        </span>
      </div>
      <div className="footer_navbar">
        <ul className="footer_nav">
          <li>
            <a
              href="https://www.lrz.de/datenschutzerklaerung/"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: token ? footer_fs : STANDARD_FOOTER_FS + 'rem',
              }}
            >
              Data Privacy
            </a>
          </li>
          <li>
            <a
              href="https://www.lrz.de/impressum/"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: token ? footer_fs : STANDARD_FOOTER_FS + 'rem',
              }}
            >
              Imprint
            </a>
          </li>
          <li>
            <a
              href="https://www.lrz.de/barrierefreiheit/"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: token ? footer_fs : STANDARD_FOOTER_FS + 'rem',
              }}
            >
              Accessibility
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
