"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
    product: any;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: any, quantity?: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => void;
    subtotal: number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCart = async () => {
        const token = localStorage.getItem("golalita_token");
        if (!token) {
            // Load from local storage for guest
            const localCart = localStorage.getItem("golalita_cart");
            if (localCart) {
                setCartItems(JSON.parse(localCart));
            }
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/python/user/cart", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setCartItems(data);
                } else {
                    setCartItems([]);
                }
            } else if (res.status === 401) {
                localStorage.removeItem("golalita_token");
                fetchCart(); // Retry as guest
            }
        } catch (err) {
            console.error("CART_FETCH_ERROR:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (product: any, quantity: number = 1) => {
        const token = localStorage.getItem("golalita_token");
        if (!token) {
            const currentCart = Array.isArray(cartItems) ? cartItems : [];
            const newCart = [...currentCart];
            const existingIndex = newCart.findIndex(item => item.product.id === product.id);
            if (existingIndex > -1) {
                newCart[existingIndex].quantity += quantity;
            } else {
                newCart.push({ product, quantity });
            }
            setCartItems(newCart);
            localStorage.setItem("golalita_cart", JSON.stringify(newCart));
            return;
        }

        try {
            const res = await fetch("/api/python/user/cart", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ product_id: product.id, quantity: (cartItems.find(i => i.product.id === product.id)?.quantity || 0) + quantity })
            });
            if (res.ok) {
                fetchCart();
            } else if (res.status === 401) {
                localStorage.removeItem("golalita_token");
                addToCart(product, quantity);
            }
        } catch (err) {
            console.error("ADD_TO_CART_ERROR:", err);
        }
    };

    const removeFromCart = async (productId: string) => {
        const token = localStorage.getItem("golalita_token");
        if (!token) {
            const currentCart = Array.isArray(cartItems) ? cartItems : [];
            const newCart = currentCart.filter(item => item.product.id !== productId);
            setCartItems(newCart);
            localStorage.setItem("golalita_cart", JSON.stringify(newCart));
            return;
        }

        try {
            const res = await fetch(`/api/python/user/cart/${productId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchCart();
            }
        } catch (err) {
            console.error("REMOVE_FROM_CART_ERROR:", err);
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        const token = localStorage.getItem("golalita_token");
        if (!token) {
            const currentCart = Array.isArray(cartItems) ? cartItems : [];
            const newCart = currentCart.map(item => 
                item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
            );
            setCartItems(newCart);
            localStorage.setItem("golalita_cart", JSON.stringify(newCart));
            return;
        }

        try {
            const res = await fetch("/api/python/user/cart", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ product_id: productId, quantity: Math.max(1, quantity) })
            });
            if (res.ok) {
                fetchCart();
            } else if (res.status === 401) {
                localStorage.removeItem("golalita_token");
                updateQuantity(productId, quantity);
            }
        } catch (err) {
            console.error("UPDATE_QUANTITY_ERROR:", err);
        }
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("golalita_cart");
    };

    const subtotal = Array.isArray(cartItems) 
        ? cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0), 0)
        : 0;

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, isLoading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
