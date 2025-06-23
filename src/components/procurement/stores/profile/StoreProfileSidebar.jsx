import { AddOutlined, ChevronRightOutlined, ExpandMoreOutlined } from '@mui/icons-material'
import { Box, Button, Dialog, Tooltip } from '@mui/material'
import React from 'react'
import StoreForm from '../StoreForm';
import { useStoreProfile } from './StoreProfileProvider';
import SubStoreTreeItemLabel from './SubStoreTreeItemLabel';
import { useState } from 'react';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import { Div } from '@jumbo/shared';

function StoreProfileSidebar() {

        const {mainStore,storeArrays : { storeIds,selectOptions }} = useStoreProfile();

        const storeTree = [mainStore];
        const [openDialog, setOpenDialog] = useState(false);
        //Handle expand and collapse
        const [expanded, setExpanded] = React.useState([String(mainStore.id)]);
        const handleToggle = (event, nodeIds) => {
            setExpanded(nodeIds);
        }

        const handleExpandClick = () => {
            setExpanded((oldExpanded) =>
                oldExpanded.length === 0 ? storeIds : [],
            );
        };

       //Dynamically create a Tree
       const renderTree = (nodes) => (  
        nodes.map((node) => (
            <TreeItem key={String(node.id)} nodeId={String(node.id)} 
                label={<SubStoreTreeItemLabel store={node}/> }
            >
            {
                Array.isArray(node.children)
                ?  renderTree(node.children)
                : null 

            }
            </TreeItem>
        ))  
    );
  return (
    <Div sx={{ p:1.8, width: 240 }}>
        <Div sx={{mb: 1}}>
            <Button onClick={handleExpandClick}>
                {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
            </Button>
        </Div>
        <TreeView
            aria-label="Sub-store Tree"
            defaultCollapseIcon={<ExpandMoreOutlined/>}
            defaultExpandIcon={<ChevronRightOutlined/>}
            expanded={expanded}
            onNodeToggle={handleToggle}
            sx={{ flexGrow: 1, overflowY: 'scroll', height: 350}}
        >
            {renderTree(storeTree)}
        </TreeView>
        <Box
            sx={{ 
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
             }}
        >
            <React.Fragment>
                <Dialog maxWidth="xs" open={openDialog}>
                    <StoreForm setOpenDialog={setOpenDialog} parentOptions={selectOptions}/>
                </Dialog>
                    <Tooltip title={"Add Sub-store"}>
                        <Button variant="outlined" size="small" disableElevation sx={{ '& .MuiButton-root': { px: 1 } }} onClick={() => setOpenDialog(true)}>
                            <AddOutlined/> Sub-store
                        </Button>
                    </Tooltip>
            </React.Fragment>
        </Box>
    </Div>
  )
}

export default StoreProfileSidebar