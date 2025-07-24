import { CreditScoreOutlined } from "@mui/icons-material";
import { ButtonGroup, Dialog, IconButton, LinearProgress, Tooltip, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import requisitionsServices from "../../requisitionsServices";
import ApprovedPaymentForm from "./form/ApprovedPaymentForm";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { useQuery } from "@tanstack/react-query";

const ApprovedPaymentActionTail = ({approvedRequisition, isExpanded}) => {
  const { theme } = useJumboTheme();
  const [openDialog, setOpenDialog] = useState(false)
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const { data: approvedRequisitionDetails, isFetching } = useQuery(
    ['requisitionDetails', { id: approvedRequisition.id }],
    async () => requisitionsServices.getApprovedRequisitionDetails(approvedRequisition.id),
    {
      enabled: !!isExpanded && !!openDialog,
    }
  );

  if (isFetching) {
    return <LinearProgress />
  }

  return (
    <React.Fragment>
      <Dialog maxWidth="lg" scroll={belowLargeScreen ? 'body' : 'paper'} fullWidth fullScreen={belowLargeScreen} open={openDialog}>
        <ApprovedPaymentForm toggleOpen={setOpenDialog} approvedDetails={approvedRequisitionDetails} approvedRequisition={approvedRequisition}/>
      </Dialog>

        <ButtonGroup variant="outlined" size="small" disableElevation sx={{ '& .MuiButton-root': { px: 1 } }}>
            <Tooltip title={"Pay"}>
                <IconButton onClick={() => setOpenDialog(true)}>
                    <CreditScoreOutlined/>
                </IconButton>
            </Tooltip>
        </ButtonGroup>
    </React.Fragment>
  );
};

export default ApprovedPaymentActionTail;