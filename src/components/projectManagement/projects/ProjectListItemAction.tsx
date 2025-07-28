import { DeleteOutlined, EditOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { Dialog, Tooltip, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuItemProps } from '@jumbo/types';
import { JumboDdMenu } from '@jumbo/components';
import ProjectFormDialog from './ProjectFormDialog';
import projectServices from './project-services';
import { Project } from './ProjectTypes';

const ProjectListItemAction = ({ project }: { project: Project }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { showDialog, hideDialog } = useJumboDialog();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { theme } = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const { mutate: deleteProject } = useMutation({
    mutationFn: (params: { id: number }) => projectServices.delete(params.id),
    onSuccess: (data: { message: string }) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error?.response?.data?.message || 'Failed to delete project',
        { variant: 'error' }
      );
    },
  });

  const menuItems: MenuItemProps[] = [
    { icon: <EditOutlined />, title: 'Edit', action: 'edit' },
    { icon: <DeleteOutlined color="error" />, title: 'Delete', action: 'delete' },
  ];

  const handleItemAction = (menuItem: MenuItemProps) => {
    switch (menuItem.action) {
      case 'edit':
        setOpenEditDialog(true);
        break;
      case 'delete':
        showDialog({
          title: 'Confirm Project Deletion',
          content: 'Are you sure you want to delete this project?',
          onYes: () => {
            hideDialog();
            deleteProject({ id: project.id ?? 0 });
          },
          onNo: () => hideDialog(),
          variant: 'confirm',
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Dialog
        open={openEditDialog}
        fullWidth
        maxWidth="sm"
        fullScreen={belowLargeScreen}
      >
        <ProjectFormDialog
          project={project}
          setOpenDialog={setOpenEditDialog}
        />
      </Dialog>
      <JumboDdMenu
        icon={
          <Tooltip title="Actions">
            <MoreHorizOutlined fontSize="small" />
          </Tooltip>
        }
        menuItems={menuItems}
        onClickCallback={handleItemAction}
      />
    </>
  );
};

export default ProjectListItemAction;
