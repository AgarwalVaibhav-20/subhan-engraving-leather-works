"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useAuth } from "@/context/UserContext";

type DashboardStats = {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    todayOrders: number;
    todayRevenue: number;
};

type DashboardContextType = {
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
    fetchStats: () => Promise<void>;
    refreshStats: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchStats = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            const endpoint = user?.role === "admin"
                ? "/api/order"
                : ``;

            const response = await axios.get(endpoint);
            setStats(response.data.stats);
            console.log("✅ Fetched dashboard stats:", response.data);
        } catch (err) {
            console.error("❌ Failed to fetch dashboard stats:", err);
            setError("Failed to fetch dashboard stats");
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    const refreshStats = async () => {
        await fetchStats();
    };

    useEffect(() => {
        if (user?._id) fetchStats();
    }, [user?._id]);

    return (
        <DashboardContext.Provider value={{ stats, loading, error, fetchStats, refreshStats }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) throw new Error("useDashboard must be used inside DashboardProvider");
    return context;
};
