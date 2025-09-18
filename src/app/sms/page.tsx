"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageHistory } from "@/components/MessageHistory";
import { SMSForm } from "@/components/SMSForm";
import { BulkSMSUpload } from "@/components/BulkSMSUpload";
import { ADGroupSMS } from "@/components/ADGroupSMS";
import { MessageSquare, Send, Upload, History, Users } from "lucide-react";

export default function SMSPage() {
  const [activeTab, setActiveTab] = useState<"send" | "bulk" | "ad-groups" | "history">("send");

  const tabs = [
    {
      id: "send" as const,
      label: "Send SMS",
      icon: Send,
      description: "Send individual SMS messages"
    },
    {
      id: "bulk" as const,
      label: "Bulk Upload",
      icon: Upload,
      description: "Upload multiple SMS via Excel"
    },
    {
      id: "ad-groups" as const,
      label: "AD Groups",
      icon: Users,
      description: "Send SMS to Azure AD groups"
    },
    {
      id: "history" as const,
      label: "Message History",
      icon: History,
      description: "View sent message history"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">SMS Management</h1>
          <p className="text-muted-foreground mt-2">Send messages, manage bulk uploads, and view history</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${isActive
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-primary/50'
                      }
                    `}
                  >
                    <Icon className={`
                      w-5 h-5 mr-2 transition-colors
                      ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}
                    `} />
                    <div className="text-left">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-muted-foreground">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "send" && (
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Send New SMS
              </CardTitle>
              </CardHeader>
              <CardContent>
                <SMSForm />
              </CardContent>
            </Card>
          )}

          {activeTab === "bulk" && (
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Bulk SMS Upload
              </CardTitle>
              </CardHeader>
              <CardContent>
                <BulkSMSUpload />
              </CardContent>
            </Card>
          )}

          {activeTab === "ad-groups" && (
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Azure AD Groups SMS
              </CardTitle>
              </CardHeader>
              <CardContent>
                <ADGroupSMS />
              </CardContent>
            </Card>
          )}

          {activeTab === "history" && (
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Message History
              </CardTitle>
              </CardHeader>
              <CardContent>
                <MessageHistory />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-8 bg-card rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-card-foreground mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setActiveTab("send")}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send Message
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab("bulk")}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Bulk Upload
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab("ad-groups")}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              AD Groups
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab("history")}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              View History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
