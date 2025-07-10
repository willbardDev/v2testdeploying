import { Icon } from '@jumbo/components/Icon';
import { Div } from '@jumbo/shared';
import { MenuItems, NavbarGroup, NavbarItem } from '@jumbo/types';
import { getNavChildren, isNavGroup, isNavItem } from '@jumbo/utilities/helpers';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SxProps,
  Theme,
  Collapse
} from '@mui/material';
import React from 'react';
import { useJumboNavGroupSx, useJumboNavbar } from '../../hooks';
import { SubMenusCollapsible } from './components/SubMenusCollapsible';
import { SubMenusPopover } from './components/SubMenusPopover';
import { JumboNavItem } from '../JumboNavItem';

type JumboNavGroupProps = {
  item: NavbarGroup | undefined;
  depth?: number;
  isNested?: boolean;
};

const JumboNavGroup = React.memo(function JumboNavGroup({
  item,
  depth = 0,
  isNested = false
}: JumboNavGroupProps) {
  const [state, dispatch] = React.useReducer(
    (prevState: { open: boolean; anchorEl: HTMLLIElement | null }, 
    action: { type: string; payload?: any }
  ) => {
    switch (action.type) {
      case 'TOGGLE_OPEN':
        return { ...prevState, open: !prevState.open };
      case 'SET_ANCHOR':
        return { ...prevState, anchorEl: action.payload };
      case 'RESET':
        return { open: false, anchorEl: null };
      default:
        return prevState;
    }
  }, { open: false, anchorEl: null });

  const { miniAndClosed, groupBehaviour } = useJumboNavbar();
  const navGroupSx: SxProps<Theme> = useJumboNavGroupSx();

  const handlePopoverOpen = React.useCallback(
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      dispatch({ type: 'SET_ANCHOR', payload: event.currentTarget });
    },
    []
  );

  const handlePopoverClose = React.useCallback(() => {
    dispatch({ type: 'SET_ANCHOR', payload: null });
  }, []);

  const toggleOpen = React.useCallback(() => {
    dispatch({ type: 'TOGGLE_OPEN' });
  }, []);

  const renderItem = React.useCallback(() => {
    if (!item) return null;
    
    if (miniAndClosed) {
      if (!item.icon) return null;
      return (
        <ListItemIcon sx={{ 
          minWidth: miniAndClosed ? 20 : 32, 
          color: 'inherit',
          justifyContent: 'center'
        }}>
          <Icon name={item.icon} fontSize={'small'} />
        </ListItemIcon>
      );
    }

    return (
      <>
        <Div sx={{
          position: 'absolute',
          left: 5,
          display: 'inline-flex',
          top: '50%',
          transform: 'translateY(-50%)',
        }}>
          {state.open ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
        </Div>
        <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>
          <Icon name={item.icon} fontSize={'small'} />
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          sx={{
            m: 0,
            '& .MuiTypography-root': {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
        />
      </>
    );
  }, [item, miniAndClosed, state.open]);

  const renderChildren = React.useMemo(() => {
    if (!item || !state.open || miniAndClosed || !item.children) return null;

    return (
      <Collapse in={state.open} timeout="auto" unmountOnExit>
        {item.children.map((child, index) => {
          if (isNavItem(child)) {
            return (
              <JumboNavItem
                key={`${child.path}-${index}`}
                item={child}
                isNested={true}
                depth={depth + 1}
              />
            );
          }
          if (isNavGroup(child)) {
            return (
              <JumboNavGroup
                key={`${child.label}-${index}`}
                item={child}
                depth={depth + 1}
                isNested={true}
              />
            );
          }
          return null;
        })}
      </Collapse>
    );
  }, [item, state.open, miniAndClosed, depth]);

  if (!item) return null;

  const subMenus: MenuItems = getNavChildren(item);

  return (
    <>
      <ListItemButton
        component={'li'}
        aria-expanded={state.open}
        aria-haspopup={groupBehaviour === 'popover'}
        aria-controls={state.open ? `nav-group-${item.label}` : undefined}
        onClick={toggleOpen}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        sx={{
          ...navGroupSx,
          pl: isNested ? (depth * 2) + 2 : 2,
          position: 'relative',
          '&:hover': {
            backgroundColor: (theme) => theme.palette.action.hover,
          },
          ...(state.open && {
            backgroundColor: (theme) => theme.palette.action.selected,
          }),
        }}
      >
        {renderItem()}
      </ListItemButton>

      {renderChildren}

      {subMenus && groupBehaviour === 'collapsible' && (
        <SubMenusCollapsible
          items={subMenus}
          open={state.open}
          miniAndClosed={miniAndClosed}
        />
      )}
      {subMenus && groupBehaviour === 'popover' && (
        <SubMenusPopover
          items={subMenus}
          anchorEl={state.anchorEl}
          onClose={handlePopoverClose}
          miniAndClosed={miniAndClosed}
        />
      )}
    </>
  );
}, 
(prevProps, nextProps) => {
  return prevProps.item?.label === nextProps.item?.label && 
         prevProps.item?.children?.length === nextProps.item?.children?.length &&
         prevProps.depth === nextProps.depth &&
         prevProps.isNested === nextProps.isNested;
});

export { JumboNavGroup };