import { getServerSession } from "next-auth";
import { getValidAccessToken } from "./tokenRefresh";

export interface AzureADUser {
  id: string;
  displayName: string;
  mail: string;
  mobilePhone?: string;
  businessPhones?: string[];
  userPrincipalName: string;
}

export interface AzureADGroup {
  id: string;
  displayName: string;
  description?: string;
  mail?: string;
  securityEnabled: boolean;
}

export interface GroupMember {
  user: AzureADUser;
  phoneNumber?: string;
  hasPhoneNumber: boolean;
}

class AzureADService {
  private async getAccessToken(): Promise<string> {
    try {
      return await getValidAccessToken();
    } catch (error) {
      console.error("Error getting valid access token:", error);
      throw new Error("Authentication failed. Please sign in again.");
    }
  }

  private async makeGraphRequest(endpoint: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    
    const url = `https://graph.microsoft.com/v1.0${endpoint}`;
    console.log(`Making Graph API request to: ${url}`);
    console.log(`Access token (first 20 chars): ${accessToken.substring(0, 20)}...`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Graph API response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Graph API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Graph API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all security groups the current user can access
   */
  async getSecurityGroups(): Promise<AzureADGroup[]> {
    try {
      const data = await this.makeGraphRequest('/groups?$filter=securityEnabled eq true&$select=id,displayName,description,mail,securityEnabled');
      return data.value || [];
    } catch (error) {
      console.error("Error fetching security groups:", error);
      throw new Error("Failed to fetch security groups");
    }
  }

  /**
   * Get all distribution groups the current user can access
   */
  async getDistributionGroups(): Promise<AzureADGroup[]> {
    try {
      const data = await this.makeGraphRequest('/groups?$filter=securityEnabled eq false&$select=id,displayName,description,mail,securityEnabled');
      return data.value || [];
    } catch (error) {
      console.error("Error fetching distribution groups:", error);
      throw new Error("Failed to fetch distribution groups");
    }
  }

  /**
   * Get all groups (both security and distribution) with pagination
   */
  async getAllGroups(searchTerm?: string, pageSize: number = 50): Promise<{ groups: AzureADGroup[]; hasMore: boolean; nextLink?: string }> {
    try {
      let endpoint = '/groups?$select=id,displayName,description,mail,securityEnabled';
      
      if (searchTerm && searchTerm.trim().length >= 3) {
        const encodedSearch = encodeURIComponent(searchTerm.trim());
        endpoint += `&$filter=startswith(displayName,'${encodedSearch}')`;
      }
      
      endpoint += `&$top=${pageSize}`;
      
      const data = await this.makeGraphRequest(endpoint);
      
      return {
        groups: data.value || [],
        hasMore: !!data['@odata.nextLink'],
        nextLink: data['@odata.nextLink']
      };
    } catch (error) {
      console.error("Error fetching all groups:", error);
      throw new Error("Failed to fetch groups");
    }
  }

  /**
   * Get members of a specific group
   */
  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    try {
      const data = await this.makeGraphRequest(`/groups/${groupId}/members?$select=id,displayName,mail,mobilePhone,businessPhones,userPrincipalName`);
      
      const members: GroupMember[] = [];
      
      for (const member of data.value || []) {
        // Filter out non-user objects (like service principals, etc.)
        if (!member.userPrincipalName || !member.displayName) {
          continue;
        }

        // Extract phone number from mobilePhone or businessPhones
        let phoneNumber: string | undefined;
        let hasPhoneNumber = false;

        if (member.mobilePhone) {
          phoneNumber = member.mobilePhone;
          hasPhoneNumber = true;
        } else if (member.businessPhones && member.businessPhones.length > 0) {
          phoneNumber = member.businessPhones[0];
          hasPhoneNumber = true;
        }

        members.push({
          user: {
            id: member.id,
            displayName: member.displayName,
            mail: member.mail,
            mobilePhone: member.mobilePhone,
            businessPhones: member.businessPhones,
            userPrincipalName: member.userPrincipalName,
          },
          phoneNumber,
          hasPhoneNumber,
        });
      }

      return members;
    } catch (error) {
      console.error("Error fetching group members:", error);
      throw new Error("Failed to fetch group members");
    }
  }

  /**
   * Get members of multiple groups
   */
  async getMultipleGroupMembers(groupIds: string[]): Promise<GroupMember[]> {
    const allMembers: GroupMember[] = [];
    const seenUserIds = new Set<string>();

    for (const groupId of groupIds) {
      try {
        const members = await this.getGroupMembers(groupId);
        
        // Deduplicate users (in case they're in multiple groups)
        for (const member of members) {
          if (!seenUserIds.has(member.user.id)) {
            seenUserIds.add(member.user.id);
            allMembers.push(member);
          }
        }
      } catch (error) {
        console.error(`Error fetching members for group ${groupId}:`, error);
        // Continue with other groups even if one fails
      }
    }

    return allMembers;
  }

  /**
   * Search for groups by name
   */
  async searchGroups(searchTerm: string): Promise<AzureADGroup[]> {
    try {
      const encodedSearch = encodeURIComponent(searchTerm);
      const data = await this.makeGraphRequest(`/groups?$filter=startswith(displayName,'${encodedSearch}')&$select=id,displayName,description,mail,securityEnabled`);
      return data.value || [];
    } catch (error) {
      console.error("Error searching groups:", error);
      throw new Error("Failed to search groups");
    }
  }
}

export const azureAdService = new AzureADService();
