'use client'

import React, { useEffect } from 'react';
import Avatar from "@mui/material/Avatar";
import styled from "@emotion/styled";
import Typography from "@mui/material/Typography";
import { useOrganizationProfile } from '../OrganizationProfileProvider';
import { HeaderActions } from './HeaderActions';
import { Grid } from '@mui/material';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import { ASSET_AVATARS } from '@/utilities/constants/paths';
import { getAssetPath } from '@/utilities/helpers';
import { useRouter } from 'next/navigation';

const Item = styled("div")({
    textAlign: 'center',
});

export const Header = () => {
    const { checkOrganizationPermission, authOrganization } = useJumboAuth();
    const { organization } = useOrganizationProfile();
    const router = useRouter();

    useEffect(() => {
        if (
            !organization ||
            !authOrganization?.organization?.id ||
            authOrganization.organization.id !== organization.id ||
            !checkOrganizationPermission(PERMISSIONS.ORGANIZATION_PROFILE)
        ) {
            router.push('/');
        }
    }, [authOrganization, organization, checkOrganizationPermission, router]);

    if (!organization) {
        return null;
    }

    return (
        <Grid container mb={2}>
            <Grid size={{xs: 3, md: 2, lg: 1}}>
                <Avatar
                    sx={{ width: 72, height: 72 }}
                    alt={organization.name}
                    src={getAssetPath(`${ASSET_AVATARS}/${organization.logo || 'default.png'}`, "72x72")}
                />
            </Grid>
            <Grid size={{xs: 9, md: 10, lg: 5}}>
                <Typography variant='h3'>{organization.name}</Typography>
                <Typography fontSize={12} variant='body1' color='inherit' mt={0.5}>
                    {organization.address}
                </Typography>
            </Grid>
            <Grid size={{xs: 12, lg: 6}}>
                <Grid container display='flex' justifyContent='flex-end'>
                    {organization.email && (
                        <Grid size={{xs: 12, md: 6, lg: 6}}>
                            <Item>
                                <Typography variant='h6' color='inherit' mb={0}>
                                    {organization.email}
                                </Typography>
                                <Typography variant='body1' fontSize={12}>Email</Typography>
                            </Item>
                        </Grid>
                    )}
                    {organization.tin && (
                        <Grid size={{xs: 6, md: 3}}>
                            <Item>
                                <Typography variant='h6' color='inherit' mb={0}>
                                    {organization.tin}
                                </Typography>
                                <Typography variant='body1' fontSize={12}>TIN</Typography>
                            </Item>
                        </Grid>
                    )}
                    {organization.phone && (
                        <Grid size={{xs: 6, md: 3}}>
                            <Item>
                                <Typography variant='h6' color='inherit' mb={0}>
                                    {organization.phone}
                                </Typography>
                                <Typography variant='body1' fontSize={12}>Phone</Typography>
                            </Item>
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <Grid size={{xs: 12 }} display='flex' justifyContent='flex-end'>
                <HeaderActions />
            </Grid>
        </Grid>
    );
};
