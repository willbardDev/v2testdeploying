'use client'

import React from "react";
import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { Button, LinearProgress } from "@mui/material";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import TreeItemLabel from "./TreeItemLabel";
import { useLedgerGroup } from "./LedgerGroupProvider";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Div } from "@jumbo/shared";

export interface TreeNode {
  id: number;
  name: string;
  is_editable: number;
  children?: TreeNode[];
  ledger_group_id?: number | null;
  code?: string | null;
  alias?: string | null;
  description?: string;
  nature_id?: number;
  original_name?: string;
}

export default function LedgerGroupTree() {
  const { ledgerGroups, isPending, ledgerGroupOptionIds } = useLedgerGroup();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  
  const handleItemToggle = (
    event: React.SyntheticEvent<Element, Event> | null, 
    itemIds: string[]
  ) => {
    setExpandedItems(itemIds);
  };

  const handleExpandClick = () => {
    setExpandedItems((prev) => 
      prev.length === 0 ? ledgerGroupOptionIds : []
    );
  };

  const renderTree = (nodes: TreeNode[] = []) => {
    return nodes.map((node) => (
      <TreeItem 
        key={node.id.toString()}
        itemId={node.id.toString()}
        label={<TreeItemLabel node={node} />}
      >
        {node.children ? renderTree(node.children) : null}
      </TreeItem>
    ));
  };

  return (
    <JumboCardQuick sx={{ borderRadius: 2 }}>
      {isPending ? (
        <LinearProgress />
      ) : (
        <>
          <Div sx={{ mb: 1 }}>
            <Button onClick={handleExpandClick}>
              {expandedItems.length === 0 ? 'Expand all' : 'Collapse all'}
            </Button>
          </Div>
          <SimpleTreeView
            aria-label="Ledger Group Tree"
            slots={{
              expandIcon: ExpandMore,
              collapseIcon: ChevronRight,
            }}
            expandedItems={expandedItems}
            onExpandedItemsChange={handleItemToggle}
            sx={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              minHeight: 230,
              '& .MuiTreeItem-content': {
                padding: '4px 8px'
              }
            }}
          >
            {renderTree(ledgerGroups || [])}
          </SimpleTreeView>
        </>
      )}
    </JumboCardQuick>
  );
}