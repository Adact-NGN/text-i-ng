import { SMSForm } from "@/components/SMSForm";
import { MessageHistory } from "@/components/MessageHistory";
import { BulkSMSUpload } from "@/components/BulkSMSUpload";
import { VersionDisplay } from "@/components/VersionDisplay";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header with Version */}
      <div className="flex justify-between items-start">
        <div className="text-center flex-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Send SMS Messages
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Send New Message
          </h3>
          <SMSForm />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Message History
          </h3>
          <MessageHistory />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Bulk SMS Upload
        </h3>
        <BulkSMSUpload />
      </div>
    </div>
  );
}
