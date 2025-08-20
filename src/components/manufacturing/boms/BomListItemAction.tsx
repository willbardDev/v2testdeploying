import { DeleteOutlined, EditOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { Dialog, Tooltip, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MenuItemProps } from '@jumbo/types';
import { JumboDdMenu } from '@jumbo/components';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import bomsServices from './boms-services';
import BomsForm from './form/BomForm';
import { Product } from '@/components/productAndServices/products/ProductType';
import { BOMItem } from './BomType';

export interface BOM {
  id: number;
  product?: Product | null;
  product_id: number;
  quantity: number;
  measurement_unit_id?: number | null;
  conversion_factor?: number | null;
  items: BOMItem[];
  alternatives?: BOMItem[]
}

const BomsListItemAction: React.FC<{ bom: BOM }> = ({ bom }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { showDialog, hideDialog } = useJumboDialog();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { theme } = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const { mutate: deleteBom } = useMutation({
    mutationFn: (params: { id: number }) => bomsServices.delete(params),
    onSuccess: (data: { message: string }) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['boms'] });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error?.response?.data?.message || 'Failed to delete BOM',
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
          title: 'Confirm BOM Deletion',
          content: `Are you sure you want to delete BOM ${bom.id}?`,
          onYes: () => {
            hideDialog();
            deleteBom({ id: bom.id });
          },
          onNo: hideDialog,
          variant: 'confirm',
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        fullWidth
        maxWidth="md"
        fullScreen={belowLargeScreen}
        onClose={() => setOpenEditDialog(false)}
      >
        <BomsForm
          open={true}
          bomId={bom.id} // Pass the BOM ID instead of the full bom object
          toggleOpen={setOpenEditDialog}
          onSuccess={() => setOpenEditDialog(false)}
        />
      </Dialog>

      {/* Actions Menu */}
      <JumboDdMenu
        icon={
          <Tooltip title="BOM Actions">
            <MoreHorizOutlined fontSize="small" />
          </Tooltip>
        }
        menuItems={menuItems}
        onClickCallback={handleItemAction}
      />
    </>
  );
};

export default BomsListItemAction;