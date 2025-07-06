import { Autocomplete, Divider, Grid, LinearProgress, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Counter, Outlet, useCounter } from './CounterProvider';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import posServices from '../pos-services';

interface UserOutletsParams {
    userId?: string;
    organizationId?: string;
}

function CounterSelector() {
    const { authUser, authOrganization } = useJumboAuth();
    const organization = authOrganization?.organization;

    const userOutletsParams = {
        userId: authUser?.user?.id,
        organizationId: organization?.id
    };

    const { 
        data: outlets, 
        isFetching 
    } = useQuery<Outlet[], Error, Outlet[], ['userSalesOutlets', UserOutletsParams]>({
        queryKey: ['userSalesOutlets', userOutletsParams],
        queryFn: ({ queryKey }) => posServices.getUserOutlets(queryKey[1]),
        enabled: !!authUser?.user?.id && !!organization?.id,
    });

    const [counters, setCounters] = useState<Counter[]>([]);
    const { activeCounter, setActiveCounter, setOutlet } = useCounter();

    useEffect(() => {
        if (outlets?.length === 1) {
            setOutlet(outlets[0]);
            setCounters(outlets[0].counters);
            if (outlets[0].counters.length > 0) {
                setActiveCounter(outlets[0].counters[0]);
            }
        }
    }, [outlets, setOutlet, setActiveCounter]);

    if (isFetching) {
        return <LinearProgress />;
    }

    return (
        <Grid container padding={1} columnSpacing={1} rowGap={2} justifyContent={'center'}>
            <Grid size={{xs: 12, md: 4}}>
                <Autocomplete<Outlet>
                    size="small"
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    options={outlets || []}
                    getOptionLabel={(option) => option.name}
                    defaultValue={outlets?.length === 1 ? outlets[0] : null}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            label="Outlet"
                        />
                    )}
                    onChange={(event, newValue) => {
                        if (newValue) {
                            setOutlet(newValue);
                            setCounters(newValue.counters);
                            if (newValue.counters.length > 0) {
                                setActiveCounter(newValue.counters[0]);
                            }
                        } else {
                            setCounters([]);
                            setActiveCounter(null);
                            setOutlet(null);
                        }
                    }}
                />
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
                <Autocomplete<Counter>
                    size="small"
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    options={counters}
                    getOptionLabel={(option) => option.name}
                    value={activeCounter}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            label="Counter"
                        />
                    )}
                    onChange={(event, newValue) => {
                        setActiveCounter(newValue);
                    }}
                    disabled={counters.length === 0}
                />
            </Grid>
            <Grid size={12}>
                <Divider />
            </Grid>
        </Grid>
    );
}

export default CounterSelector;