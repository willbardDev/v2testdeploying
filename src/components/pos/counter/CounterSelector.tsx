import { Autocomplete, Divider, Grid, LinearProgress, TextField } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Counter, Outlet, useCounter } from './CounterProvider';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import posServices from '../pos-services';

interface UserOutletsParams {
    userId?: string;
    organizationId?: string;
}

const CounterSelector = () => {
    const { authUser, authOrganization } = useJumboAuth();
    const organization = authOrganization?.organization;

    const userOutletsParams: UserOutletsParams = {
        userId: authUser?.user?.id,
        organizationId: organization?.id,
    };

    const {
        data: rawOutlets = [],
        isFetching
    } = useQuery<Outlet[], Error, Outlet[], ['userSalesOutlets', UserOutletsParams]>({
        queryKey: ['userSalesOutlets', userOutletsParams],
        queryFn: ({ queryKey }) => posServices.getUserOutlets(queryKey[1]),
        enabled: !!authUser?.user?.id && !!organization?.id,
    });

    // Add synthetic "All Outlets" option
    const outlets: Outlet[] = useMemo(() => {
        const allOutlet: any = {
            id: 'all',
            name: 'All Outlets',
            counters: [{ id: 'all', name: 'All' }],
        };
        return [allOutlet, ...rawOutlets];
    }, [rawOutlets]);

    const [counters, setCounters] = useState<Counter[]>([]);
    const { activeCounter, setActiveCounter, setOutlet } = useCounter();

    useEffect(() => {
        if (rawOutlets.length === 1) {
            const singleOutlet = rawOutlets[0];
            setOutlet(singleOutlet);
            setCounters(singleOutlet.counters);
            if (singleOutlet.counters.length > 0) {
                setActiveCounter(singleOutlet.counters[0]);
            }
        }
    }, [rawOutlets, setOutlet, setActiveCounter]);

    if (isFetching) {
        return <LinearProgress />;
    }

    return (
        <Grid container padding={1} columnSpacing={1} rowGap={2} justifyContent={'center'}>
            <Grid size={{xs: 12, md: 4}}>
                <Autocomplete<Outlet>
                    size="small"
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    options={outlets}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                        <TextField {...params} label="Outlet" />
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
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    options={counters}
                    getOptionLabel={(option) => option.name}
                    value={activeCounter}
                    renderInput={(params) => (
                        <TextField {...params} label="Counter" />
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
};

export default CounterSelector;
