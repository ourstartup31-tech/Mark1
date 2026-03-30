const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.users.updateMany({
      where: { role: 'user' },
      data: { role: 'customer' }
    });
    console.log(`Successfully migrated ${result.count} users from role 'user' to 'customer'.`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
