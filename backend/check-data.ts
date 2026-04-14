import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking Database Data...");

  const userCount = await prisma.users.count();
  const productCount = await prisma.products.count();
  const categoryCount = await prisma.categories.count();
  const storeCount = await prisma.stores.count();

  console.log(`📊 Users: ${userCount}`);
  console.log(`📊 Products: ${productCount}`);
  console.log(`📊 Categories: ${categoryCount}`);
  console.log(`📊 Stores: ${storeCount}`);

  if (productCount > 0) {
    const products = await prisma.products.findMany({
      take: 5,
      include: { categories: true }
    });
    console.log("\n🛍️ Last 5 Products:");
    products.forEach(p => {
      console.log(`- ${p.name} (Price: ${p.price}, Available: ${p.is_available}, Category: ${p.categories?.name || 'NONE'}, StoreID: ${p.store_id})`);
    });
  }

  const admins = await prisma.users.findMany({
    where: { role: "admin" }
  });
  console.log("\n👑 Admins:");
  admins.forEach(a => {
    console.log(`- Phone: ${a.phone}, StoreID: ${a.store_id}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
