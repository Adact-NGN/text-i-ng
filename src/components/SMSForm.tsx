"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Send, Phone, MessageSquare, User } from "lucide-react";

export function SMSForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [fromName, setFromName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumbers: phoneNumber,
          message,
          fromName: fromName.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send SMS");
      }

      // Handle multiple recipients response
      if (data.summary) {
        const { total, sent, failed } = data.summary;
        if (failed > 0) {
          setStatus("error");
          console.error("Some messages failed:", data.errors);
        } else {
          setStatus("success");
        }
      } else {
        setStatus("success");
      }

      setPhoneNumber("");
      setMessage("");
      setFromName("");

      // Trigger message history refresh
      window.dispatchEvent(new CustomEvent("messageSent"));
    } catch (error) {
      console.error("Error sending SMS:", error);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fromName" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Sender ID (Optional)
        </Label>
        <Input
          id="fromName"
          type="text"
          placeholder="YourCompany"
          value={fromName}
          onChange={(e) => setFromName(e.target.value)}
          className="w-full"
          maxLength={11}
        />
        <p className="text-sm text-gray-500">
          Your company name (max 11 chars, letters/numbers only). Recipients
          will see this instead of your phone number.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1234567890"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          className="w-full"
        />
        <p className="text-sm text-gray-500">
          Include country code (e.g., +1 for US). Separate multiple numbers with
          commas or semicolons.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Enter your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          className="w-full"
        />
        <p className="text-sm text-gray-500">{message.length}/160 characters</p>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !phoneNumber || !message}
        className="w-full"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Send SMS
          </>
        )}
      </Button>

      {status === "success" && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">✅ SMS sent successfully!</p>
        </div>
      )}

      {status === "error" && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            ❌ Failed to send SMS. Please try again.
          </p>
        </div>
      )}
    </form>
  );
}
