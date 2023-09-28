import { PrismaClient } from '@prisma/client'


// ***** Prevent multiple instances of Prisma Client in development *****

// PrismaClient is attached to the `global` object in development to prevent hot-reloading issues.
declare global {
    var prisma: PrismaClient | undefined
}

// This line exports a global variable "db" that is either set to the existing "prisma" object or a new instance of PrismaClient.
export const db = globalThis.prisma || new PrismaClient();

// This line sets the global variable "prisma" to the "db" object if the environment is not in production mode.
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;



// This is a workaround for the fact that Next.js hot-reloads modules in development.
// It prevents multiple instances of Prisma Client in development.