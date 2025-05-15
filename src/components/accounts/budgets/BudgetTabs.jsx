import { Box, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import BudgetItemRow from './form/BudgetItemRow';
import BudgetItemForm from './form/BudgetItemForm';

function CustomTabPanel(props) { // Renamed to CustomTabPanel
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} {...other}>
      {value === index && (
        <Box>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function BudgetTabs({ incomeItems, setIncomeItems, expenseItems, setExpenseItems, setItems}) {
  const [activeTab, setActiveTab] = useState(0);

    // Calculate total amount for incomeItems and expenseItems
    const TotalAmount = activeTab === 0 ? incomeItems.reduce((total, item) => total + item.amount, 0).toLocaleString() : expenseItems.reduce((total, item) => total + item.amount, 0).toLocaleString(); 
    const AmountColor = activeTab === 0 ? 'primary' : 'error';

    useEffect(() => {
      // Update the setItems prop based on the activeTab value
      if (activeTab === 0) {
        setItems(incomeItems);
      } else {
        setItems(expenseItems);
      }
    }, [activeTab, incomeItems, expenseItems, setItems]);

  return (
    <div>
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Income" />
        <Tab label="Expenses" />
      </Tabs>
      <Typography variant="h5" textAlign='center' color={AmountColor}>
          Total Amount: {TotalAmount}
        </Typography>
      {/* Pass the correct array to BudgetItemRow and BudgetItemForm */}
      {/* Use CustomTabPanel */}
      <CustomTabPanel value={activeTab} index={0}>
        <BudgetItemForm setItems={setIncomeItems} />
        {incomeItems.map((item, index) => (
          <BudgetItemRow key={index} index={index} setItems={setIncomeItems} items={incomeItems} item={item} />
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={1}>
        <BudgetItemForm setItems={setExpenseItems} />
        {expenseItems.map((item, index) => (
          <BudgetItemRow key={index} index={index} setItems={setExpenseItems} items={expenseItems} item={item} />
        ))}
      </CustomTabPanel>
    </div>
  );
}

export default BudgetTabs;
