'use client';
import { LabelForm } from '@/components/ContactApp/LabelForm';
import { LabelProps } from '@/components/LabelsWithChip/data';
import { JumboDdMenu } from '@jumbo/components';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { MenuItemProps } from '@jumbo/types';
import useSwalWrapper from '@jumbo/vendors/sweetalert2/hooks';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LabelIcon from '@mui/icons-material/Label';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

const labelMenuItems = [
  { icon: <EditIcon />, title: 'Edit', action: 'edit' },
  { icon: <DeleteIcon />, title: 'Delete', action: 'delete' },
];

const LabelItem = ({ label }: { label: LabelProps }) => {
  const router = useRouter();
  const { showDialog, hideDialog } = useJumboDialog();
  const Swal = useSwalWrapper();
  const handleMoreAction = React.useCallback(
    (menuItem: MenuItemProps) => {
      switch (menuItem?.action) {
        case 'edit':
          showDialog({
            title: 'Edit label',
            content: <LabelForm label={label} />,
          });
          break;
        case 'delete':
          showDialog({
            variant: 'confirm',
            title: 'Are you sure?',
            content: 'Once you delete a label that cannot be reversed.',
            onYes: () => {
              hideDialog();
              return Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Label is deleted successfully.',
                showConfirmButton: false,
                timer: 1500,
              });
            },
            onNo: () => hideDialog(),
          });
      }
    },
    [Swal, hideDialog, label, showDialog]
  );

  return (
    <MenuItem component={'div'} disableRipple sx={{ p: 0, my: 0 }}>
      <ListItemIcon
        sx={{ color: label.color }}
        onClick={() => router.push(`/apps/contact/label/${label.id}`)}
      >
        <LabelIcon fontSize={'small'} />
      </ListItemIcon>
      <ListItemText
        onClick={() => router.push(`/apps/contact/label/${label.id}`)}
      >
        {label.name}
      </ListItemText>
      <JumboDdMenu
        icon={<MoreHorizIcon />}
        menuItems={labelMenuItems}
        onClickCallback={handleMoreAction}
      />
    </MenuItem>
  );
};
export { LabelItem };
