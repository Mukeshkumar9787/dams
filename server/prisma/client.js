import dotenv from "dotenv";
import { Prisma, PrismaClient } from './generated/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
dotenv.config();

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter,  log: ['query', 'info', 'warn', 'error'] });


export const PrismaConfig = Prisma;

export default prisma;