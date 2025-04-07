import React from 'react';
import { Grid } from '@mui/material';
import { ReactNode } from 'react';

interface ToolbarActionProps {
  action?: ReactNode;
  actionTail?: ReactNode;
}

const ToolbarAction: React.FC<ToolbarActionProps> = ({ action, actionTail }) => {
  return (
    <Grid container justifyContent="flex-end">
      {action && (
        <Grid size={12} sx={{ padding: 1 }}>
          {action}
        </Grid>
      )}
      {actionTail && (
        <Grid size={{xs:12, md: 6}} sx={{ padding: 1 }}>
          {actionTail}
        </Grid>
      )}
    </Grid>
  );
};

export default ToolbarAction;
