"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Calendar, Shield, Globe, Building } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No User Data</h1>
          <p className="text-gray-600">Unable to load user information.</p>
        </div>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-600 mt-2">Your Azure AD account information</p>
        </div>

        {/* Profile Overview Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <User className="h-6 w-6 text-blue-600" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              {user.image && (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {user.name || "No Name"}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                {user.phone && (
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4" />
                    {user.phone}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-5 w-5 text-green-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{user.name || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {user.phone || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <p className="text-gray-900 font-mono text-sm">{user.id || "Not provided"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Azure AD Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-purple-600" />
                Azure AD Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Authentication Status</label>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Authenticated
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Provider</label>
                <p className="text-gray-900">Azure Active Directory</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Session Active</label>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Access Token</label>
                <p className="text-gray-900 font-mono text-xs break-all">
                  {session.accessToken ? "Available" : "Not available"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Building className="h-5 w-5 text-orange-600" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Email Domain</label>
                <p className="text-gray-900">
                  {user.email ? user.email.split('@')[1] : "Not available"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Profile Picture</label>
                <p className="text-gray-900">
                  {user.image ? "Available" : "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Account Type</label>
                <Badge variant="secondary">Azure AD User</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-blue-600" />
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Session ID</label>
                <p className="text-gray-900 font-mono text-xs break-all">
                  {user.id || "Not available"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Profile Image URL</label>
                <p className="text-gray-900 font-mono text-xs break-all">
                  {user.image || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Data Source</label>
                <p className="text-gray-900">Microsoft Graph API</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button 
            onClick={() => router.push('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
}
