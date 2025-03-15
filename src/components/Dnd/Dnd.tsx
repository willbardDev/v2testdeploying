'use client';
import { useState } from 'react';

import { JumboDdMenu } from '@jumbo/components/JumboDdMenu';
import { Avatar, TableCell, Typography } from '@mui/material';
import { contactsList, menuItems } from './data';
import { SortableList } from './SortableList';

export function Dnd() {
  const [items, setItems] = useState(contactsList);

  return (
    <SortableList
      items={items}
      onChange={setItems}
      renderItem={(item) => (
        <SortableList.Item id={item.id}>
          <TableCell component={'div'} width={'3%'} sx={{ pl: 3 }}>
            <SortableList.DragHandle />
          </TableCell>
          <TableCell component={'div'} width={'3%'}>
            {item.thumb === null || item.thumb === '' ? (
              <Avatar sx={{ height: 44, width: 44 }}>
                {item.name.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <Avatar
                sx={{ height: 44, width: 44 }}
                alt={item.name}
                src={item.thumb}
              />
            )}
          </TableCell>
          <TableCell component={'div'} width={'15%'}>
            <Typography variant={'h6'} mb={0}>
              {item.name}
            </Typography>
          </TableCell>
          <TableCell component={'div'} width={'20%'}>
            <Typography variant={'h6'} mb={0}>
              {item.email}
            </Typography>
          </TableCell>
          <TableCell component={'div'} width={'15%'}>
            <Typography variant={'h6'} mb={0}>
              {item.phone}
            </Typography>
          </TableCell>
          <TableCell component={'div'} width={'15%'}>
            <Typography variant={'h6'} mb={0}>
              {item.designation}
            </Typography>
          </TableCell>
          <TableCell component={'div'} width={'4%'}>
            <JumboDdMenu menuItems={menuItems} />
          </TableCell>
        </SortableList.Item>
      )}
    />
  );
}
