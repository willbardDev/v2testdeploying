export async function POST(req) {
    const organizationData = await req.json();
  
    try {
      const data = await organizationServices.add(organizationData);
      return Response.json({
        message: "Organization successfully added!",
        data,
      });
    } catch (error) {
      return Response.json({
        message: "Failed to add organization.",
        error: error.message || "Unknown error occurred",
      }, { status: 500 });
    }
  }
  