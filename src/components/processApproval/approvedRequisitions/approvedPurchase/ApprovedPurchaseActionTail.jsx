import { useJumboTheme } from "@jumbo/hooks";
import { ShoppingCartOutlined } from "@mui/icons-material";
import { ButtonGroup, Dialog, IconButton, LinearProgress, Tooltip, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { useQuery } from "react-query";
import requisitionsServices from "../../requisitionsServices";
import ApprovedPurchaseForm from "./form/ApprovedPurchaseForm";

const ApprovedPurchaseActionTail = ({approvedRequisition, isExpanded}) => {
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
        <ApprovedPurchaseForm toggleOpen={setOpenDialog} approvedDetails={approvedRequisitionDetails} approvedRequisition={approvedRequisition}/>
      </Dialog>

        <ButtonGroup variant="outlined" size="small" disableElevation sx={{ '& .MuiButton-root': { px: 1 } }}>
            <Tooltip title={"Order"}>
                <IconButton onClick={() => setOpenDialog(true)}>
                    <ShoppingCartOutlined/>
                </IconButton>
            </Tooltip>
        </ButtonGroup>
    </React.Fragment>
  );
};

export default ApprovedPurchaseActionTail;