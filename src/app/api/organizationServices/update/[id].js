import organizationServices from "../../../../lib/services/organizationServices";

export async function PUT(req, { params }) {
  const { id } = params;
  const organization = await req.json();

  try {
    const updatedData = await organizationServices.update({
      ...organization,
      id,
    });

    return Response.json({
      message: "Successfully updated the organization", 
      data: updatedData,
    });
  } catch (error) {
    return Response.json({
      error: "Failed to update the organization",
      details: error.message,
    }, { status: 500 });
  }
}
