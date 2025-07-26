import { PrismaClient } from "./generated/prisma";

let db;

// Create a robust Prisma client with fallback mechanisms
const createPrismaClient = () => {
  try {
    if (process.env.NODE_ENV === "production") {
      return new PrismaClient({
        log: ['error', 'warn'],
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      });
    } else {
      return new PrismaClient({
        log: ['query', 'error', 'warn'],
      });
    }
  } catch (error) {
    console.error("Failed to create Prisma client:", error);
    // Return a minimal client for fallback
    return new PrismaClient({
      log: ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://fallback',
        },
      },
    });
  }
};

if (process.env.NODE_ENV === "production") {
  db = createPrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = createPrismaClient();
  }
  db = globalThis.prisma;
}

// Add error handling for database connection
const connectDatabase = async () => {
  try {
    await db.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    // Don't throw error, just log it
  }
};

// Connect on initialization
connectDatabase();

// Handle graceful shutdown
process.on('beforeExit', async () => {
  try {
    await db.$disconnect();
  } catch (error) {
    console.error("Error disconnecting database:", error);
  }
});

// Handle SIGTERM for Vercel
process.on('SIGTERM', async () => {
  try {
    await db.$disconnect();
  } catch (error) {
    console.error("Error disconnecting database:", error);
  }
});

export { db };
