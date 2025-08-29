import { useJumboTheme } from "@jumbo/hooks";
import { VisibilityOutlined } from "@mui/icons-material";
import { ButtonGroup, Dialog, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import BudgetItemsForm from "./budgetItems/BudgetItemsForm";

const BudgetItemsActionTail = ({budget}) => {
    const { theme } = useJumboTheme();
    const [openDialog, setOpenDialog] = useState(false)
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
  
    return (
      <React.Fragment>
        <Dialog maxWidth="lg" fullWidth scroll={belowLargeScreen ? 'body' : 'paper'} fullScreen={belowLargeScreen} open={openDialog}>
          <BudgetItemsForm setOpenDialog={setOpenDialog} budget={budget}/>
        </Dialog>
  
        <ButtonGroup variant="outlined" size="small" disableElevation sx={{ '& .MuiButton-root': { px: 1 } }}>
          <Tooltip title={"View Items"}>
            <IconButton onClick={() => setOpenDialog(true)}>
              <VisibilityOutlined/>
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </React.Fragment>
    );
  };

  export default BudgetItemsActionTail;