import React from 'react';
import {
  Divider,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';
import ProjectListItemAction from './ProjectListItemAction';
import { Project } from './ProjectTypes';

  interface ProjectItemProps {
    project: Project;
  }

const ProjectListItem: React.FC<ProjectItemProps> = ({ project }) => {
  return (
    <>
      <Divider />
      <Grid
        container
        alignItems="center"
        columnSpacing={1}
        px={2}
        py={1}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        {/* Project Name */}
        <Grid size={{xs: 12, md: 4}}>
          <Tooltip title="Project Name">
            <Typography variant="subtitle1" fontSize={14} noWrap>
              {project.name}
            </Typography>
          </Tooltip>
        </Grid>
        {/* Project Description */}
        <Grid size={{xs: 12, md: 6}}>
          <Tooltip title="Description">
            <Typography variant="body2" color="text.secondary" noWrap>
              {project.description || '—'}
            </Typography>
          </Tooltip>
        </Grid>
        {/* Actions */}
        <Grid size={{xs: 12, md: 2}}textAlign="end">
          <ProjectListItemAction project={project} />
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectListItem;
