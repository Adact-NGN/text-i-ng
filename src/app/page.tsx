import { VersionDisplay } from "@/components/VersionDisplay";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header with Version */}
      <div className="flex justify-between items-start">
        <div className="text-center flex-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Twilio SMS Application
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Send SMS messages to any phone number using Twilio. Send individual
            messages or upload an Excel file for bulk messaging.
          </p>
        </div>
        <div className="ml-4">
          <VersionDisplay />
        </div>
      </div>

      {/* Main Action Card */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg shadow-sm border border-pink-200 p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to Send SMS Messages?
          </h3>
          <p className="text-gray-600 mb-6">
            Access the SMS management interface to send individual messages, 
            upload bulk SMS via Excel, and view your message history.
          </p>
          <Link href="/sms">
            <Button size="lg" className="flex items-center gap-2 mx-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              <MessageSquare className="h-5 w-5" />
              Go to SMS Management
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-6 w-6 text-pink-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Send SMS</h3>
          <p className="text-gray-600 text-sm">
            Send individual SMS messages to any phone number
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Bulk Upload</h3>
          <p className="text-gray-600 text-sm">
            Upload Excel files for bulk SMS messaging
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Message History</h3>
          <p className="text-gray-600 text-sm">
            View and manage your sent message history
          </p>
        </div>
      </div>
    </div>
  );
}
