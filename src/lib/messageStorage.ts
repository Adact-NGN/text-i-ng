import { sql } from "./neon";

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

// Read messages from database
export const getMessages = async (): Promise<StoredMessage[]> => {
  try {
    const result = await sql`
      SELECT 
        id,
        phone_number as "phoneNumber",
        message,
        status,
        message_id as "messageId",
        error,
        timestamp,
        name,
        from_name as "fromName"
      FROM messages 
      ORDER BY timestamp DESC
    `;

    return result.map((row) => ({
      id: row.id,
      phoneNumber: row.phoneNumber,
      message: row.message,
      status: row.status,
      messageId: row.messageId,
      error: row.error,
      timestamp: row.timestamp,
      name: row.name,
      fromName: row.fromName,
    }));
  } catch (error) {
    console.error("Error reading messages:", error);
    return [];
  }
};

// Add a new message
export const addMessage = async (
  message: Omit<StoredMessage, "id" | "timestamp">
): Promise<StoredMessage> => {
  try {
    const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const newMessage: StoredMessage = {
      ...message,
      id,
      timestamp,
    };

    await sql`
      INSERT INTO messages (
        id, phone_number, message, status, message_id, error, timestamp, name, from_name
      ) VALUES (
        ${newMessage.id},
        ${newMessage.phoneNumber},
        ${newMessage.message},
        ${newMessage.status},
        ${newMessage.messageId || null},
        ${newMessage.error || null},
        ${newMessage.timestamp},
        ${newMessage.name || null},
        ${newMessage.fromName || null}
      )
    `;

    return newMessage;
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
};

// Update message status
export const updateMessageStatus = async (
  messageId: string,
  status: StoredMessage["status"],
  error?: string
): Promise<boolean> => {
  try {

    const result = await sql`
      UPDATE messages 
      SET status = ${status}, error = ${error || null}
      WHERE message_id = ${messageId}
      RETURNING id
    `;

    return result.length > 0;
  } catch (error) {
    console.error("Error updating message status:", error);
    return false;
  }
};

// Get messages by phone number
export const getMessagesByPhone = async (
  phoneNumber: string
): Promise<StoredMessage[]> => {
  try {
    const result = await sql`
      SELECT 
        id,
        phone_number as "phoneNumber",
        message,
        status,
        message_id as "messageId",
        error,
        timestamp,
        name,
        from_name as "fromName"
      FROM messages 
      WHERE phone_number = ${phoneNumber}
      ORDER BY timestamp DESC
    `;

    return result.map((row) => ({
      id: row.id,
      phoneNumber: row.phoneNumber,
      message: row.message,
      status: row.status,
      messageId: row.messageId,
      error: row.error,
      timestamp: row.timestamp,
      name: row.name,
      fromName: row.fromName,
    }));
  } catch (error) {
    console.error("Error getting messages by phone:", error);
    return [];
  }
};

// Get recent messages (last N messages)
export const getRecentMessages = async (
  limit: number = 50
): Promise<StoredMessage[]> => {
  try {
    const result = await sql`
      SELECT 
        id,
        phone_number as "phoneNumber",
        message,
        status,
        message_id as "messageId",
        error,
        timestamp,
        name,
        from_name as "fromName"
      FROM messages 
      ORDER BY timestamp DESC
      LIMIT ${limit}
    `;

    return result.map((row) => ({
      id: row.id,
      phoneNumber: row.phoneNumber,
      message: row.message,
      status: row.status,
      messageId: row.messageId,
      error: row.error,
      timestamp: row.timestamp,
      name: row.name,
      fromName: row.fromName,
    }));
  } catch (error) {
    console.error("Error getting recent messages:", error);
    return [];
  }
};

// Delete a specific message by ID
export const deleteMessage = async (messageId: string): Promise<boolean> => {
  try {
    
    const result = await sql`
      DELETE FROM messages WHERE id = ${messageId}
      RETURNING id
    `;
    
    return result.length > 0;
  } catch (error) {
    console.error("Error deleting message:", error);
    return false;
  }
};

// Delete all messages
export const deleteAllMessages = async (): Promise<boolean> => {
  try {
    
    await sql`DELETE FROM messages`;
    
    return true;
  } catch (error) {
    console.error("Error deleting all messages:", error);
    return false;
  }
};

// Delete messages older than specified days
export const deleteOldMessages = async (daysOld: number = 90): Promise<{ deleted: number; error?: string }> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const result = await sql`
      DELETE FROM messages 
      WHERE timestamp < ${cutoffDate.toISOString()}
      RETURNING id
    `;
    
    return { deleted: result.length };
  } catch (error) {
    console.error("Error deleting old messages:", error);
    return { deleted: 0, error: error instanceof Error ? error.message : "Unknown error" };
  }
};
