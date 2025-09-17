import { checkDatabaseConnection, initializeDatabase } from "./neon";

// Test database connection and initialization
export async function testDatabaseConnection() {
  console.log("Testing Neon database connection...");

  try {
    // Test basic connection
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error("Database connection failed");
    }
    console.log("✅ Database connection successful");

    // Initialize database schema
    await initializeDatabase();
    console.log("✅ Database schema initialized");

    return true;
  } catch (error) {
    console.error("❌ Database test failed:", error);
    return false;
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testDatabaseConnection()
    .then((success) => {
      if (success) {
        console.log("🎉 Database setup complete!");
        process.exit(0);
      } else {
        console.log("💥 Database setup failed!");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("💥 Database test error:", error);
      process.exit(1);
    });
}
