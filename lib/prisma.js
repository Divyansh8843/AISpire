import { PrismaClient } from "./generated/prisma";

let db;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  db = globalThis.prisma;
}

// Add error handling for database connection
db.$connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await db.$disconnect();
});

// Handle SIGTERM for Vercel
process.on('SIGTERM', async () => {
  await db.$disconnect();
});

export { db };

// This code initializes a Prisma Client instance and ensures that it is reused in development mode to prevent exhausting database connections.
// In production, a new instance is created each time with proper error handling for serverless environments.
// The `globalThis` object is used to store the Prisma Client instance, allowing it to be accessed globally within the application.
// This is particularly useful in serverless environments or during development where the application may restart frequently.
