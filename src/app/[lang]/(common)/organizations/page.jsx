import OrganizationsList from "@/components/Organizations/list/OrganizationsList";
import { getServerSession } from "next-auth";

export default async function OrganizationsPage() {
  const session = await getServerSession();
  const user = session?.user;

  return <OrganizationsList user={user} />;
}
