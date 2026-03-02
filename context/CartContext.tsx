"use client";

import React, { createContext, useContext, useReducer, useMemo, useEffect } from "react";
import type { Product } from "@/data/products";

export interface CartItem extends Product {
    quantity: number;
}

export type PaymentMethod = "pay-online" | "pay-at-store";

export interface PickupSlot {
    day: "today" | "tomorrow";
    slot: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    paymentMethod: PaymentMethod;
    pickupSlot: PickupSlot | null;
    searchQuery: string;
}

type CartAction =
    | { type: "ADD_ITEM"; payload: Product }
    | { type: "REMOVE_ITEM"; payload: number }
    | { type: "INCREMENT"; payload: number }
    | { type: "DECREMENT"; payload: number }
    | { type: "OPEN_CART" }
    | { type: "CLOSE_CART" }
    | { type: "SET_PAYMENT"; payload: PaymentMethod }
    | { type: "SET_PICKUP_SLOT"; payload: PickupSlot }
    | { type: "CLEAR_CART" }
    | { type: "LOAD_CART"; payload: Partial<CartState> }
    | { type: "SET_SEARCH_QUERY"; payload: string };

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_ITEM": {
            const existing = state.items.find((i) => i.id === action.payload.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map((i) =>
                        i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }],
            };
        }
        case "REMOVE_ITEM":
            return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
        case "INCREMENT":
            return {
                ...state,
                items: state.items.map((i) =>
                    i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
                ),
            };
        case "DECREMENT":
            return {
                ...state,
                items: state.items
                    .map((i) => (i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i))
                    .filter((i) => i.quantity > 0),
            };
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
        case "LOAD_CART":
            return { ...state, ...action.payload };
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };
        default:
            return state;
    }
}

const initialState: CartState = {
    items: [],
    isOpen: false,
    paymentMethod: "pay-online",
    pickupSlot: null,
    searchQuery: "",
};

interface CartContextValue {
    state: CartState;
    addItem: (p: Product) => void;
    removeItem: (id: number) => void;
    increment: (id: number) => void;
    decrement: (id: number) => void;
    openCart: () => void;
    closeCart: () => void;
    setPaymentMethod: (m: PaymentMethod) => void;
    setPickupSlot: (slot: PickupSlot) => void;
    clearCart: () => void;
    setSearchQuery: (q: string) => void;
    searchQuery: string;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    useEffect(() => {
        const saved = localStorage.getItem("supermarket_cart");
        if (saved) {
            dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
        }
    }, []);

    useEffect(() => {
        const { isOpen, ...toSave } = state;
        localStorage.setItem("supermarket_cart", JSON.stringify(toSave));
    }, [state]);

    const totalItems = useMemo(
        () => state.items.reduce((s, i) => s + i.quantity, 0),
        [state.items]
    );
    const totalPrice = useMemo(
        () => state.items.reduce((s, i) => s + i.price * i.quantity, 0),
        [state.items]
    );

    const value: CartContextValue = {
        state,
        addItem: (p) => dispatch({ type: "ADD_ITEM", payload: p }),
        removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
        increment: (id) => dispatch({ type: "INCREMENT", payload: id }),
        decrement: (id) => dispatch({ type: "DECREMENT", payload: id }),
        openCart: () => dispatch({ type: "OPEN_CART" }),
        closeCart: () => dispatch({ type: "CLOSE_CART" }),
        setPaymentMethod: (m) => dispatch({ type: "SET_PAYMENT", payload: m }),
        setPickupSlot: (slot) => dispatch({ type: "SET_PICKUP_SLOT", payload: slot }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
        setSearchQuery: (q) => dispatch({ type: "SET_SEARCH_QUERY", payload: q }),
        searchQuery: state.searchQuery,
        totalItems,
        totalPrice,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
}
