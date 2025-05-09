import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import OrganizationsList from '@/components/Organizations/OrganizationsList';
import { getServerSession } from 'next-auth';

export default async function OrganizationsPage({params}) {
    const { lang } = await params;

    const session = await getServerSession(authOptions);
    const user = session.user;

    return <OrganizationsList user={user} />;
}
