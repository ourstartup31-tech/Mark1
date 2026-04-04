import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Create Default Store
  const defaultStoreName = "Main Supermarket";
  let store = await prisma.stores.findFirst({
    where: { name: defaultStoreName },
  });

  if (!store) {
    store = await prisma.stores.create({
      data: {
        name: defaultStoreName,
        description: "The primary store for the platform.",
        address: "123 Main Street, City Center",
        is_active: true,
      },
    });
    console.log(`✅ Store created: ${store.name} (ID: ${store.id})`);
  } else {
    console.log(`ℹ️ Store already exists: ${store.name} (ID: ${store.id})`);
  }

  // 2. Create Superadmin User
  // Use environment variable or fallback to a default for initialization
  const superadminPhone = process.env.SEED_SUPERADMIN_PHONE || "9999999999";
  let superadmin = await prisma.users.findUnique({
    where: { phone: superadminPhone },
  });

  if (!superadmin) {
    superadmin = await prisma.users.create({
      data: {
        name: "Platform Superadmin",
        phone: superadminPhone,
        role: "superadmin",
      },
    });
    console.log(`✅ Superadmin created: ${superadmin.phone} (ID: ${superadmin.id})`);
  } else {
    // Ensure existing user has the correct role
    if (superadmin.role !== "superadmin") {
      superadmin = await prisma.users.update({
        where: { id: superadmin.id },
        data: { role: "superadmin" },
      });
      console.log(`🔄 Superadmin role updated for: ${superadmin.phone}`);
    } else {
      console.log(`ℹ️ Superadmin already exists: ${superadmin.phone} (ID: ${superadmin.id})`);
    }
  }

  // 3. Create Admin User linked to Store
  const adminPhone = process.env.SEED_ADMIN_PHONE || "8888888888";
  let admin = await prisma.users.findUnique({
    where: { phone: adminPhone },
  });

  if (!admin) {
    admin = await prisma.users.create({
      data: {
        name: "Store Manager",
        phone: adminPhone,
        role: "admin",
        store_id: store.id,
      },
    });
    console.log(`✅ Admin created: ${admin.phone} (ID: ${admin.id})`);
  } else {
    // Ensure existing admin is linked to the store
    if (admin.role !== "admin" || admin.store_id !== store.id) {
      admin = await prisma.users.update({
        where: { id: admin.id },
        data: { role: "admin", store_id: store.id },
      });
      console.log(`🔄 Admin role/store updated for: ${admin.phone}`);
    } else {
      console.log(`ℹ️ Admin already exists: ${admin.phone} (ID: ${admin.id})`);
    }
  }

  console.log("🏁 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
