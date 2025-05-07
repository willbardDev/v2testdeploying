import React, { useState } from 'react';
import { Alert, Dialog, IconButton, Stack, Tooltip, useMediaQuery } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import SubscriptionsForm from './SubscriptionsForm';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { Div } from '@jumbo/shared';
import SubscriptionItem from './SubscriptionItem';
import { Subscription } from './SubscriptionTypes';

function Subscriptions() {
    const { authOrganization } = useJumboAuth();
    const [openDialog, setOpenDialog] = useState(false);
    const active_subscriptions = authOrganization?.organization?.active_subscriptions as Subscription[] | undefined;

    // Screen handling constants
    const { theme } = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

    return (
        <Div sx={{ p: 1 }}>
            <Dialog maxWidth='lg' fullWidth fullScreen={belowLargeScreen} open={openDialog}>
                <SubscriptionsForm setOpenDialog={setOpenDialog}/>
            </Dialog>
            <Stack direction={'row'} justifyContent={'end'} p={1}>
                <Tooltip title='Add Subscription'>
                    <IconButton 
                        onClick={() => setOpenDialog(true)}
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                                borderColor: 'primary.main',
                            }
                        }}
                    >
                        <AddOutlined/>
                    </IconButton>
                </Tooltip>
            </Stack>
            {active_subscriptions && active_subscriptions.length > 0 ? (
                <React.Fragment>
                    {active_subscriptions.map((subscription: Subscription) => (
                        <SubscriptionItem 
                            key={subscription.id} 
                            subscription={subscription}
                            isFromProsAfricanSubscriptions={false}
                        />
                    ))}
                </React.Fragment>
            ) : (
                <Alert variant="outlined" severity="warning">
                    You don't have any active subscription, Please make sure you subscribe to the modules you need to prevent any inconveniences
                </Alert>
            )}
        </Div>
    );
}

export default Subscriptions;