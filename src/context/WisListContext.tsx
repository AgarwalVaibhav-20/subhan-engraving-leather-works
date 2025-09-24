"use client";
import { createContext, useContext, useEffect, useState } from "react";

type WishListItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
};

type WishlistContextType = {
  wishlist: WishListItem[];
  addToWishlist: (item: WishListItem) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  getTotalItems?: () => number;
  getTotalPrice?: () => number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishListItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (item: WishListItem) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeFromWishlist = (id: string) =>
    setWishlist((prev) => prev.filter((item) => item.id !== id));

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem("wishlist");
  };

  const increaseQuantity = (id: string) =>
    setWishlist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

  const decreaseQuantity = (id: string) =>
    setWishlist((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );

  // helpers
  const getTotalItems = () => wishlist.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => wishlist.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        increaseQuantity,
        decreaseQuantity,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
};
