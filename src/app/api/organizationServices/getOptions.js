import organizationServices from "../../../lib/services/organizationServices";

export async function GET() {
  const data = await organizationServices.getOptions();

  return Response.json(data);
}
