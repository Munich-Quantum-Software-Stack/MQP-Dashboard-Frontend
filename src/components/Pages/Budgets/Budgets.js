import React from 'react';
import { useSelector } from 'react-redux';
import BlankCard from 'src/components/UI/Card/BlankCard';
// import ContentCard from "src/components/UI/Card/ContentCard";
// import BudgetsContent from "src/components/Pages/Budgets/BudgetsContent";
// import { fetchBudgets } from "src/components/utils/budgets-http";
// import { useQuery } from "@tanstack/react-query";
// import LoadingIndicator from "src/components/UI/LoadingIndicator";
// import ErrorBlock from "src/components/UI/MessageBox/ErrorBlock";
import './Budgets.scss';

function Budgets() {
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const page_header_fs = +fs * 1.5;
  let budgetsContent;

  // const { data, isPending, isError, error } = useQuery({
  //     queryKey: ["budgets"],
  //     queryFn: () => fetchBudgets(),
  // });
  // if (isError) {
  //     return <ErrorBlock title={error.message} message={error.code} />;
  // }
  // if (isPending) {
  //     return (
  //         <ContentCard
  //             className={`${
  //                 darkmode ? "dark_bg" : "white_bg"
  //             } budgets_container `}
  //         >
  //             <LoadingIndicator />
  //         </ContentCard>
  //     );
  // }

  // if (data) {
  //     return (budgetsContent = (
  //         <ContentCard
  //         className={` ${
  //             darkmode ? "dark_bg" : "white_bg"
  //         } budgets_container`}
  //     >
  //         <div className="container_header_wrap">
  //             <h4 className="page_header">Budgets</h4>
  //         </div>
  //         <BudgetsContent items={data} />
  //     </ContentCard>
  //     ));
  // }

  budgetsContent = (
    <BlankCard className={`${darkmode ? 'dark_bg' : 'white_bg'} h-100`}>
      <h4 className="page_header" style={{ fontSize: page_header_fs }}>
        Budgets information will be updated soon.
      </h4>
    </BlankCard>
  );

  return <React.Fragment>{budgetsContent}</React.Fragment>;
}

export default Budgets;
