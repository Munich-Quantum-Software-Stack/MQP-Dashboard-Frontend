import { useSelector } from "react-redux";
import BlankCard from "../../UI/Card/BlankCard";
import { Fragment } from "react";

const InformationContent = () => {
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const page_header_fs = +fs * 1.5;
    return (
        <Fragment>
        </Fragment>
    );
};

export default InformationContent;
