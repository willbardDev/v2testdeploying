'use client'

import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { AddOutlined, ListOutlined, ViewComfy } from '@mui/icons-material';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import React from 'react';
import { useOrganizationProfile } from '../OrganizationProfileProvider';
import { InvitationForm } from './InvitationForm';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';

interface ActionTailProps {
  view: 'list' | 'grid';
  setView: (view: 'list' | 'grid') => void;
}

export const ActionTail: React.FC<ActionTailProps> = ({ view, setView }) => {
    const { showDialog } = useJumboDialog();
    const { organization } = useOrganizationProfile();
    const { checkOrganizationPermission, authOrganization } = useJumboAuth();

    const handleInviteClick = () => {
        if (!organization) return;
        
        showDialog({
            title: 'Invite Users',
            content: <InvitationForm organization={organization} />,
        });
    };

    return (
        <ButtonGroup
            variant="outlined"
            size="small"
            disableElevation
            sx={{
                '& .MuiButton-root': {
                    px: 1
                }
            }}
        >
            <Tooltip title="List View">
                <Button 
                    variant={view === "list" ? "contained" : "outlined"}
                    onClick={() => setView("list")}
                >
                    <ListOutlined />
                </Button>
            </Tooltip>
            <Tooltip title="Grid View">
                <Button 
                    variant={view === "grid" ? "contained" : "outlined"}
                    onClick={() => setView("grid")}
                >
                    <ViewComfy />
                </Button>
            </Tooltip>
            {authOrganization?.organization?.id === organization?.id && 
                checkOrganizationPermission(PERMISSIONS.USERS_INVITE) && (
                    <Tooltip title="Invite Users">
                        <Button onClick={handleInviteClick}>
                            <AddOutlined />
                        </Button>
                    </Tooltip>
                )
            }
        </ButtonGroup>
    );
};