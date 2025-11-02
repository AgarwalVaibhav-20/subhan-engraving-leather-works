"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useAuth } from "@/context/UserContext";

type Transaction = {
    _id?: string;
    amount: number;
    date: string;
    customerName: string;
    email: string;
    paymentMethod?: "Cash" | "Online";
    address: string;
    items: number;
    status?: "pending" | "completed" | "failed";
    products?: IProduct[];
};

type TransactionContextType = {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    fetchTransactions: () => Promise<void>;
    addTransaction: (transaction: Omit<Transaction, "_id">) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('authToken');
    // ✅ Fetch all transactions
    const fetchTransactions = async () => {

        // if (!user || !token) return;
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`/api/transaction`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("second Fetched transactions:", res.data);
            setTransactions(res.data);
        } catch (err: any) {
            console.error("Failed to fetch transactions:", err);
            setError(err.response?.data?.message || "Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Add a new transaction
    const addTransaction = async (transaction: Omit<Transaction, "_id">) => {
        try {
            const res = await axios.post("/api/transaction", transaction, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTransactions((prev) => [res.data, ...prev]);
            await fetchTransactions();
        } catch (err: any) {
            console.error("Failed to add transaction:", err);
            setError(err.response?.data?.message || "Failed to add transaction");
        }
    };

    // ✅ Delete a transaction
    const deleteTransaction = async (id: string) => {
        try {
            await axios.delete(`/api/transaction/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTransactions((prev) => prev.filter((t) => t._id !== id));
        } catch (err: any) {
            console.error("Failed to delete transaction:", err);
            setError(err.response?.data?.message || "Failed to delete transaction");
        }
    };
    const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
        try {
            const res = await axios.put(`/api/transaction/${id}`, transaction, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTransactions((prev) =>
                prev.map((t) => (t._id === id ? { ...t, ...res.data } : t))
            );
            await fetchTransactions();
        } catch (err: any) {
            console.error("Failed to update transaction:", err);
            console.log(err.response?.data?.message);
            setError(err.response?.data?.message || "Failed to update transaction");
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [user, token]);

    return (
        <TransactionContext.Provider
            value={{ transactions, loading, error, fetchTransactions, addTransaction, deleteTransaction, updateTransaction }}
        >
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransaction = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error("useTransaction must be used within a TransactionProvider");
    }
    return context;
};
