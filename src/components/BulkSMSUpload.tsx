"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface BulkSMSResult {
  phoneNumber: string;
  message: string;
  name: string;
  rowNumber: number;
  status: "sent" | "failed";
  messageId?: string;
  error?: string;
}

interface BulkSMSSummary {
  total: number;
  sent: number;
  failed: number;
}

export function BulkSMSUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadResults, setUploadResults] = useState<BulkSMSResult[] | null>(
    null
  );
  const [summary, setSummary] = useState<BulkSMSSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/download-template");
      if (!response.ok) {
        throw new Error("Failed to download template");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sms-template.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading template:", error);
      setError("Failed to download template");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadResults(null);
    setSummary(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-bulk-sms", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setError(`Validation errors:\n${data.errors.join("\n")}`);
        } else {
          setError(data.error || "Failed to process file");
        }
        return;
      }

      setUploadResults(data.results);
      setSummary(data.summary);

      // Trigger message history refresh
      window.dispatchEvent(new CustomEvent("bulkMessagesSent"));
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: "sent" | "failed") => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: "sent" | "failed") => {
    const variants = {
      sent: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleDownloadTemplate}
            disabled={isDownloading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download Template
              </>
            )}
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Excel File
              </>
            )}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Required columns:</strong> Phone Number, Message
          </p>
          <p>
            <strong>Optional columns:</strong> Sender ID
          </p>
          <p>
            <strong>Supported formats:</strong> .xlsx, .xls
          </p>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Error</h4>
                <p className="text-sm text-red-700 whitespace-pre-line">
                  {error}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {summary.total}
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {summary.sent}
                </div>
                <div className="text-sm text-gray-500">Sent</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {summary.failed}
                </div>
                <div className="text-sm text-gray-500">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {uploadResults && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              Detailed results for each SMS message
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {uploadResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {result.phoneNumber}
                      </span>
                      {result.name && (
                        <span className="text-sm text-gray-500">
                          ({result.name})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      {getStatusBadge(result.status)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-2">{result.message}</p>

                  {result.error && (
                    <p className="text-xs text-red-600">{result.error}</p>
                  )}

                  {result.messageId && (
                    <p className="text-xs text-gray-500">
                      ID: {result.messageId}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
