import { PrismaClient } from "./generated/prisma";
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// This code initializes a Prisma Client instance and ensures that it is reused in development mode to prevent exhausting database connections.
// In production, a new instance is created each time.
// The `globalThis` object is used to store the Prisma Client instance, allowing it to be accessed globally within the application.
// This is particularly useful in serverless environments or during development where the application may restart frequently.
