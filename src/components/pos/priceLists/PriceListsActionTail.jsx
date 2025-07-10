import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { AddOutlined, AddTaskOutlined } from '@mui/icons-material';
import { ButtonGroup, IconButton, Dialog, useMediaQuery, Menu, MenuItem, ListItemIcon } from '@mui/material';
import React, { lazy, useState } from 'react';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import { useJumboTheme } from '@jumbo/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

const PriceListForm = lazy(() => import("./form/PriceListForm"));
const PriceListsExcel = lazy(() => import("./excel/PriceListsExcel"));

const PriceListsActionTail = () => {
    const { checkOrganizationPermission } = useJumboAuth();
    const [openDialog, setOpenDialog] = useState(false);
    const [openExcelDialog, setOpenExcelDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    
    const { theme } = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

    return (
        <React.Fragment>
            <Dialog fullWidth fullScreen={belowLargeScreen} onClose={()=> {setOpenExcelDialog(false);setOpenDialog(false)}} scroll={belowLargeScreen ? 'body' : 'paper'} maxWidth={openExcelDialog ? "md" : "lg"} open={openDialog || openExcelDialog}>
                {openExcelDialog && <PriceListsExcel setOpenExcelDialog={setOpenExcelDialog} />}
                {openDialog && <PriceListForm toggleOpen={setOpenDialog} />}
            </Dialog>

            <ButtonGroup variant="outlined" size="small" disableElevation sx={{ '& .MuiButton-root': { px: 1 } }}>
                {
                    checkOrganizationPermission(PERMISSIONS.PRICE_LISTS_CREATE) && (
                        <React.Fragment>
                            
                            <IconButton 
                                size="small" 
                                onClick={(event) => setAnchorEl(event.currentTarget)}
                                sx={{ p: 0 }}
                            >
                                <AddOutlined />
                            </IconButton>
                            
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={()=> setAnchorEl(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <MenuItem onClick={()=> {
                                    setOpenDialog(true);
                                    setAnchorEl(null)
                                }}>
                                    <ListItemIcon>
                                        <AddTaskOutlined fontSize="small" />
                                    </ListItemIcon>
                                    Add Price List
                                </MenuItem>
                                
                                <MenuItem onClick={()=> {
                                    setOpenExcelDialog(true);
                                    setAnchorEl(null)
                                }}>
                                    <ListItemIcon>
                                        <FontAwesomeIcon icon={faFileExcel} fontSize="medium" />
                                    </ListItemIcon>
                                    Price List Excel
                                </MenuItem>
                            </Menu>
                        </React.Fragment>
                    )
                }
            </ButtonGroup>
        </React.Fragment>
    );
};

export default PriceListsActionTail;