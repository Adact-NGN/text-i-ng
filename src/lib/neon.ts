import { neon } from "@neondatabase/serverless";

// Get the connection string from environment variables
const connectionString =
  process.env.texting_POSTGRES_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "No database connection string found. Please set texting_POSTGRES_URL or POSTGRES_URL environment variable."
  );
}

// Initialize Neon connection with proper configuration
export const sql = neon(connectionString, {
  // Enable connection pooling for better performance
  arrayMode: false,
});

// Alternative connection for non-pooled operations if needed
const directConnectionString =
  process.env.texting_POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL_NON_POOLING;
export const sqlDirect = directConnectionString
  ? neon(directConnectionString)
  : sql;

// Database initialization with proper error handling
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Create messages table
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

    // Create users table for authentication
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        azure_ad_id VARCHAR(255) UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create sessions table for NextAuth
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create accounts table for NextAuth
    await sql`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        account_id VARCHAR(255) NOT NULL,
        provider VARCHAR(50) NOT NULL,
        provider_account_id VARCHAR(255) NOT NULL,
        access_token TEXT,
        refresh_token TEXT,
        expires_at INTEGER,
        token_type VARCHAR(50),
        scope VARCHAR(255),
        id_token TEXT,
        session_state VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(provider, provider_account_id)
      )
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_phone_number ON messages(phone_number)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id)`;

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

// Health check function
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
};
