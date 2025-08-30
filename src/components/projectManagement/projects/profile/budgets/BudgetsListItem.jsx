import { Accordion, AccordionSummary, AccordionDetails, Grid, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import React, { useState } from 'react';
import BudgetsItemAction from './BudgetsItemAction';
import { useProjectProfile } from '../ProjectProfileProvider';
import BudgetsActionTail from './BudgetsActionTail';
import JumboSearch from '@jumbo/components/JumboSearch';
import BudgetsAccordionDetails from './BudgetsAccordionDetails';
import ProductsProvider from 'app/prosServices/prosERP/productAndServices/products/ProductsProvider';
import LedgerSelectProvider from 'app/prosServices/prosERP/accounts/ledgers/forms/LedgerSelectProvider';
import ProductsSelectProvider from 'app/prosServices/prosERP/productAndServices/products/ProductsSelectProvider';

function BudgetsListItem() {
  const { projectBudgets } = useProjectProfile();
  const [expanded, setExpanded] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBudgets = projectBudgets?.filter(budget =>
    budget.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (index) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index],
    }));
  };

  return (
    <LedgerSelectProvider>
     <ProductsSelectProvider>
        <ProductsProvider>
          <Grid container columnSpacing={1} justifyContent="flex-end" alignItems="center">
            <Grid item>
              <JumboSearch
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
              />
            </Grid>
            <Grid item>
              <BudgetsActionTail />
            </Grid>
          </Grid>

          {filteredBudgets?.length > 0 ? (
            filteredBudgets.map((budget, index) => (
              <Accordion
                key={index}
                expanded={!!expanded[index]}
                onChange={() => handleChange(index)}
                square
                sx={{
                  borderRadius: 2,
                  borderTop: 2,
                  padding: 0.5,
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  '& > .MuiAccordionDetails-root:hover': {
                    bgcolor: 'transparent',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={expanded[index] ? <RemoveIcon /> : <AddIcon />}
                  sx={{
                    px: 3,
                    flexDirection: 'row-reverse',
                    '.MuiAccordionSummary-content': {
                      alignItems: 'center',
                      '&.Mui-expanded': {
                        margin: '12px 0',
                      },
                    },
                    '.MuiAccordionSummary-expandIconWrapper': {
                      borderRadius: 1,
                      border: 1,
                      color: 'text.secondary',
                      transform: 'none',
                      mr: 1,
                      '&.Mui-expanded': {
                        transform: 'none',
                        color: 'primary.main',
                        borderColor: 'primary.main',
                      },
                      '& svg': {
                        fontSize: '1.25rem',
                      },
                    },
                  }}
                >
                  <Grid container columnSpacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <Tooltip title="Name">
                        <Typography variant="h5" fontSize={14} lineHeight={1.25} mb={0} noWrap>
                          {budget.name}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={6} md={3.5}>
                      <Tooltip title="Start Date">
                        <Typography variant="h5" fontSize={14} lineHeight={1.25} mb={0} noWrap>
                          {readableDate(budget.start_date, false)}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={6} md={3.5}>
                      <Tooltip title="End Date">
                        <Typography variant="h5" fontSize={14} lineHeight={1.25} mb={0} noWrap>
                          {readableDate(budget.end_date, false)}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={1} textAlign="end">
                      <BudgetsItemAction budget={budget} />
                    </Grid>
                  </Grid>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    backgroundColor: 'background.paper',
                    marginBottom: 3,
                    padding: 0.5
                  }}
                >
                  <Grid container>
                    <BudgetsAccordionDetails budget={budget} expanded={expanded[index]}/>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" align="center" mt={2}>
              No budgets found.
            </Typography>
          )}
        </ProductsProvider>
      </ProductsSelectProvider>
    </LedgerSelectProvider>
  );
}

export default BudgetsListItem;
