"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Phone, CheckCircle, XCircle } from "lucide-react";

interface Message {
  id: string;
  phoneNumber: string;
  message: string;
  status: "sent" | "delivered" | "failed";
  timestamp: string;
  messageId?: string | null;
  error?: string;
  name?: string;
  fromName?: string;
}

export function MessageHistory() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages?limit=5");
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
      } else {
        console.error("Failed to fetch messages:", data.error);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Set up auto-refresh every 5 seconds
    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, []);

  // Listen for custom events to refresh messages
  useEffect(() => {
    const handleMessageSent = () => {
      fetchMessages();
    };

    window.addEventListener("messageSent", handleMessageSent);
    window.addEventListener("bulkMessagesSent", handleMessageSent);

    return () => {
      window.removeEventListener("messageSent", handleMessageSent);
      window.removeEventListener("bulkMessagesSent", handleMessageSent);
    };
  }, []);

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "sent":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: Message["status"]) => {
    const variants = {
      delivered: "bg-green-100 text-green-800",
      sent: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <Phone className="h-12 w-12 mx-auto" />
        </div>
        <p className="text-gray-500">No messages sent yet</p>
        <p className="text-sm text-gray-400">
          Send your first SMS to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {messages.map((message) => (
        <Card key={message.id} className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {message.phoneNumber}
                  </span>
                  {message.fromName && (
                    <span className="text-xs text-gray-500">
                      Sender ID: {message.fromName}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(message.status)}
                {getStatusBadge(message.status)}
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-2 line-clamp-2">
              {message.message}
            </p>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              {message.timestamp.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
