// context/OrderContext.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
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
  apartment?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
};

type Order = {
  _id: string;
  orderId: string;
  user: string | { _id: string; fullname: string; email: string; phone?: string };
  customerName?: string;
  email?: string;
  items: OrderItem[];
  address: OrderAddress;
  customerInfo?: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    contactTime?: string;
    specialInstructions?: string;
  };
  totalAmount: number;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentMethod?: string;
  paymentStatus?: "unpaid" | "paid" | "refunded";
  promoCode?: string;
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
  const { user } = useAuth();
  const hasFetched = useRef(false);
  const isFetching = useRef(false);

  const fetchOrders = async () => {
    if (!user?._id) {
      console.log("No user ID found, clearing orders");
      setOrders([]);
      hasFetched.current = false;
      return;
    }

    // Prevent concurrent calls
    if (isFetching.current) {
      console.log("Already fetching orders, skipping...");
      return;
    }

    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      let response;

      if (user.role === "admin") {
        console.log("Admin detected, fetching ALL orders...");
        response = await axios.get(`/api/order`);
      } else {
        console.log("Fetching orders for user:", user._id);
        response = await axios.get(`/api/order?userId=${user._id}`);
      }

      const ordersData = response.data.orders || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      hasFetched.current = true;
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const refreshOrders = async () => {
    console.log("Manually refreshing orders...");
    hasFetched.current = false;
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

  const deleteOrder = async (id: string) => {
    try {
      await axios.delete(`/api/order/${id}`);
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      console.error("Failed to delete order:", err);
      setError("Failed to delete order");
      throw err;
    }
  };

  const clearError = () => setError(null);

  // Use user._id instead of entire user object to prevent infinite loops
  useEffect(() => {
    if (user?._id && !hasFetched.current && !isFetching.current) {
      console.log("Initial fetch triggered for user:", user._id);
      fetchOrders();
    } else if (!user) {
      console.log("No user, clearing orders");
      setOrders([]);
      hasFetched.current = false;
    }
  }, [user?._id]); // Only depend on user ID, not entire user object

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