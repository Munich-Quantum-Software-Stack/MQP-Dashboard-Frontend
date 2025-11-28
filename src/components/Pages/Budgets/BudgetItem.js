import React from 'react';

/**
 * BudgetItem - Displays a single budget allocation as a donut chart with usage statistics
 */
const BudgetItem = (props) => {
  // Calculate budget usage percentages
  const allocation = parseInt(props.allocation);
  let budgetUsed = Math.round((parseInt(props.budget_used) / allocation) * 100);
  let remaining = allocation - parseInt(props.budget_used);
  let budgetUsed_percent = budgetUsed + '%';
  let remaining_percent = (remaining / allocation) * 100 + '%';

  return (
    <React.Fragment>
      <div className="budgetItem_wrap">
        {/* Legend showing used vs remaining budget with color indicators */}
        <div className="budget_chart__explain">
          <div className="explain_wrap budget_used">
            <div className="explain_color_box" style={{ backgroundColor: props.used_color }}></div>
            {budgetUsed_percent} Used ({props.budget_used}/{props.allocation})
          </div>
          <div className="explain_wrap budget_remaining">
            <div
              className="explain_color_box"
              style={{ backgroundColor: props.remaining_color }}
            ></div>
            {remaining_percent} Remaining ({remaining}/{props.allocation})
          </div>
        </div>
        {/* Donut chart using CSS conic-gradient to visualize budget usage */}
        <div
          className="budget_chart"
          style={{
            backgroundImage:
              'conic-gradient(' +
              props.used_color +
              ' 0% ' +
              budgetUsed_percent +
              ', ' +
              props.remaining_color +
              ' ' +
              budgetUsed_percent +
              ')',
          }}
        ></div>
        <h4 className="budget_resource">{props.resource}</h4>
      </div>
    </React.Fragment>
  );
};

export default BudgetItem;
