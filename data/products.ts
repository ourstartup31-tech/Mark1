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
    inStock: boolean;
    image?: string;
}

export const products: Product[] = [
    // Fruits & Vegetables
    { id: "1", name: "Fresh Bananas", category: "Fruits & Vegetables", price: 49, originalPrice: 60, unit: "per dozen", emoji: "🍌", badge: "Sale", inStock: true },
    { id: "2", name: "Red Apples", category: "Fruits & Vegetables", price: 120, unit: "per kg", emoji: "🍎", badge: "Popular", inStock: true },
    { id: "3", name: "Baby Spinach", category: "Fruits & Vegetables", price: 35, unit: "per 250g", emoji: "🥬", inStock: true },
    { id: "4", name: "Ripe Tomatoes", category: "Fruits & Vegetables", price: 30, unit: "per kg", emoji: "🍅", badge: "Fresh", inStock: true },

    // Dairy
    { id: "5", name: "Full Cream Milk", category: "Dairy", price: 62, unit: "per litre", emoji: "🥛", badge: "Daily", inStock: true },
    { id: "6", name: "Natural Yoghurt", category: "Dairy", price: 45, unit: "per 500g", emoji: "🍶", inStock: true },
    { id: "7", name: "Salted Butter", category: "Dairy", price: 55, originalPrice: 65, unit: "per 100g", emoji: "🧈", badge: "Sale", inStock: true },
    { id: "8", name: "Paneer Block", category: "Dairy", price: 95, unit: "per 200g", emoji: "🧀", badge: "Fresh", inStock: true },

    // Snacks
    { id: "9", name: "Masala Chips", category: "Snacks", price: 20, unit: "per pack", emoji: "🍟", badge: "Bestseller", inStock: true },
    { id: "10", name: "Roasted Almonds", category: "Snacks", price: 180, originalPrice: 220, unit: "per 250g", emoji: "🥜", badge: "Sale", inStock: true },
    { id: "11", name: "Dark Chocolate", category: "Snacks", price: 85, unit: "per bar", emoji: "🍫", inStock: true },
    { id: "12", name: "Oat Cookies", category: "Snacks", price: 60, unit: "per pack", emoji: "🍪", inStock: true },

    // Beverages
    { id: "13", name: "Orange Juice", category: "Beverages", price: 75, unit: "per litre", emoji: "🍊", badge: "Fresh", inStock: true },
    { id: "14", name: "Green Tea", category: "Beverages", price: 110, unit: "per 25 bags", emoji: "🍵", badge: "Popular", inStock: true },
    { id: "15", name: "Coconut Water", category: "Beverages", price: 40, unit: "per bottle", emoji: "🥥", inStock: true },
    { id: "16", name: "Sparkling Water", category: "Beverages", price: 35, unit: "per bottle", emoji: "💧", inStock: true },

    // Household
    { id: "17", name: "Dish Wash Gel", category: "Household", price: 90, originalPrice: 110, unit: "per 500ml", emoji: "🫧", badge: "Sale", inStock: true },
    { id: "18", name: "Floor Cleaner", category: "Household", price: 130, unit: "per litre", emoji: "🪣", inStock: true },

    // Personal Care
    { id: "19", name: "Aloe Vera Soap", category: "Personal Care", price: 45, unit: "per bar", emoji: "🧼", inStock: true },
    { id: "20", name: "Herbal Shampoo", category: "Personal Care", price: 175, originalPrice: 200, unit: "per 200ml", emoji: "🧴", badge: "Sale", inStock: true },
];

export const categories = [
    { id: "1", name: "Fruits & Vegetables", emoji: "🥦", count: 48 },
    { id: "2", name: "Dairy", emoji: "🥛", count: 32 },
    { id: "3", name: "Snacks", emoji: "🍿", count: 65 },
    { id: "4", name: "Beverages", emoji: "🧃", count: 40 },
    { id: "5", name: "Household", emoji: "🏠", count: 55 },
    { id: "6", name: "Personal Care", emoji: "🪥", count: 37 },
];
