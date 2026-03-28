import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const products = [
    { id: "1", name: "Fresh Bananas", category: "Fruits & Vegetables", price: 49, unit: "per dozen", is_available: true, store_id: "store_1" },
    { id: "2", name: "Red Apples", category: "Fruits & Vegetables", price: 120, unit: "per kg", is_available: true, store_id: "store_1" },
    { id: "3", name: "Baby Spinach", category: "Fruits & Vegetables", price: 35, unit: "per 250g", is_available: true, store_id: "store_1" },
    { id: "4", name: "Ripe Tomatoes", category: "Fruits & Vegetables", price: 30, unit: "per kg", is_available: true, store_id: "store_1" },
    { id: "5", name: "Full Cream Milk", category: "Dairy", price: 62, unit: "per litre", is_available: true, store_id: "store_2" },
    { id: "6", name: "Natural Yoghurt", category: "Dairy", price: 45, unit: "per 500g", is_available: true, store_id: "store_2" },
    { id: "7", name: "Salted Butter", category: "Dairy", price: 55, unit: "per 100g", is_available: true, store_id: "store_2" },
    { id: "8", name: "Paneer Block", category: "Dairy", price: 95, unit: "per 200g", is_available: true, store_id: "store_2" },
    { id: "9", name: "Masala Chips", category: "Snacks", price: 20, unit: "per pack", is_available: true, store_id: "store_3" },
    { id: "10", name: "Roasted Almonds", category: "Snacks", price: 180, unit: "per 250g", is_available: true, store_id: "store_3" },
    { id: "11", name: "Dark Chocolate", category: "Snacks", price: 85, unit: "per bar", is_available: true, store_id: "store_3" },
    { id: "12", name: "Oat Cookies", category: "Snacks", price: 60, unit: "per pack", is_available: true, store_id: "store_3" },
    { id: "13", name: "Orange Juice", category: "Beverages", price: 75, unit: "per litre", is_available: true, store_id: "store_4" },
    { id: "14", name: "Green Tea", category: "Beverages", price: 110, unit: "per 25 bags", is_available: true, store_id: "store_4" },
    { id: "15", name: "Coconut Water", category: "Beverages", price: 40, unit: "per bottle", is_available: true, store_id: "store_4" },
    { id: "16", name: "Sparkling Water", category: "Beverages", price: 35, unit: "per bottle", is_available: true, store_id: "store_4" },
    { id: "17", name: "Dish Wash Gel", category: "Household", price: 90, unit: "per 500ml", is_available: true, store_id: "store_5" },
    { id: "18", name: "Floor Cleaner", category: "Household", price: 130, unit: "per litre", is_available: true, store_id: "store_5" },
    { id: "19", name: "Aloe Vera Soap", category: "Personal Care", price: 45, unit: "per bar", is_available: true, store_id: "store_5" },
    { id: "20", name: "Herbal Shampoo", category: "Personal Care", price: 175, unit: "per 200ml", is_available: true, store_id: "store_5" },
];

async function main() {
    console.log("Seeding products...");
    for (const p of products) {
        await prisma.products.upsert({
            where: { id: p.id },
            update: p,
            create: p,
        });
    }
    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
