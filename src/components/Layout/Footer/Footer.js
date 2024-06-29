import { useSelector } from "react-redux";
import { getAuthToken } from "../../utils/auth";
function Footer() {
    const fs = useSelector((state) => state.accessibilities.font_size);
    const token = getAuthToken();
    const footer_fs = +fs * 0.85;
    return (
        <div className="footer_container">
            <div className="footer_navbar">
                <ul className="footer_nav">
                    <li>
                        <a
                            href="https://www.lrz.de/datenschutzerklaerung/"
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: token ? footer_fs : "0.85rem" }}
                        >
                            Data Privacy
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.lrz.de/impressum/"
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: token ? footer_fs : "0.85rem" }}
                        >
                            Imprint
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.lrz.de/barrierefreiheit/"
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: token ? footer_fs : "0.85rem" }}
                        >
                            Accessibility
                        </a>
                    </li>
                </ul>
            </div>
            <div className="copyright text-center">
                <span style={{ fontSize: token ? footer_fs : "0.85rem" }}>
                    &copy; 2024 Munich Quantum Portal
                </span>
            </div>
        </div>
    );
}

export default Footer;
