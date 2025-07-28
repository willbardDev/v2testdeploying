import React from 'react';
import {
  Divider,
  Grid,
  Typography,
  Tooltip,
  Chip,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import Badge from '@mui/material/Badge';
import { Project } from './ProjectType';
import ProjectListItemAction from './ProjectListItemAction';

interface ProjectItemProps {
  project: Project;
}

const StyledCountBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -6,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    fontSize: '0.75rem',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    fontWeight: 600,
    borderRadius: '50%',
    height: 18,
    minWidth: 18,
  },
}));

const StyledBadgeChip = styled(Chip)(({ theme }) => ({
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 500,
  backgroundColor: theme.palette.grey[100],
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
}));

const ProjectListItem: React.FC<ProjectItemProps> = ({ project }) => {
  return (
    <>
      <Divider />
      <Grid
        container
        spacing={1}
        alignItems="center"
        px={2}
        py={1}
        paddingRight={3}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        {/* Name + Category */}
        <Grid item xs={12} md={3}>
          <Tooltip title={project.name}>
            <Typography variant="subtitle1" noWrap>
              {project.name}
            </Typography>
          </Tooltip>
          <Tooltip title={project.category?.name ?? 'No Category'}>
            <Typography variant="caption" color="text.secondary" noWrap>
              {project.category?.name ?? 'No Category'}
            </Typography>
          </Tooltip>
        </Grid>

        {/* Description */}
        <Grid item xs={12} md={4}>
          <Tooltip title={project.description ?? ''}>
            <Typography variant="body2" noWrap>
              {project.description}
            </Typography>
          </Tooltip>
        </Grid>

        {/* Stakeholders (Clients) */}
        <Grid item xs={12} md={3}>
          <Stack direction="row" spacing={0.5} rowGap={0.5} flexWrap="wrap" useFlexGap>
            {project.clients?.map((client) => (
              <Tooltip key={client.id} title={client.name}>
                <StyledBadgeChip label={client.name} size="small" />
              </Tooltip>
            ))}
          </Stack>
        </Grid>

        {/* Team Members Count */}
        <Grid item xs={6} md={1} container justifyContent="flex-end">
          <Tooltip title={`Team Members: ${project.users?.length ?? 0}`}>
            <StyledCountBadge badgeContent={project.users?.length ?? 0} color="primary">
              <PeopleOutlinedIcon fontSize="small" />
            </StyledCountBadge>
          </Tooltip>
        </Grid>

        {/* Action Menu */}
        <Grid item xs={6} md={1} textAlign="end">
          <ProjectListItemAction project={project} />
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectListItem;
