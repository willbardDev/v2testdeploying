import { ASSET_AVATARS } from '@/utilities/constants/paths';
import { getAssetPath } from '@/utilities/helpers';
import { CloseOutlined, ExpandLess, ExpandMore } from '@mui/icons-material'
import { Avatar, Checkbox, Collapse, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@mui/material'
import React, { useState, useEffect } from 'react'

interface Role {
  id: number;
  name: string;
}

interface NewProsAfrican {
  id?: string;
  name: string;
  email: string;
  roles?: Role[];
  selectedRoles: Role[] | number[];
}

interface ProsAfricansAddNewMemberQueueItemProps {
  newProsAfrican: NewProsAfrican;
  setaddNewProsAfrican: React.Dispatch<React.SetStateAction<NewProsAfrican[]>>;
  addNewProsAfrican: NewProsAfrican[];
}

export const ProsAfricansAddNewMemberQueueItem: React.FC<ProsAfricansAddNewMemberQueueItemProps> = ({
  newProsAfrican,
  setaddNewProsAfrican,
  addNewProsAfrican
}) => {
    const [expanded, setExpanded] = useState(true);
    const [selectedRoles, setSelectedRoles] = useState<number[]>(
      Array.isArray(newProsAfrican.selectedRoles) 
        ? newProsAfrican.selectedRoles.filter((role): role is number => typeof role === 'number')
        : []
    );

    useEffect(() => {
        setaddNewProsAfrican(prevaddNewProsAfrican => prevaddNewProsAfrican.map(item => 
          item.email === newProsAfrican.email ? {
            ...item,
            selectedRoles
          } : item
        ));
    }, [selectedRoles, newProsAfrican.email, setaddNewProsAfrican]);

    const handleChecked = (target: HTMLInputElement) => {
        const roleId = parseInt(target.value);
        
        if (target.checked) {
            setSelectedRoles(prev => [...prev, roleId]);
        } else {
            setSelectedRoles(prev => prev.filter(id => id !== roleId));
        }
    };

    return (
        <React.Fragment>
            <ListItem>
                <ListItemAvatar>
                    <Avatar alt={newProsAfrican.name} src={getAssetPath(`${ASSET_AVATARS}/avatar5.jpg`)}/>
                </ListItemAvatar>
                <ListItemText primary={newProsAfrican.name} secondary={newProsAfrican.email}/>

                {
                    newProsAfrican.name !== 'Not Registered' && newProsAfrican.roles && (
                        <IconButton onClick={() => setExpanded(!expanded)}>
                        { 
                            expanded ? <ExpandLess/> : <ExpandMore/>
                        }
                        </IconButton>
                    )
                }
                <ListItemSecondaryAction>
                    <IconButton onClick={() => setaddNewProsAfrican(addNewProsAfrican.filter(item => item.email !== newProsAfrican.email))}>
                        <CloseOutlined color='error'/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            {
                newProsAfrican.name !== 'Not Registered' && newProsAfrican.roles && newProsAfrican.roles.map((role) => {
                    return (
                        <Collapse key={role.id} in={expanded} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        <Checkbox 
                                            value={role.id} 
                                            onChange={(e) => handleChecked(e.target as HTMLInputElement)} 
                                            checked={selectedRoles.includes(role.id)}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={role.name}/>
                                </ListItem>
                            </List>
                        </Collapse>
                    );
                })
            }
            <Divider variant="inset" component="li"/>
        </React.Fragment>
    );
};