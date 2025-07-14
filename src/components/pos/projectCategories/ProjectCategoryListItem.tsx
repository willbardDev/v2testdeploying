import { Category } from '@mui/icons-material';
import { Divider, Grid, Tooltip, Typography } from '@mui/material';
import React from 'react';
import ProjectCategoryListItemAction from './ProjectCategoryListItemActio';
import { projectCategory } from './ProjectCategoriesType';


type Props = {
  projectCategory: {
    id: number;
    name: string;
    description?: string;
  };
};

const ProjectCategoryListItem = ({ projectCategory }: Props) => {
  return (
    <>
      <Divider />
      <Grid
        container
        alignItems="center"
        columnSpacing={1}
        paddingLeft={2}
        paddingRight={2}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Grid size={{xs: 6, md: 5}}>
          <Tooltip title="Category Name">
            <Typography variant="h6" fontSize={14} lineHeight={1.25} noWrap>
              {projectCategory.name}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid size={{xs: 16, md: 6}}>
          <Tooltip title="Description">
            <Typography fontSize={13} color="text.secondary" noWrap>
              {projectCategory.description || '—'}
            </Typography>
          </Tooltip>
        </Grid>
         <ProjectCategoryListItemAction projectCategory={{
            id: 0,
            name: '',
            description: ''
          }}/>
      </Grid>
    </>
  );
};

export default ProjectCategoryListItem;
