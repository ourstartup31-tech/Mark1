// Dummy product data for the grocery store

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    unit: string;
    emoji: string;
    badge?: string;
    stock: number;
    image?: string;
}

export const products: Product[] = [
    // Fruits & Vegetables
    { id: "1", name: "Fresh Bananas", category: "Fruits & Vegetables", price: 49, originalPrice: 60, unit: "dozen", emoji: "🍌", badge: "Sale", stock: 15 },
    { id: "2", name: "Red Apples", category: "Fruits & Vegetables", price: 120, unit: "kg", emoji: "🍎", badge: "Popular", stock: 10 },
    { id: "3", name: "Baby Spinach", category: "Fruits & Vegetables", price: 35, unit: "250g", emoji: "🥬", stock: 0 },
    { id: "4", name: "Ripe Tomatoes", category: "Fruits & Vegetables", price: 30, unit: "kg", emoji: "🍅", badge: "Fresh", stock: 20 },

    // Dairy
    { id: "5", name: "Full Cream Milk", category: "Dairy", price: 62, unit: "litre", emoji: "🥛", badge: "Daily", stock: 12 },
    { id: "6", name: "Natural Yoghurt", category: "Dairy", price: 45, unit: "500g", emoji: "🍶", stock: 8 },
    { id: "7", name: "Salted Butter", category: "Dairy", price: 55, originalPrice: 65, unit: "100g", emoji: "🧈", badge: "Sale", stock: 5 },
    { id: "8", name: "Paneer Block", category: "Dairy", price: 95, unit: "200g", emoji: "🧀", badge: "Fresh", stock: 10 },

    // Snacks
    { id: "9", name: "Masala Chips", category: "Snacks", price: 20, unit: "pack", emoji: "🍟", badge: "Bestseller", stock: 50 },
    { id: "10", name: "Roasted Almonds", category: "Snacks", price: 180, originalPrice: 220, unit: "250g", emoji: "🥜", badge: "Sale", stock: 30 },
    { id: "11", name: "Dark Chocolate", category: "Snacks", price: 85, unit: "bar", emoji: "🍫", stock: 0 },
    { id: "12", name: "Oat Cookies", category: "Snacks", price: 60, unit: "pack", emoji: "🍪", stock: 15 },

    // Beverages
    { id: "13", name: "Orange Juice", category: "Beverages", price: 75, unit: "litre", emoji: "🍊", badge: "Fresh", stock: 25 },
    { id: "14", name: "Green Tea", category: "Beverages", price: 110, unit: "25 bags", emoji: "🍵", badge: "Popular", stock: 40 },
    { id: "15", name: "Coconut Water", category: "Beverages", price: 40, unit: "bottle", emoji: "🥥", stock: 20 },
    { id: "16", name: "Sparkling Water", category: "Beverages", price: 35, unit: "bottle", emoji: "💧", stock: 18 },

    // Household
    { id: "17", name: "Dish Wash Gel", category: "Household", price: 90, originalPrice: 110, unit: "500ml", emoji: "🫧", badge: "Sale", stock: 35 },
    { id: "18", name: "Floor Cleaner", category: "Household", price: 130, unit: "litre", emoji: "🪣", stock: 20 },

    // Personal Care
    { id: "19", name: "Aloe Vera Soap", category: "Personal Care", price: 45, unit: "bar", emoji: "🧼", stock: 45 },
    { id: "20", name: "Herbal Shampoo", category: "Personal Care", price: 175, originalPrice: 200, unit: "200ml", emoji: "🧴", badge: "Sale", stock: 15 },
];

export const categories = [
    { id: "1", name: "Fruits & Vegetables", emoji: "🥦", count: 48 },
    { id: "2", name: "Dairy", emoji: "🥛", count: 32 },
    { id: "3", name: "Snacks", emoji: "🍿", count: 65 },
    { id: "4", name: "Beverages", emoji: "🧃", count: 40 },
    { id: "5", name: "Household", emoji: "🏠", count: 55 },
    { id: "6", name: "Personal Care", emoji: "🪥", count: 37 },
];
