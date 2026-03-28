import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const otps = await prisma.otp_codes.findMany({
    orderBy: { created_at: "desc" },
    take: 5
  });
  
  console.log("Current Server Time:", new Date().toISOString());
  console.log("Recent OTPs:");
  otps.forEach(otp => {
    console.log(`Phone: ${otp.phone}, OTP: ${otp.otp}, Expires: ${otp.expires_at.toISOString()}, Created: ${otp.created_at.toISOString()}`);
    console.log(`Is Expired? ${new Date() > otp.expires_at}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
