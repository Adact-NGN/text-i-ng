import fs from "fs";
import path from "path";

export interface StoredMessage {
  id: string;
  phoneNumber: string;
  message: string;
  status: "sent" | "delivered" | "failed";
  messageId: string | null;
  error?: string;
  timestamp: string;
  name?: string;
  fromName?: string;
}

const MESSAGES_FILE = path.join(process.cwd(), "data", "messages.json");

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.dirname(MESSAGES_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read messages from file
export const getMessages = (): StoredMessage[] => {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(MESSAGES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(MESSAGES_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading messages:", error);
    return [];
  }
};

// Save messages to file
export const saveMessages = (messages: StoredMessage[]): void => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error("Error saving messages:", error);
    throw error;
  }
};

// Add a new message
export const addMessage = (
  message: Omit<StoredMessage, "id" | "timestamp">
): StoredMessage => {
  const messages = getMessages();
  const newMessage: StoredMessage = {
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };

  messages.push(newMessage);
  saveMessages(messages);
  return newMessage;
};

// Update message status
export const updateMessageStatus = (
  messageId: string,
  status: StoredMessage["status"],
  error?: string
): boolean => {
  const messages = getMessages();
  const messageIndex = messages.findIndex((msg) => msg.messageId === messageId);

  if (messageIndex !== -1) {
    messages[messageIndex].status = status;
    if (error) {
      messages[messageIndex].error = error;
    }
    saveMessages(messages);
    return true;
  }

  return false;
};

// Get messages by phone number
export const getMessagesByPhone = (phoneNumber: string): StoredMessage[] => {
  const messages = getMessages();
  return messages.filter((msg) => msg.phoneNumber === phoneNumber);
};

// Get recent messages (last N messages)
export const getRecentMessages = (limit: number = 50): StoredMessage[] => {
  const messages = getMessages();
  return messages
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, limit);
};
