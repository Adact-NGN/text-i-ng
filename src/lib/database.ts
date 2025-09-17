import { sql } from "./neon";

export interface Message {
  id: number;
  to_number: string;
  from_number: string;
  message: string;
  status: string;
  twilio_sid?: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  azure_ad_id?: string;
  created_at: Date;
  updated_at: Date;
}

// Message operations
export async function createMessage(
  toNumber: string,
  fromNumber: string,
  message: string,
  twilioSid?: string
): Promise<Message> {
  const result = await sql`
    INSERT INTO messages (to_number, from_number, message, twilio_sid, status)
    VALUES (${toNumber}, ${fromNumber}, ${message}, ${
    twilioSid || null
  }, 'sent')
    RETURNING *
  `;
  return result[0] as Message;
}

export async function getMessages(
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> {
  const result = await sql`
    SELECT * FROM messages 
    ORDER BY created_at DESC 
    LIMIT ${limit} OFFSET ${offset}
  `;
  return result as Message[];
}

export async function getMessageById(id: number): Promise<Message | null> {
  const result = await sql`
    SELECT * FROM messages WHERE id = ${id}
  `;
  return (result[0] as Message) || null;
}

export async function updateMessageStatus(
  id: number,
  status: string,
  twilioSid?: string
): Promise<void> {
  await sql`
    UPDATE messages 
    SET status = ${status}, twilio_sid = ${
    twilioSid || null
  }, updated_at = NOW()
    WHERE id = ${id}
  `;
}

// User operations
export async function createUser(
  email: string,
  name?: string,
  azureAdId?: string
): Promise<User> {
  const result = await sql`
    INSERT INTO users (email, name, azure_ad_id)
    VALUES (${email}, ${name || null}, ${azureAdId || null})
    RETURNING *
  `;
  return result.rows[0] as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return (result[0] as User) || null;
}

export async function getUserByAzureAdId(
  azureAdId: string
): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE azure_ad_id = ${azureAdId}
  `;
  return (result[0] as User) || null;
}

// Statistics
export async function getMessageStats(): Promise<{
  total: number;
  sent: number;
  failed: number;
  pending: number;
}> {
  const result = await sql`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent,
      COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
    FROM messages
  `;

  const stats = result[0];
  return {
    total: parseInt(stats.total),
    sent: parseInt(stats.sent),
    failed: parseInt(stats.failed),
    pending: parseInt(stats.pending),
  };
}
