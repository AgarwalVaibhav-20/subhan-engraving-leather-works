// context/OrderContext.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useAuth } from "@/context/UserContext";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderAddress = {
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
};

type Order = {
  _id: string;
  user: string | { _id: string; fullname: string; email: string; phone?: string };
  customerName: string;
  email: string;
  items: OrderItem[];
  address: OrderAddress;
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  createdAt: string;
  updatedAt: string;
};

type OrderContextType = {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  clearError: () => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // assume { _id, role, fullname, email }

  const fetchOrders = async () => {
    if (!user?._id) {
      console.log("No user ID found, clearing orders");
      setOrders([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;

      if (user.role === "admin") {
        // Admin: fetch all orders
        console.log("Admin detected, fetching ALL orders...");
        response = await axios.get(`/api/order`);
      } else {
        // Normal user: fetch own orders
        console.log("Fetching orders for user:", user._id);
        response = await axios.get(`/api/order?userId=${user._id}`);
      }

      const ordersData = response.data.orders || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    console.log("Refreshing orders...");
    await fetchOrders();
  };

  const getOrderById = (id: string): Order | undefined =>
    orders.find((order) => order._id === id);

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      const response = await axios.put(`/api/order/${id}`, updates);
      const updatedOrder: Order = response.data;

      setOrders((prev) =>
        prev.map((order) => (order._id === id ? { ...order, ...updatedOrder } : order))
      );
    } catch (err) {
      console.error("Failed to update order:", err);
      setError("Failed to update order");
      throw err;
    }
  };

  // Delete order
  const deleteOrder = async (id: string) => {
    try {
      await axios.delete(`/api/order/${id}`);
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      console.log(err , "Error of deleting order")
      console.error("Failed to delete order:", err);
      setError("Failed to delete order");
      throw err;
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      console.log("No user, clearing orders");
      setOrders([]);
    }
  }, [user]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        fetchOrders,
        refreshOrders,
        getOrderById,
        updateOrder,
        deleteOrder,
        clearError,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder must be used inside OrderProvider");
  return context;
};
