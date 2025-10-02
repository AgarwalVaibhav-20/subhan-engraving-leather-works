"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Address {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  isDefault: boolean;
}

export interface Customer {
  _id: string;
  customerID: string;
  fullname: string;
  email: string;
  password?: string;
  addresses: Address[];   
  profileImage?: string;
  role: "user" | "admin";
  isVerified: boolean;
  isloggedIn: boolean;
  verifyCode?: string | null;
  verifyCodeExpiry?: Date | null;
  isAcceptingMessage: boolean;
  reviews: any[];
  message: any[];
  createdAt: string;
  updatedAt: string;
}


interface CustomerContextType {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  getCustomer: (id: string) => Promise<Customer | null>;
  addCustomer: (data: Partial<Customer>) => Promise<Customer | null>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<Customer | null>;
  deleteCustomer: (id: string) => Promise<boolean>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all customers
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customers");
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get single customer
  const getCustomer = async (id: string): Promise<Customer | null> => {
    try {
      const res = await fetch(`/api/customers/${id}`);
      if (!res.ok) throw new Error("Failed to fetch customer");
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // Add new customer
  const addCustomer = async (data: Partial<Customer>): Promise<Customer | null> => {
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add customer");
      const newCustomer = await res.json();
      setCustomers((prev) => [...prev, newCustomer]);
      return newCustomer;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // Update customer
  const updateCustomer = async (id: string, data: Partial<Customer>): Promise<Customer | null> => {
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update customer");
      const updated = await res.json();
      setCustomers((prev) =>
        prev.map((c) => (c._id === id ? updated : c))
      );
      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // Delete customer
  const deleteCustomer = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete customer");
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <CustomerContext.Provider
      value={{ customers, loading, error, fetchCustomers, getCustomer, addCustomer, updateCustomer, deleteCustomer }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomers must be used within a CustomerProvider");
  }
  return context;
};
