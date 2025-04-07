import { ReactNode } from 'react';

export interface JumboListToolbarProps {
  /**
   * The main content of the toolbar
   */
  children?: ReactNode;
  /**
   * Actions to show when items are selected (bulk actions)
   */
  bulkActions?: ReactNode;
  /**
   * Whether to hide pagination controls
   */
  hidePagination?: boolean;
  /**
   * Whether to hide items per page selector
   */
  hideItemsPerPage?: boolean;
  /**
   * Action element to display on the toolbar
   */
  action?: ReactNode;
  /**
   * Action element to display at the end of the toolbar
   */
  actionTail?: ReactNode;
}