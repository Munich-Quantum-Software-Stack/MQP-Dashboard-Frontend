import React from 'react';
import { useSelector } from 'react-redux';
import BlankCard from '@components/UI/Card/BlankCard';
import './Budgets.scss';

/**
 * Budgets - Placeholder page for displaying user budget allocations (coming soon)
 */
function Budgets() {
  // Get accessibility settings from Redux store
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const page_header_fs = +fs * 1.5;

  const budgetsContent = (
    <BlankCard className={`${darkmode ? 'dark_bg' : 'white_bg'} h-100`}>
      <h4 className="page_header" style={{ fontSize: page_header_fs }}>
        Budgets information will be updated soon.
      </h4>
    </BlankCard>
  );

  return <React.Fragment>{budgetsContent}</React.Fragment>;
}

export default Budgets;
