import { useJumboTheme } from "@jumbo/hooks";
import { AddTask } from "@mui/icons-material";
import { ButtonGroup, Dialog, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import TasksForm from "./TasksForm";

const TasksActionTail = ({activity}) => { 
  const { theme } = useJumboTheme();
  const [openDialog, setOpenDialog] = useState(false)
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <React.Fragment>
      <Dialog maxWidth="md" fullWidth fullScreen={belowLargeScreen} open={openDialog}>
        <TasksForm setOpenDialog={setOpenDialog} activity={activity}/>
      </Dialog>

      <ButtonGroup variant="outlined" size="small" disableElevation sx={{ '& .MuiButton-root': { px: 1 } }}>
        <Tooltip title={`Add ${activity?.name} Task`}>
          <IconButton onClick={() => setOpenDialog(true)}>
            <AddTask/>
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    </React.Fragment>
  );
};

export default TasksActionTail;