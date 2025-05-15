import useJumboAuth from '@jumbo/hooks/useJumboAuth'
import { AddOutlined } from '@mui/icons-material'
import { ButtonGroup, Tooltip,IconButton, Dialog } from '@mui/material'
import React, { useState } from 'react'
import BudgetForm from '../../accounts/budgets/form/BudgetForm'
import { PERMISSIONS } from 'app/utils/constants/permissions'

const BudgetsActionTail = () => {

    const {checkOrganizationPermission, authUser} = useJumboAuth();
    const [openDialog, setOpenDialog] = useState(false);
  return (
    <React.Fragment>
        <Dialog  maxWidth='lg' open={openDialog}>
            <BudgetForm setOpenDialog={setOpenDialog} />
        </Dialog>
        <ButtonGroup variant="outlined" size="small" disableElevation sx={{ '& .MuiButton-root': { px: 1 } }}>
            {
                checkOrganizationPermission(PERMISSIONS.USERS_INVITE) && authUser?.user?.id < 5 && (
                    <Tooltip title={'New Budget'}>
                        <IconButton onClick={() => setOpenDialog(true)}>
                            <AddOutlined/>
                        </IconButton>
                    </Tooltip>
                )
            }
         </ButtonGroup>
    </React.Fragment>
   )
}

export default BudgetsActionTail