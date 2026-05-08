"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface WishlistContextType {
    wishlistItems: any[];
    toggleWishlist: (product: any) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchWishlist = async () => {
        const token = localStorage.getItem("golalita_token");
        if (!token) {
            const localWishlist = localStorage.getItem("golalita_wishlist");
            if (localWishlist) {
                setWishlistItems(JSON.parse(localWishlist));
            }
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/python/user/wishlist", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setWishlistItems(data);
                } else if (data && typeof data === 'object' && Object.keys(data).length === 0) {
                    // Silent fallback for empty object
                    setWishlistItems([]);
                } else {
                    console.error("WISHLIST_API_INVALID_DATA:", data);
                    setWishlistItems([]);
                }
            }
        } catch (err) {
            console.error("WISHLIST_FETCH_ERROR:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const toggleWishlist = async (product: any) => {
        const token = localStorage.getItem("golalita_token");
        if (!token) {
            const currentWishlist = Array.isArray(wishlistItems) ? wishlistItems : [];
            let newWishlist = [...currentWishlist];
            const index = newWishlist.findIndex(item => item.id === product.id);
            if (index > -1) {
                newWishlist.splice(index, 1);
            } else {
                newWishlist.push(product);
            }
            setWishlistItems(newWishlist);
            localStorage.setItem("golalita_wishlist", JSON.stringify(newWishlist));
            return;
        }

        try {
            const res = await fetch(`/api/python/user/wishlist/${product.id}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchWishlist();
            }
        } catch (err) {
            console.error("TOGGLE_WISHLIST_ERROR:", err);
        }
    };

    const isInWishlist = (productId: string) => {
        return Array.isArray(wishlistItems) && wishlistItems.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist, isLoading }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
