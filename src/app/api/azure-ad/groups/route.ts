import { NextRequest, NextResponse } from "next/server";
import { azureAdService } from "@/lib/azureAdService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search");
    const type = searchParams.get("type") || "all"; // all, security, distribution
    const pageSize = parseInt(searchParams.get("pageSize") || "50");

    let result;

    if (searchTerm && searchTerm.trim().length >= 3) {
      // Use the new getAllGroups method with search
      result = await azureAdService.getAllGroups(searchTerm.trim(), pageSize);
    } else {
      // Use the old methods for backward compatibility
      let groups;
      switch (type) {
        case "security":
          groups = await azureAdService.getSecurityGroups();
          result = { groups, hasMore: false };
          break;
        case "distribution":
          groups = await azureAdService.getDistributionGroups();
          result = { groups, hasMore: false };
          break;
        case "all":
        default:
          result = await azureAdService.getAllGroups(undefined, pageSize);
          break;
      }
    }

    return NextResponse.json({
      success: true,
      groups: result.groups,
      total: result.groups.length,
      hasMore: result.hasMore,
      nextLink: result.nextLink,
    });

  } catch (error) {
    console.error("Error fetching Azure AD groups:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch groups",
      groups: [],
      total: 0,
      hasMore: false,
    }, { status: 500 });
  }
}
