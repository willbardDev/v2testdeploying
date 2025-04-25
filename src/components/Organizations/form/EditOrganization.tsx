'use client'

import React, { useEffect } from 'react';
import { CenteredSpinner } from '@/shared/ProgressIndicators/CenteredSpinner';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import Head from 'next/head';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/services/config';
import OrganizationForm from '@/components/Organizations/form/OrganizationForm';
import { useParams, useRouter } from 'next/navigation';
import { Organization } from '@/types/auth-types';

interface OrganizationResponse {
  organization: Organization;
}

const EditOrganization: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const organization_id = params?.id as string;
  const { checkOrganizationPermission, authOrganization } = useJumboAuth();

  const { data, isLoading, error } = useQuery<OrganizationResponse>({
    queryKey: ['organizationDetails', organization_id],
    queryFn: async () => {
      const response = await axios.get(`/organizations/${organization_id}`);
      return response.data;
    },
    enabled: !!organization_id && !!authOrganization?.organization?.id,
  });

  useEffect(() => {
    if (!organization_id || !authOrganization?.organization?.id) return;

    // Convert both IDs to the same type for comparison
    const authOrgId = authOrganization.organization.id.toString();
    const paramOrgId = organization_id;

    if (
      authOrgId !== paramOrgId ||
      !checkOrganizationPermission(PERMISSIONS.ORGANIZATION_UPDATE)
    ) {
      router.push('/');
    }
  }, [authOrganization, organization_id, checkOrganizationPermission, router]);

  if (isLoading) {
    return <CenteredSpinner />;
  }

  if (error) {
    return <div>Error loading organization data</div>;
  }

  if (!data?.organization) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`Edit: ${data.organization.name}`}</title>
      </Head>
      <OrganizationForm organization={data.organization} />
    </>
  );
};

export default EditOrganization;