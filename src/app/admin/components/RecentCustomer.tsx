"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

// Define the customer interface
interface Customer {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  amount?: string;
  status: "Paid" | "Pending" | "Failed";
  date?: string;
  purchase?: string;
}

export default function RecentCustomersCard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback data for when API fails
  const fallbackCustomers: Customer[] = [
    {
      name: "Ravi Sharma",
      email: "ravi@example.com",
      amount: "₹8,500",
      status: "Paid",
      date: "2024-01-15",
      purchase: "Premium Package"
    },
    {
      name: "Priya Patel",
      email: "priya@example.com",
      amount: "₹3,200",
      status: "Pending",
      date: "2024-01-14",
      purchase: "Standard Package"
    },
    {
      name: "Amit Kumar",
      email: "amit@example.com",
      amount: "₹1,800",
      status: "Paid",
      date: "2024-01-13",
      purchase: "Basic Package"
    },
    {
      name: "Neha Singh",
      email: "neha@example.com",
      amount: "₹12,000",
      status: "Failed",
      date: "2024-01-12",
      purchase: "Enterprise Package"
    }
  ];

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if API endpoint exists first
        const res = await fetch("/api/customers", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          // If API doesn't exist or fails, use fallback data immediately
          setCustomers(fallbackCustomers);
          setError(`API endpoint not available (${res.status})`);
          return;
        }
        
        const data = await res.json();
        
        // Validate data structure more thoroughly
        if (data && Array.isArray(data) && data.length > 0) {
          // Ensure each customer has required fields
          const validCustomers = data.filter(customer => 
            customer && 
            typeof customer.name === 'string' && 
            typeof customer.email === 'string' && 
            typeof customer.status === 'string'
          );
          
          if (validCustomers.length > 0) {
            setCustomers(validCustomers);
          } else {
            setCustomers(fallbackCustomers);
            setError("Invalid data structure received");
          }
        } else {
          // Use fallback data if API returns empty or invalid data
          setCustomers(fallbackCustomers);
          setError("No data received from API");
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch customers");
        // Always use fallback data when API fails
        setCustomers(fallbackCustomers);
      } finally {
        setLoading(false);
      }
    };

    // Use fallback data immediately, then try to fetch from API
    setCustomers(fallbackCustomers);
    setLoading(false);
    
    // Uncomment the line below if you want to try fetching from API
    // fetchCustomers();
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Paid":
        return "default";
      case "Pending":
        return "secondary";
      case "Failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <Card className="bg-white p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Recent Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
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
          <Users className="w-5 h-5" />
          Recent Customers
        </CardTitle>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Link href="/admin/customers">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-2 text-sm text-orange-600 bg-orange-50 rounded border border-orange-200">
            Using offline data: {error}
          </div>
        )}
        <div className="space-y-4 p-3">
          {customers && customers.length > 0 ? (
            customers.slice(0, 4).map((customer, index) => (
              <div
                key={customer?.id || index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={customer?.avatar} alt={customer?.name || 'Customer'} />
                    <AvatarFallback>
                      {customer?.name ? customer.name.slice(0, 2).toUpperCase() : 'CU'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{customer?.name || 'Unknown Customer'}</p>
                    <p className="text-sm text-gray-500">{customer?.email || 'No email'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {customer?.amount || "₹0"}
                  </p>
                  <Badge
                    variant={getStatusVariant(customer?.status || 'Pending')}
                    className="text-xs"
                  >
                    {customer?.status || 'Pending'}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recent customers</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}