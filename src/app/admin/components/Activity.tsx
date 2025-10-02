"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, CheckCircle, AlertCircle, XCircle, CreditCard, ShoppingCart, UserPlus } from "lucide-react";

// Define the activity interface
interface ActivityItem {
  id: number | string;
  type: "payment" | "order" | "refund" | "customer" | "alert";
  message: string;
  amount?: string;
  time: string;
  status: "success" | "warning" | "error" | "info";
}

export default function ActivityFeedCard() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback data for when API fails
  const fallbackActivities: ActivityItem[] = [
    {
      id: 1,
      type: "payment",
      message: "Payment received from John Doe",
      amount: "₹5,000",
      time: "5 minutes ago",
      status: "success",
    },
    {
      id: 2,
      type: "order",
      message: "New order placed by Sarah Wilson",
      amount: "₹2,500",
      time: "12 minutes ago",
      status: "info",
    },
    {
      id: 3,
      type: "refund",
      message: "Refund processed for Michael Brown",
      amount: "₹1,200",
      time: "1 hour ago",
      status: "warning",
    },
    {
      id: 4,
      type: "customer",
      message: "New customer registration - Emily Davis",
      amount: "",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 5,
      type: "alert",
      message: "Low stock alert for Premium Package",
      amount: "",
      time: "3 hours ago",
      status: "error",
    },
  ];

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API
        const res = await fetch("/api/activities");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        // Validate data structure
        if (Array.isArray(data) && data.length > 0) {
          setActivities(data);
        } else {
          // Use fallback data if API returns empty or invalid data
          setActivities(fallbackActivities);
        }
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch activities");
        // Use fallback data when API fails
        setActivities(fallbackActivities);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type: string, status: string) => {
    const iconProps = { className: "w-4 h-4" };
    
    switch (type) {
      case "payment":
        return <CreditCard {...iconProps} className={`w-4 h-4 ${status === "success" ? "text-green-600" : "text-blue-600"}`} />;
      case "order":
        return <ShoppingCart {...iconProps} className="w-4 h-4 text-blue-600" />;
      case "customer":
        return <UserPlus {...iconProps} className="w-4 h-4 text-green-600" />;
      case "refund":
        return <AlertCircle {...iconProps} className="w-4 h-4 text-yellow-600" />;
      case "alert":
        return <XCircle {...iconProps} className="w-4 h-4 text-red-600" />;
      default:
        if (status === "success") {
          return <CheckCircle {...iconProps} className="w-4 h-4 text-green-600" />;
        } else if (status === "warning") {
          return <AlertCircle {...iconProps} className="w-4 h-4 text-yellow-600" />;
        } else if (status === "error") {
          return <XCircle {...iconProps} className="w-4 h-4 text-red-600" />;
        } else {
          return <Activity {...iconProps} className="w-4 h-4 text-blue-600" />;
        }
    }
  };

  const getBackgroundColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100";
      case "warning":
        return "bg-yellow-100";
      case "error":
        return "bg-red-100";
      default:
        return "bg-blue-100";
    }
  };

  if (loading) {
    return (
      <Card className="bg-white p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white p-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
        <Button variant="outline" size="sm">
          <Link href="/admin/activities">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-2 text-sm text-orange-600 bg-orange-50 rounded border border-orange-200">
            Using offline data: {error}
          </div>
        )}
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getBackgroundColor(activity.status)}`}
                >
                  {getActivityIcon(activity.type, activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    {activity.amount && (
                      <p className="text-sm font-semibold text-green-600">
                        {activity.amount}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}