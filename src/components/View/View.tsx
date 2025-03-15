import React from 'react';
import { GridView } from './GridView';
import { ListView } from './ListView';

interface ViewProps<T> {
  variant: 'list' | 'grid';
  dataSource: T[];
  renderItem: React.ElementType;
}

function View<T>({ variant, dataSource, renderItem }: ViewProps<T>) {
  if (variant === 'list')
    return <ListView<T> dataSource={dataSource} renderItem={renderItem} />;

  return <GridView<T> dataSource={dataSource} renderItem={renderItem} />;
}

export { View };
