import DragHandleIcon from '@mui/icons-material/DragHandle';
import { IconButton } from '@mui/material';
import { useContext } from 'react';
import { SortableItemContext } from '../SortableItem';

export function DragHandle() {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <IconButton {...attributes} {...listeners} ref={ref}>
      <DragHandleIcon />
    </IconButton>
  );
}
