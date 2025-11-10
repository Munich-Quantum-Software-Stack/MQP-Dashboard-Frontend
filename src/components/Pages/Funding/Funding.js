import React from "react";
import { useSelector } from "react-redux";
import BlankCard from "src/components/UI/Card/BlankCard";
import "./Funding.scss";

const Funding = () => {
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const page_header_fs = +fs * 1.5;
    const text_fs = +fs;
    
    // Array of funders with their logo paths and names
    const funders = [
        {
            name: "Bayerisches Staatsministerium für Wissenschaft und Kunst",
            logo: "/images/funding/bavarian_ministry.png",
            className: "bavarian-ministry-logo"
        },
        {
            name: "Federal Ministry of Education and Research",
            logo: "/images/funding/federal_education_ministry.png"
        },
        {
            name: "Federal Ministry for Economic Affairs and Climate Action",
            logo: "/images/funding/federal_economic_ministry.png"
        },
        {
            name: "EuroHPC Joint Undertaking",
            logo: "/images/funding/euro_hpc.png"
        },
        {
            name: "European Commission",
            logo: "/images/funding/european_commission.png"
        },
        {
            name: "European Research Council",
            logo: "/images/funding/european_research_council.png"
        },
        {
            name: "Quantum Flagship",
            logo: "/images/funding/quantum_flagship.png"
        }
    ];

    return (
        <BlankCard className={`information_container ${darkmode ? "dark_bg" : "white_bg"} h-100`}>
            <div className="funding-page">
                <h4 className="page_header" style={{ fontSize: page_header_fs * 1.2, fontWeight: "bold" }}>
                    Funding Acknowledgements
                </h4>
                <p style={{ fontSize: text_fs * 1.1, marginBottom: "2rem", fontWeight: "bold" }}>
                    The Munich Quantum Portal acknowledges the support and funding from the following organizations:
                </p>
                
                <div className="funding-logos-container">
                    {funders.map((funder, index) => (
                        <div key={index} className="funding-logo-item">
                            <img 
                                src={funder.logo} 
                                alt={`${funder.name} logo`} 
                                className={`funding-logo ${funder.className || ""}`}
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
