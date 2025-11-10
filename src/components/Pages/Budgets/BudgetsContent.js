import React from "react";
import BlankCard from "src/components/UI/Card/BlankCard";
import BudgetItem from "src/components/Pages/Budgets/BudgetItem";

function BudgetsContent(props) {
  if (props.items.length === 0) {
    return <h4 className="text-center my-3">No Budgets available.</h4>;
  }
  return (
    <BlankCard>
      <div className="budgetsList">
        {props.items.map((budget) => (
          <BudgetItem
            key={budget.id}
            resource={budget.resource}
            budget_used={budget.budget_used}
            allocation={budget.allocation}
            used_color={budget.used_color}
            remaining_color={budget.remaining_color}
          />
        ))}
      </div>
    </BlankCard>
  );
}

export default BudgetsContent;
