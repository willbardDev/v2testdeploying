import { useJumboTheme } from "@jumbo/hooks";
import { FactCheckOutlined } from "@mui/icons-material";
import { ButtonGroup, Dialog, IconButton, LinearProgress, Tooltip, useMediaQuery } from "@mui/material";
import React, { useContext, useState } from "react";
import ApprovalForm from "./form/ApprovalForm";
import { requisitionContext } from "../../Requisitions";
import { useQuery } from "react-query";
import requisitionsServices from "../../requisitionsServices";
import useJumboAuth from "@jumbo/hooks/useJumboAuth";

const ApprovalsActionTail = ({requisition, isExpanded}) => {
  const { theme } = useJumboTheme();
  const [openDialog, setOpenDialog] = useState(false)
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const { isEditAction } = useContext(requisitionContext);
  const { hasOrganizationRole } = useJumboAuth();

  const { data: requisitionDetails, isLoading } = useQuery(
    ['requisitionDetails', { id: requisition.id }],
    async () => requisitionsServices.getRequisitionDetails(requisition.id),
    {
      enabled: !isEditAction && !!isExpanded && !!openDialog,
      refetchOnWindowFocus: true
    }
  );

  if (isLoading) {
    return <LinearProgress />
  }

  return (
    <React.Fragment>
      <Dialog maxWidth="lg" fullWidth scroll={belowLargeScreen ? 'body' : 'paper'} fullScreen={belowLargeScreen} open={openDialog}>
        <ApprovalForm toggleOpen={setOpenDialog} requisition={requisitionDetails} />
      </Dialog>

      {
        hasOrganizationRole(requisition?.next_approval_level?.role?.name) &&
        !(requisition.status?.toLowerCase() === 'suspended') &&
          <ButtonGroup variant="outlined" size="small" disableElevation sx={{ '& .MuiButton-root': { px: 1 } }}>
            <Tooltip title={"Approve Requisition"}>
              <IconButton onClick={() => setOpenDialog(true)}>
                <FactCheckOutlined/>
              </IconButton>
            </Tooltip>
          </ButtonGroup>
      }
    </React.Fragment>
  );
};

export default ApprovalsActionTail;