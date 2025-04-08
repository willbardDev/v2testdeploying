import OrganizationsList from '@/components/Organizations/OrganizationsList';
import { getServerSession } from 'next-auth';

export default async function OrganizationsPage() {
    const session = await getServerSession();
    const user = session?.user;
    console.log(user)

    return <OrganizationsList user={user} />;
}
