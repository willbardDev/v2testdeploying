import React, { createContext, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import ApprovalChainsListItemAction from './ApprovalChainsListItemAction';
import ApprovalChainLevels from './ApprovalChainLevels';
import approvalChainsServices from './approvalChainsServices';
import { useQuery } from 'react-query';

export const approvalChainsListItemContext = createContext({});

const ApprovalChainsListItem = ({ approvalChain }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedApprovalChainLevel, setSelectedApprovalChainLevel] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [queryParams, setQueryParams] = useState({ status: 'Active' });

  const { data: approvalChainLevels, isLoading } = useQuery(
    ['approvalChainLevels', { approvalChainId: approvalChain.id, status: queryParams.status }],
    () => approvalChainsServices.getApprovalChainLevels(approvalChain.id, queryParams.status),
    {
      enabled: expanded,
    }
  );
  
  return (
    <approvalChainsListItemContext.Provider value={{approvalChainLevels,approvalChain, queryParams, setQueryParams, expanded,setExpanded,selectedApprovalChainLevel,setSelectedApprovalChainLevel,openDialog,setOpenDialog}}>
      <Accordion
        expanded={expanded}
        square
        sx={{ 
          borderRadius: 2, 
          borderTop: 2,
          borderColor: 'divider',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
        onChange={()=> setExpanded((prevExpanded) => !prevExpanded)}
      >
        <AccordionSummary
          expandIcon={expanded ? <RemoveIcon /> : <AddIcon />}
          sx={{
            px: 2,
            flexDirection: 'row-reverse',
            '.MuiAccordionSummary-content': {
              alignItems: 'center',
              '&.Mui-expanded': {
                margin: '10px 0',
              }},
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
                fontSize: '0.9rem',
              },
            },
          }}
        >
          <Grid
            paddingLeft={1}
            paddingRight={1}
            columnSpacing={1}
            alignItems={'center'}
            container
          >
            <Grid item xs={6} md={5}>
              <Tooltip title={'Type'}>
                <Typography>{approvalChain.process_type}</Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={6} md={5}>
              {approvalChain.cost_center?.name &&
                <Tooltip title={'Cost Center'}>
                  <Chip
                    size="small"
                    label={approvalChain.cost_center?.name}
                  />
                </Tooltip>
              }
            </Grid>
            <Grid item xs={12} md={2} display={'flex'} alignItems={{xs: 'end', md: 'start'}} justifyContent={{xs: 'end', md: 'start'}}>
              <Tooltip title={'Status'}>
                <Chip
                  size="small"
                  label={approvalChain.status}
                  color={
                    approvalChain.status === 'active'
                      ? 'success'
                      : 'warning'
                  }
                />
              </Tooltip>
            </Grid>
          </Grid>
          <Divider/>
        </AccordionSummary>
        <AccordionDetails
          sx={{ 
            backgroundColor:'background.paper',
            marginBottom: 3
          }}
        >
          {
            isLoading && <LinearProgress/>
          }
          <Grid container>
            <Grid item xs={12} textAlign={'end'}>
              <ApprovalChainsListItemAction approvalChain={approvalChain} />
            </Grid>
            
            {/*approvalChainLevels*/}
            <Grid item xs={12}>
              <ApprovalChainLevels approvalChain={approvalChain}/>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </approvalChainsListItemContext.Provider>

  );
};

export default ApprovalChainsListItem;
