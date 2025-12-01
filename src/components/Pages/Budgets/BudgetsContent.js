import React from 'react';
import BlankCard from '@components/UI/Card/BlankCard';
import BudgetItem from '@components/Pages/Budgets/BudgetItem';

/**
 * BudgetsContent - Renders a list of budget items or an empty state message
 */
function BudgetsContent(props) {
  // Show empty state if no budgets available
  if (props.items.length === 0) {
    return <h4 className="text-center my-3">No Budgets available.</h4>;
  }

  // Render list of BudgetItem components for each budget allocation
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
