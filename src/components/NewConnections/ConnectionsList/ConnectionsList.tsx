'use client';
import { List } from '@mui/material';
import { useCallback, useState } from 'react';
import { ConnectionItem } from '../ConnectionItem';
import { ConnectionDataObject, connections } from '../data';

function ConnectionsList() {
  const [itemsList, setItemsList] = useState(connections);
  const handleFollowToggle = useCallback(
    (record: ConnectionDataObject) => {
      const newConnections = itemsList.map((item) => {
        if (record.id === item.id) return { ...record, follow: !item.follow };

        return item;
      });
      setItemsList(newConnections);
    },
    [itemsList]
  );

  return (
    <List disablePadding>
      {itemsList.map((item, index) => (
        <ConnectionItem
          item={item}
          key={index}
          handleFollowToggle={handleFollowToggle}
        />
      ))}
    </List>
  );
}

export { ConnectionsList };
