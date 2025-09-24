"use client";

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Type for Product
type ProductType = {
  name?: string;
  description?: string;
  price?: number;
  images?: string[];
  category?: string;
  brand?: string;
  inStock?: number;
};

// Type for Context Value
type ProductContextType = {
  product: ProductType | null;
  setProduct: Dispatch<SetStateAction<ProductType | null>>;
};

// Create context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider component
export const ProductAuthProvider = ({ children }: { children: ReactNode }) => {
  const [product, setProduct] = useState<ProductType | null>(null);

  return (
    <ProductContext.Provider value={{ product, setProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook
export const useProduct = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductAuthProvider");
  }
  return context;
};
