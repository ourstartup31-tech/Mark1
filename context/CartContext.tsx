"use client";

import React, { createContext, useContext, useReducer, useMemo, useEffect } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    products: Product & { is_available: boolean; store_id: string };
}

export type PaymentMethod = "pay-online" | "pay-at-store";

export interface PickupSlot {
    day: "today" | "tomorrow";
    slot: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    isLoading: boolean;
    paymentMethod: PaymentMethod;
    pickupSlot: PickupSlot | null;
    searchQuery: string;
}

type CartAction =
    | { type: "SET_ITEMS"; payload: { items: CartItem[]; total: string } }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "OPEN_CART" }
    | { type: "CLOSE_CART" }
    | { type: "SET_PAYMENT"; payload: PaymentMethod }
    | { type: "SET_PICKUP_SLOT"; payload: PickupSlot }
    | { type: "CLEAR_CART" }
    | { type: "SET_SEARCH_QUERY"; payload: string };

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "SET_ITEMS":
            return { 
                ...state, 
                items: action.payload.items,
                isLoading: false
            };
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "OPEN_CART":
            return { ...state, isOpen: true };
        case "CLOSE_CART":
            return { ...state, isOpen: false };
        case "SET_PAYMENT":
            return { ...state, paymentMethod: action.payload };
        case "SET_PICKUP_SLOT":
            return { ...state, pickupSlot: action.payload };
        case "CLEAR_CART":
            return { ...state, items: [], pickupSlot: null };
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };
        default:
            return state;
    }
}

import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const initialState: CartState = {
    items: [],
    isOpen: false,
    isLoading: false,
    paymentMethod: "pay-online",
    pickupSlot: null,
    searchQuery: "",
};

interface CartContextValue {
    state: CartState;
    addItem: (productId: string) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    increment: (productId: string) => Promise<void>;
    decrement: (productId: string) => Promise<void>;
    openCart: () => void;
    closeCart: () => void;
    setPaymentMethod: (m: PaymentMethod) => void;
    setPickupSlot: (slot: PickupSlot) => void;
    clearCartOnServer: () => Promise<void>;
    setSearchQuery: (q: string) => void;
    fetchCart: () => Promise<void>;
    searchQuery: string;
    totalItems: number;
    totalPrice: number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { user, apiFetch } = useAuth();
    const { showToast } = useToast();

    const fetchCart = async () => {
        if (!user || user.role !== "customer") return;
        dispatch({ type: "SET_LOADING", payload: true });
        try {
            const res = await apiFetch("/api/cart");
            if (res.ok) {
                const data = await res.json();
                dispatch({ type: "SET_ITEMS", payload: data });
            }
        } catch (e) {
            console.error("Failed to fetch cart", e);
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    };

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            dispatch({ type: "SET_ITEMS", payload: { items: [], total: "0" } });
        }
    }, [user]);

    const totalItems = useMemo(
        () => state.items.reduce((s, i) => s + i.quantity, 0),
        [state.items]
    );

    const totalPrice = useMemo(
        () => state.items.reduce((sum, item) => {
            const price = Number(item.price);
            return sum + (price * item.quantity);
          }, 0),
        [state.items]
    );

    const addItem = async (productId: string) => {
        try {
            const res = await apiFetch("/api/cart/add", {
                method: "POST",
                body: JSON.stringify({ product_id: productId, quantity: 1 })
            });
            if (res.ok) {
                showToast("Item added to cart", "success");
                await fetchCart();
            } else {
                const data = await res.json();
                showToast(data.error || "Failed to add item", "error");
            }
        } catch (e) {
            showToast("Network error", "error");
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        try {
            const res = await apiFetch("/api/cart/update", {
                method: "PUT",
                body: JSON.stringify({ product_id: productId, quantity })
            });
            if (res.ok) {
                await fetchCart();
            }
        } catch (e) {
            showToast("Failed to update quantity", "error");
        }
    };

    const removeItem = async (productId: string) => {
        try {
            const res = await apiFetch("/api/cart/remove", {
                method: "DELETE",
                body: JSON.stringify({ product_id: productId })
            });
            if (res.ok) {
                showToast("Item removed", "success");
                await fetchCart();
            }
        } catch (e) {
            showToast("Failed to remove item", "error");
        }
    };

    const clearCartOnServer = async () => {
        try {
            const res = await apiFetch("/api/cart/clear", { method: "DELETE" });
            if (res.ok) {
                dispatch({ type: "CLEAR_CART" });
                showToast("Cart cleared", "success");
            }
        } catch (e) {
            showToast("Failed to clear cart", "error");
        }
    };

    const value: CartContextValue = {
        state,
        addItem,
        removeItem,
        increment: (id) => {
            const item = state.items.find(i => i.product_id === id);
            return updateQuantity(id, (item?.quantity || 0) + 1);
        },
        decrement: (id) => {
            const item = state.items.find(i => i.product_id === id);
            return updateQuantity(id, (item?.quantity || 1) - 1);
        },
        openCart: () => dispatch({ type: "OPEN_CART" }),
        closeCart: () => dispatch({ type: "CLOSE_CART" }),
        setPaymentMethod: (m) => dispatch({ type: "SET_PAYMENT", payload: m }),
        setPickupSlot: (slot) => dispatch({ type: "SET_PICKUP_SLOT", payload: slot }),
        clearCartOnServer,
        setSearchQuery: (q) => dispatch({ type: "SET_SEARCH_QUERY", payload: q }),
        fetchCart,
        searchQuery: state.searchQuery,
        totalItems,
        totalPrice,
        isLoading: state.isLoading
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
}
