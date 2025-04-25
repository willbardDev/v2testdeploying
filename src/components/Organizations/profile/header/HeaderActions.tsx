'use client'

import { DashboardOutlined, Edit, KeyboardArrowRight } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Tooltip } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useOrganizationProfile } from '../OrganizationProfileProvider';
import { useBasicAuth } from '@/app/auth-providers/BasicAuth/BasicAuth';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import { Organization } from '@/types/auth-types';
import { useRouter } from 'next/navigation';

export const HeaderActions: React.FC = () => {
    const router = useRouter();
    const { organization }: { organization?: Organization } = useOrganizationProfile();
    const { loadOrganization } = useBasicAuth();
    const { authOrganization, checkOrganizationPermission } = useJumboAuth();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const isAuthOrganization = authOrganization?.organization?.id === organization?.id;

    const onLoad = async (): Promise<void> => {
        if (!organization) return;

        if (authOrganization?.organization?.id !== organization.id) {
            setIsLoading(true);
            try {
                await loadOrganization(
                    organization.id,
                    (response) => {
                        enqueueSnackbar(
                            `${organization.name} is loaded to an active organization`,
                            {
                                variant: 'success'
                            }
                        );
                    },
                    (error: Error) => {
                        enqueueSnackbar(
                            'Something went wrong',
                            {
                                variant: 'error'
                            }
                        );
                    }
                );
            } catch (error) {
                enqueueSnackbar(
                    'Failed to load organization',
                    {
                        variant: 'error'
                    }
                );
            } finally {
                setIsLoading(false);
            }
        } else {
            router.push('/');
        }
    };

    if (!organization) {
        return null;
    }

    return (
        <div className="flex gap-2">
            <Tooltip title={`Load ${organization.name}`}>
                <LoadingButton
                    onClick={onLoad}
                    disableRipple
                    loading={isLoading}
                    size="medium"
                    variant="text"
                    startIcon={isAuthOrganization ? <DashboardOutlined /> : <KeyboardArrowRight />}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'transparent'
                        }
                    }}
                >
                    {isAuthOrganization ? 'Dashboard' : 'Load'}
                </LoadingButton>
            </Tooltip>

            {isAuthOrganization && checkOrganizationPermission(PERMISSIONS.ORGANIZATION_UPDATE) && (
                <Button
                    onClick={() => router.push(`/organizations/edit/${organization.id}`)}
                    disableRipple
                    size="medium"
                    variant="text"
                    startIcon={<Edit />}
                    sx={{
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: 'transparent'
                        }
                    }}
                >
                    Edit
                </Button>
            )}
        </div>
    );
};