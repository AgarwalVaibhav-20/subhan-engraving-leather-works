"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export interface ProductType {
  _id?: string;
  name: string;
  description: string;
  aboutTheItems?: string[];
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  brand: string;
  inStock: number;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductContextType {
  products: ProductType[];
  fetchProducts: () => Promise<void>;
  addProduct: (productData: FormData | ProductType) => Promise<void>;
  updateProduct: (id: string, productData: Partial<ProductType>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/product");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new product
  const addProduct = async (productData: FormData | ProductType) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/product", productData);
      toast.success("Product added successfully");
      await fetchProducts();
    } catch (err: any) {
      console.error("Error adding product:", err);
      toast.error(err.response?.data?.error || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update existing product
  const updateProduct = async (id: string, productData: Partial<ProductType>) => {
    try {
      setLoading(true);
      const res = await axios.put(`/api/product/${id}`, productData);
      toast.success("Product updated successfully");
      await fetchProducts();
    } catch (err: any) {
      console.error("Error updating product:", err);
      toast.error(err.response?.data?.error || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete product
  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.delete(`/api/product/${id}`);
      toast.success("Product deleted successfully");
      await fetchProducts();
    } catch (err: any) {
      console.log(err , "error of deleting")
      console.error("Error deleting product:", err);
      toast.error(err.response?.data?.error || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, fetchProducts, addProduct, updateProduct, deleteProduct, loading }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// ✅ Custom hook
export const useProduct = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
