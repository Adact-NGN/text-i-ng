import { NextRequest, NextResponse } from "next/server";
import { azureAdService } from "@/lib/azureAdService";
import { withAuth } from "@/lib/authMiddleware";

export const GET = withAuth(async (
  request: NextRequest,
  accessToken: string,
  { params }: { params: { groupId: string } }
) => {
  try {
    const { groupId } = params;

    if (!groupId) {
      return NextResponse.json({
        success: false,
        error: "Group ID is required",
        members: [],
        total: 0,
      }, { status: 400 });
    }

    const members = await azureAdService.getGroupMembers(groupId);

    // Separate members with and without phone numbers
    const membersWithPhone = members.filter(member => member.hasPhoneNumber);
    const membersWithoutPhone = members.filter(member => !member.hasPhoneNumber);

    return NextResponse.json({
      success: true,
      members,
      membersWithPhone,
      membersWithoutPhone,
      total: members.length,
      withPhone: membersWithPhone.length,
      withoutPhone: membersWithoutPhone.length,
    });

  } catch (error) {
    console.error("Error fetching group members:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch group members",
      members: [],
      total: 0,
    }, { status: 500 });
  }
});
