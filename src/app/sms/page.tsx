"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageHistory } from "@/components/MessageHistory";
import { SMSForm } from "@/components/SMSForm";
import { BulkSMSUpload } from "@/components/BulkSMSUpload";
import { MessageSquare, Send, Upload, History } from "lucide-react";

export default function SMSPage() {
  const [activeTab, setActiveTab] = useState<"send" | "bulk" | "history">("send");

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
      id: "history" as const,
      label: "Message History",
      icon: History,
      description: "View sent message history"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SMS Management</h1>
          <p className="text-gray-600 mt-2">Send messages, manage bulk uploads, and view history</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
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
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className={`
                      w-5 h-5 mr-2 transition-colors
                      ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                    `} />
                    <div className="text-left">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-gray-500">{tab.description}</div>
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
                  <Send className="h-5 w-5 text-blue-600" />
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
                  <Upload className="h-5 w-5 text-green-600" />
                  Bulk SMS Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BulkSMSUpload />
              </CardContent>
            </Card>
          )}

          {activeTab === "history" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-purple-600" />
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
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
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
