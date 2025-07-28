
import { AddOutlined } from '@mui/icons-material';
import {
  ButtonGroup,
  Dialog,
  IconButton,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import React, { useState } from 'react';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import ProjectFormDialog from './ProjectFormDialog';

const ProjectsActionTail = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { theme } = useJumboTheme();
  const { checkOrganizationPermission } = useJumboAuth();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <>
      <Dialog maxWidth="sm" fullScreen={belowLargeScreen} open={openDialog}>
        <ProjectFormDialog
          setOpenDialog={setOpenDialog}
          project={{
            id: undefined,
            name: '',
            description: '',
            category: null,
            client: null,
            // Add more fields as required by your form
          }}
        />
      </Dialog>

      <ButtonGroup
        variant="outlined"
        size="small"
        disableElevation
        sx={{ '& .MuiButton-root': { px: 1 } }}
      >
        {checkOrganizationPermission(PERMISSIONS.PROJECTS_CREATE) && (
          <Tooltip title="New Project">
            <IconButton onClick={() => setOpenDialog(true)}>
              <AddOutlined />
            </IconButton>
          </Tooltip>
        )}
      </ButtonGroup>
    </>
  );
};

export default ProjectsActionTail;
