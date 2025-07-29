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
  project: Project & {
    category?: {
      id: number;
      name: string;
    };
  };
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
        {/* Name + Category */}
        <Grid size={{ xs: 12, md:3}}>
          <Tooltip title="Project Name">
            <Typography variant="subtitle1" fontSize={14} noWrap>
              {project.name}
            </Typography>
          </Tooltip>
          <Tooltip title="Category">
            <Typography variant="caption" color="text.secondary" noWrap>
              {project.category?.name || '—'}
            </Typography>
          </Tooltip>
        </Grid>

        {/* Description */}
        <Grid size={{ xs: 12, md:4}}>
          <Tooltip title="Description">
            <Typography variant="body2" color="text.secondary" noWrap>
              {project.description || '—'}
            </Typography>
          </Tooltip>
        </Grid>

        {/* Actions */}
        <Grid size={{ xs: 6, md:1}} textAlign="end">
          <ProjectListItemAction project={project} />
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectListItem;
