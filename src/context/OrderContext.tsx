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
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
};

type CustomerInfo = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  contactTime?: string;
  specialInstructions?: string;
};

type Order = {
  _id: string;
  user: string | {
    _id: string;
    fullname: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  address: OrderAddress;
  customerInfo: CustomerInfo;
  totalAmount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  promoCode?: string;
  paymentMethod: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  createdAt: string;
  updatedAt: string;
};

type OrderContextType = {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
  clearError: () => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user?._id && !user?.id) {
      setOrders([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = user._id || user.id;
      const response = await axios.get(`/api/orders?userId=${userId}`);
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(
        axios.isAxiosError(err) && err.response
          ? err.response.data.error || "Failed to load orders"
          : "Failed to load orders"
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    await fetchOrders();
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((order) => order._id === orderId);
  };

  const clearError = () => {
    setError(null);
  };

  // Auto-fetch orders when user changes
  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
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
        getOrderById,
        refreshOrders,
        clearError,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used inside OrderProvider");
  }
  return context;
};