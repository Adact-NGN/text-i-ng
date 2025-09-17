import { sql } from '@vercel/postgres';

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

// Initialize the messages table if it doesn't exist
export const initializeDatabase = async (): Promise<void> => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(255) PRIMARY KEY,
        phone_number VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'delivered', 'failed')),
        message_id VARCHAR(255),
        error TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        name VARCHAR(255),
        from_name VARCHAR(255)
      )
    `;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Read messages from database
export const getMessages = async (): Promise<StoredMessage[]> => {
  try {
    await initializeDatabase();
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
    
    return result.rows.map(row => ({
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
    await initializeDatabase();
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
    await initializeDatabase();
    
    const result = await sql`
      UPDATE messages 
      SET status = ${status}, error = ${error || null}
      WHERE message_id = ${messageId}
      RETURNING id
    `;
    
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error updating message status:", error);
    return false;
  }
};

// Get messages by phone number
export const getMessagesByPhone = async (phoneNumber: string): Promise<StoredMessage[]> => {
  try {
    await initializeDatabase();
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
    
    return result.rows.map(row => ({
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
export const getRecentMessages = async (limit: number = 50): Promise<StoredMessage[]> => {
  try {
    await initializeDatabase();
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
    
    return result.rows.map(row => ({
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