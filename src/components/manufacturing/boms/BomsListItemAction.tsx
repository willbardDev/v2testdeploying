import { DeleteOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuItemProps } from '@jumbo/types';
import { JumboDdMenu } from '@jumbo/components';
import bomsServices from './boms-services';
import { BOM } from './BomsType';

const BomsListItemAction = ({ bom}: { bom: BOM }) => {
  const { showDialog, hideDialog } = useJumboDialog();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate: deleteBom } = useMutation({
    mutationFn: (params: { id: number }) => bomsServices.delete(params),
    onSuccess: (data: { message: string }) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['boms'] }); // Make sure query key matches your list
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error?.response?.data?.message || 'Failed to delete BOM',
        { variant: 'error' }
      );
    },
  });

  const menuItems: MenuItemProps[] = [
    { icon: <DeleteOutlined color="error" />, title: 'Delete', action: 'delete' },
  ];

  const handleItemAction = (menuItem: MenuItemProps) => {
    switch (menuItem.action) {
      case 'delete':
        showDialog({
          title: 'Confirm BOM Deletion',
          content: 'Are you sure you want to delete this BOM?',
          onYes: () => {
            hideDialog();
            deleteBom({ id: bom.id ?? 0 });
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
    <JumboDdMenu
      icon={
        <Tooltip title="Actions">
          <MoreHorizOutlined fontSize="small" />
        </Tooltip>
      }
      menuItems={menuItems}
      onClickCallback={handleItemAction}
    />
  );
};

export default BomsListItemAction;