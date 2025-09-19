"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Send, AlertCircle, CheckCircle, Phone, Mail } from "lucide-react";
import { useAuthError } from "@/hooks/useAuthError";

interface AzureADGroup {
  id: string;
  displayName: string;
  description?: string;
  mail?: string;
  securityEnabled: boolean;
}

interface GroupMember {
  user: {
    id: string;
    displayName: string;
    mail: string;
    userPrincipalName: string;
  };
  phoneNumber?: string;
  hasPhoneNumber: boolean;
}

export function ADGroupSMS() {
  const [groups, setGroups] = useState<AzureADGroup[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<GroupMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [fromName, setFromName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const { authError, handleAuthError, clearAuthError } = useAuthError();

  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  // Fetch members when selected groups change
  useEffect(() => {
    if (selectedGroups.length > 0) {
      fetchGroupMembers();
    } else {
      setSelectedGroupMembers([]);
    }
  }, [selectedGroups]);

  const fetchGroups = async (searchQuery?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const url = searchQuery 
        ? `/api/azure-ad/groups?search=${encodeURIComponent(searchQuery)}&pageSize=50`
        : "/api/azure-ad/groups?pageSize=50";
        
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setGroups(data.groups);
        setHasMore(data.hasMore || false);
        setHasSearched(!!searchQuery);
      } else {
        if (handleAuthError(data)) {
          return; // Auth error handled, don't set regular error
        } else {
          setError(data.error || "Failed to fetch groups");
        }
      }
    } catch (err) {
      setError("Failed to fetch groups");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim().length >= 3) {
      fetchGroups(searchTerm.trim());
    } else {
      setError("Please enter at least 3 characters to search");
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setHasSearched(false);
    fetchGroups();
  };

  const fetchGroupMembers = async () => {
    setIsLoadingMembers(true);
    setError(null);
    
    try {
      const allMembers: GroupMember[] = [];
      
      for (const groupId of selectedGroups) {
        const response = await fetch(`/api/azure-ad/groups/${groupId}/members`);
        const data = await response.json();
        
        if (data.success) {
          // Deduplicate users (in case they're in multiple groups)
          for (const member of data.members) {
            if (!allMembers.some(m => m.user.id === member.user.id)) {
              allMembers.push(member);
            }
          }
        } else if (handleAuthError(data)) {
          return; // Auth error handled
        }
      }
      
      setSelectedGroupMembers(allMembers);
    } catch (err) {
      setError("Failed to fetch group members");
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSendSMS = async () => {
    if (!message.trim()) {
      setError("Message is required");
      return;
    }

    if (selectedGroups.length === 0) {
      setError("Please select at least one group");
      return;
    }

    setIsSending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/azure-ad/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupIds: selectedGroups,
          message: message.trim(),
          fromName: fromName.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Successfully sent SMS to ${data.summary.sent} members. ${data.summary.failed} failed.`);
        setMessage("");
        setFromName("");
        setSelectedGroups([]);
        setSelectedGroupMembers([]);
      } else {
        setError(data.error || "Failed to send SMS");
      }
    } catch (err) {
      setError("Failed to send SMS");
    } finally {
      setIsSending(false);
    }
  };

  // Remove client-side filtering since we now search server-side

  const membersWithPhone = selectedGroupMembers.filter(member => member.hasPhoneNumber);
  const membersWithoutPhone = selectedGroupMembers.filter(member => !member.hasPhoneNumber);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Send SMS to AD Groups</h3>
          <p className="text-sm text-muted-foreground">
            Select Azure AD groups and send SMS messages to members with phone numbers
          </p>
        </div>

        {/* Search Groups */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Groups</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="search"
                placeholder="Enter at least 3 characters to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={searchTerm.trim().length < 3 || isLoading}
              variant="outline"
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
            {hasSearched && (
              <Button 
                onClick={handleClearSearch} 
                variant="outline"
                disabled={isLoading}
              >
                Clear
              </Button>
            )}
          </div>
          {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
            <p className="text-sm text-amber-600">
              Enter at least 3 characters to search
            </p>
          )}
        </div>

        {/* Groups List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {hasSearched ? `Search Results` : `Available Groups`}
              {isLoading && <span className="text-sm text-muted-foreground">(Loading...)</span>}
            </CardTitle>
            <CardDescription>
              {hasSearched 
                ? `Found ${groups.length} groups matching "${searchTerm}"`
                : "Select one or more groups to send SMS to their members"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {groups.length === 0 && !isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  {hasSearched 
                    ? `No groups found matching "${searchTerm}"`
                    : "No groups available"
                  }
                </div>
              ) : (
                groups.map((group) => (
                <div
                  key={group.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedGroups.includes(group.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => handleGroupToggle(group.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{group.displayName}</div>
                      {group.description && (
                        <div className="text-sm text-muted-foreground">{group.description}</div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={group.securityEnabled ? "default" : "secondary"}>
                          {group.securityEnabled ? "Security" : "Distribution"}
                        </Badge>
                        {group.mail && (
                          <span className="text-xs text-muted-foreground">{group.mail}</span>
                        )}
                      </div>
                    </div>
                    <div className="ml-2">
                      {selectedGroups.includes(group.id) ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-muted-foreground rounded" />
                      )}
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Selected Groups Summary */}
        {selectedGroups.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Selected Groups ({selectedGroups.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedGroups.map((groupId) => {
                  const group = groups.find(g => g.id === groupId);
                  return (
                    <Badge key={groupId} variant="outline" className="flex items-center gap-1">
                      {group?.displayName}
                      <button
                        onClick={() => handleGroupToggle(groupId)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Group Members Preview */}
        {selectedGroupMembers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Group Members Preview
                {isLoadingMembers && <span className="text-sm text-muted-foreground">(Loading...)</span>}
              </CardTitle>
              <CardDescription>
                {membersWithPhone.length} members with phone numbers, {membersWithoutPhone.length} without
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Members with Phone Numbers */}
                {membersWithPhone.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">
                      ✓ {membersWithPhone.length} members with phone numbers
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {membersWithPhone.slice(0, 10).map((member) => (
                        <div key={member.user.id} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded">
                          <Phone className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{member.user.displayName}</span>
                          <span className="text-sm text-muted-foreground">{member.phoneNumber}</span>
                        </div>
                      ))}
                      {membersWithPhone.length > 10 && (
                        <div className="text-sm text-muted-foreground">
                          ... and {membersWithPhone.length - 10} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Members without Phone Numbers */}
                {membersWithoutPhone.length > 0 && (
                  <div>
                    <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2">
                      ⚠ {membersWithoutPhone.length} members without phone numbers
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {membersWithoutPhone.slice(0, 5).map((member) => (
                        <div key={member.user.id} className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                          <Mail className="h-4 w-4 text-orange-600" />
                          <span className="font-medium">{member.user.displayName}</span>
                          <span className="text-sm text-muted-foreground">{member.user.mail}</span>
                        </div>
                      ))}
                      {membersWithoutPhone.length > 5 && (
                        <div className="text-sm text-muted-foreground">
                          ... and {membersWithoutPhone.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message Form */}
        <Card>
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
            <CardDescription>
              Write your SMS message and configure sender settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromName">Sender ID (Optional)</Label>
              <Input
                id="fromName"
                placeholder="Company Name or Alphanumeric ID"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                maxLength={11}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use your default Twilio number. Max 11 characters.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Enter your SMS message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={1600}
              />
              <p className="text-xs text-muted-foreground">
                {message.length}/1600 characters
              </p>
            </div>

            <Button
              onClick={handleSendSMS}
              disabled={isSending || selectedGroups.length === 0 || !message.trim()}
              className="w-full"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Sending SMS...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send SMS to {membersWithPhone.length} Members
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Auth Error Message */}
        {authError && (
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">Session Expired</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">{authError}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Redirecting to sign out in a few seconds...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Regular Error/Success Messages */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-200">Error</h4>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">Success</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
