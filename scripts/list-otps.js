const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const otps = await prisma.otp_codes.findMany({
    orderBy: { created_at: "desc" },
    take: 10
  });
  console.log("Recent OTP Codes in DB:");
  console.log(JSON.stringify(otps, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
