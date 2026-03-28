import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`SELECT NOW() as db_time, CURRENT_TIMESTAMP as ct_time, LOCALTIMESTAMP as lt_time`;
  console.log("Database Time:", result);
  console.log("Node.js Time:", new Date().toISOString());
  console.log("Memory Time:", new Date().toString());
}

main().catch(console.error).finally(() => prisma.$disconnect());
