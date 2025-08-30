import { ButtonGroup, Dialog, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import TasksTreeView from "./TasksTreeView";
import { AccountTreeOutlined } from "@mui/icons-material";

const TasksTreeViewActionTail = () => {
    const [openTasksTreeView, setOpenTasksTreeView] = useState(false);
  
    return (
        <React.Fragment>
            <Dialog maxWidth="xl" fullWidth fullScreen={true} open={openTasksTreeView}>
                <TasksTreeView setOpenTasksTreeView={setOpenTasksTreeView}/>
            </Dialog>
    
            <ButtonGroup variant="outlined" size="small" disableElevation sx={{ '& .MuiButton-root': { px: 1 } }}>
                <Tooltip title={"Tasks Tree View"}>
                    <IconButton onClick={() => setOpenTasksTreeView(true)}>
                       <AccountTreeOutlined />
                    </IconButton>
                </Tooltip>
            </ButtonGroup>
        </React.Fragment>
    );
  };

  export default TasksTreeViewActionTail;