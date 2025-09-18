import { NextRequest, NextResponse } from "next/server";
import { azureAdService } from "@/lib/azureAdService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search");
    const type = searchParams.get("type") || "all"; // all, security, distribution

    let groups;

    if (searchTerm) {
      groups = await azureAdService.searchGroups(searchTerm);
    } else {
      switch (type) {
        case "security":
          groups = await azureAdService.getSecurityGroups();
          break;
        case "distribution":
          groups = await azureAdService.getDistributionGroups();
          break;
        case "all":
        default:
          groups = await azureAdService.getAllGroups();
          break;
      }
    }

    return NextResponse.json({
      success: true,
      groups,
      total: groups.length,
    });

  } catch (error) {
    console.error("Error fetching Azure AD groups:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch groups",
      groups: [],
      total: 0,
    }, { status: 500 });
  }
}
