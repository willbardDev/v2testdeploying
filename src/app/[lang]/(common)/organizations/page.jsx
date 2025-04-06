// app/[lang]/(common)/organizations/page.jsx
import Organizations from "@/components/Organizations/OrganizationsList";
import organizationServices from "@/lib/services/organizationServices";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function OrganizationsPage({ params, searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(`/${params.lang}/auth/signin`);
  }

  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const keyword = searchParams?.keyword || "";
  const limit = 10;

  try {
    const data = await organizationServices.getList({
      page,
      keyword,
      limit,
      id: session.user.id,
      token: session.accessToken,
    });

    return (
      <Organizations
        initialData={data}
        initialParams={{ page, keyword, limit }}
        user={session.user}
        lang={params.lang}
      />
    );
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
    redirect(`/${params.lang}/auth/signin`);
  }
}
