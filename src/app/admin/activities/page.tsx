"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  CreditCard,
  ShoppingCart,
  UserPlus,
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  RefreshCw,
  Bell,
  Package,
  Users,
  Clock,
  AlertTriangle
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "payment" | "order" | "refund" | "customer" | "alert" | "login" | "system";
  message: string;
  description?: string;
  amount?: string;
  time: string;
  date: string;
  status: "success" | "warning" | "error" | "info";
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  metadata?: {
    orderId?: string;
    customerId?: string;
    paymentId?: string;
    location?: string;
    device?: string;
  };
}

const RecentActivityPage = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [dateRange, setDateRange] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data - in real app, this would come from an API
  const mockActivities: ActivityItem[] = [
    {
      id: "ACT001",
      type: "payment",
      message: "Payment received from John Doe",
      description: "Premium subscription payment processed successfully",
      amount: "₹15,000",
      time: "5 minutes ago",
      date: "2024-01-15",
      status: "success",
      user: { name: "John Doe", email: "john@example.com" },
      metadata: { paymentId: "PAY_123456", customerId: "CUST_789" }
    },
    {
      id: "ACT002",
      type: "order",
      message: "New order placed by Sarah Wilson",
      description: "Enterprise package order placed with custom requirements",
      amount: "₹25,000",
      time: "12 minutes ago",
      date: "2024-01-15",
      status: "info",
      user: { name: "Sarah Wilson", email: "sarah@example.com" },
      metadata: { orderId: "ORD_456789", customerId: "CUST_101" }
    },
    {
      id: "ACT003",
      type: "refund",
      message: "Refund processed for Michael Brown",
      description: "Refund issued due to cancellation within trial period",
      amount: "₹8,500",
      time: "1 hour ago",
      date: "2024-01-15",
      status: "warning",
      user: { name: "Michael Brown", email: "michael@example.com" },
      metadata: { orderId: "ORD_321654", paymentId: "PAY_987654" }
    },
    {
      id: "ACT004",
      type: "customer",
      message: "New customer registration - Emily Davis",
      description: "New customer signed up for basic plan with referral code",
      time: "2 hours ago",
      date: "2024-01-15",
      status: "success",
      user: { name: "Emily Davis", email: "emily@example.com" },
      metadata: { customerId: "CUST_202", location: "Mumbai, India" }
    },
    {
      id: "ACT005",
      type: "alert",
      message: "Low stock alert for Premium Package",
      description: "Premium package inventory below threshold (5 units remaining)",
      time: "3 hours ago",
      date: "2024-01-15",
      status: "error",
      metadata: { location: "Warehouse Delhi" }
    },
    {
      id: "ACT006",
      type: "login",
      message: "Admin login from new device",
      description: "Administrator accessed dashboard from unrecognized device",
      time: "4 hours ago",
      date: "2024-01-15",
      status: "warning",
      user: { name: "Admin User", email: "admin@company.com" },
      metadata: { device: "Windows Chrome", location: "Delhi, India" }
    },
    {
      id: "ACT007",
      type: "system",
      message: "Database backup completed",
      description: "Scheduled daily backup completed successfully",
      time: "6 hours ago",
      date: "2024-01-15",
      status: "success"
    },
    {
      id: "ACT008",
      type: "payment",
      message: "Failed payment attempt by Alex Kumar",
      description: "Payment failed due to insufficient funds",
      amount: "₹12,000",
      time: "8 hours ago",
      date: "2024-01-14",
      status: "error",
      user: { name: "Alex Kumar", email: "alex@example.com" },
      metadata: { paymentId: "PAY_FAIL_001" }
    },
    {
      id: "ACT009",
      type: "order",
      message: "Order shipped to Priya Sharma",
      description: "Standard package shipped via express delivery",
      amount: "₹5,500",
      time: "1 day ago",
      date: "2024-01-14",
      status: "success",
      user: { name: "Priya Sharma", email: "priya@example.com" },
      metadata: { orderId: "ORD_789012", customerId: "CUST_303" }
    },
    {
      id: "ACT010",
      type: "customer",
      message: "Customer profile updated - Rajesh Kumar",
      description: "Customer updated billing address and payment method",
      time: "2 days ago",
      date: "2024-01-13",
      status: "info",
      user: { name: "Rajesh Kumar", email: "rajesh@example.com" },
      metadata: { customerId: "CUST_404", location: "Bangalore, India" }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setActivities(mockActivities);
      setFilteredActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...activities];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== "All") {
      filtered = filtered.filter(activity => activity.type === filterType);
    }

    // Status filter
    if (filterStatus !== "All") {
      filtered = filtered.filter(activity => activity.status === filterStatus);
    }

    // Date filter
    if (dateRange !== "All") {
      const today = new Date();
      const filterDate = new Date();

      switch (dateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(activity => new Date(activity.date) >= filterDate);
          break;
        case "week":
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(activity => new Date(activity.date) >= filterDate);
          break;
        case "month":
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(activity => new Date(activity.date) >= filterDate);
          break;
      }
    }

    // Sort logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount":
          const amountA = parseFloat(a.amount?.replace(/[₹,]/g, '') || '0');
          const amountB = parseFloat(b.amount?.replace(/[₹,]/g, '') || '0');
          return amountB - amountA;
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    setFilteredActivities(filtered);
    setCurrentPage(1);
  }, [activities, searchTerm, filterType, filterStatus, dateRange, sortBy]);

  const getActivityIcon = (type: string, status: string) => {
    const iconProps = { className: "w-5 h-5" };

    switch (type) {
      case "payment":
        return <CreditCard {...iconProps} className={`w-5 h-5 ${status === "success" ? "text-green-600" : status === "error" ? "text-red-600" : "text-blue-600"}`} />;
      case "order":
        return <ShoppingCart {...iconProps} className="w-5 h-5 text-blue-600" />;
      case "customer":
        return <UserPlus {...iconProps} className="w-5 h-5 text-green-600" />;
      case "refund":
        return <AlertCircle {...iconProps} className="w-5 h-5 text-yellow-600" />;
      case "alert":
        return <AlertTriangle {...iconProps} className="w-5 h-5 text-red-600" />;
      case "login":
        return <Users {...iconProps} className="w-5 h-5 text-purple-600" />;
      case "system":
        return <Activity {...iconProps} className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell {...iconProps} className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      case "info": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "payment": return "bg-green-100 text-green-800";
      case "order": return "bg-blue-100 text-blue-800";
      case "customer": return "bg-purple-100 text-purple-800";
      case "refund": return "bg-yellow-100 text-yellow-800";
      case "alert": return "bg-red-100 text-red-800";
      case "login": return "bg-indigo-100 text-indigo-800";
      case "system": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setActivities([...mockActivities]);
      setLoading(false);
    }, 1000);
  };

  const exportData = () => {
    const csvData = filteredActivities.map(activity => ({
      ID: activity.id,
      Type: activity.type,
      Message: activity.message,
      Amount: activity.amount || '',
      Status: activity.status,
      Date: activity.date,
      Time: activity.time,
      User: activity.user?.name || '',
      Email: activity.user?.email || ''
    }));

    const csvContent = "data:text/csv;charset=utf-8," +
      Object.keys(csvData[0]).join(",") + "\n" +
      csvData.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `activity_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recent Activity</h1>
            <p className="text-gray-600">Monitor all system activities and user interactions</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={refreshData} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Successful</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activities.filter(a => a.status === 'success').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Warnings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activities.filter(a => a.status === 'warning').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Errors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activities.filter(a => a.status === 'error').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Today</p>
                  <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">

              {/* Search */}
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search activities, users, or IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Type Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Type: {filterType}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterType("All")}>All Types</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("payment")}>Payment</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("order")}>Order</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("customer")}>Customer</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("refund")}>Refund</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("alert")}>Alert</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("login")}>Login</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("system")}>System</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Status Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Status: {filterStatus}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterStatus("All")}>All Status</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("success")}>Success</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("warning")}>Warning</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("error")}>Error</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("info")}>Info</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Date Range Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {dateRange === "All" ? "All Time" : dateRange}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setDateRange("All")}>All Time</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDateRange("today")}>Today</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDateRange("week")}>Last Week</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDateRange("month")}>Last Month</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest First</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest First</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("amount")}>By Amount</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("type")}>By Type</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <p>Showing {paginatedActivities.length} of {filteredActivities.length} activities</p>
          <div className="flex items-center gap-2">
            <span>Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>per page</span>
          </div>
        </div>

        {/* Activity List */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Loading activities...</p>
              </div>
            ) : paginatedActivities.length === 0 ? (
              <div className="p-8 text-center">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {paginatedActivities.map((activity) => (
                  <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.status === 'success' ? 'bg-green-100' :
                              activity.status === 'warning' ? 'bg-yellow-100' :
                                activity.status === 'error' ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                            {getActivityIcon(activity.type, activity.status)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${getTypeColor(activity.type)} text-xs`}>
                              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                            </Badge>
                            <Badge className={`${getStatusColor(activity.status)} text-xs`}>
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </Badge>
                          </div>

                          <h3 className="text-sm font-medium text-gray-900 mb-1">
                            {activity.message}
                          </h3>

                          {activity.description && (
                            <p className="text-sm text-gray-600 mb-2">
                              {activity.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.time}
                            </span>
                            <span>ID: {activity.id}</span>
                            {activity.user && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {activity.user.name}
                              </span>
                            )}
                            {activity.metadata?.location && (
                              <span>{activity.metadata.location}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {activity.amount && (
                          <div className="text-right">
                            <p className={`text-sm font-semibold ${activity.type === 'refund' ? 'text-red-600' : 'text-green-600'
                              }`}>
                              {activity.type === 'refund' ? '-' : '+'}{activity.amount}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedActivity(activity)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedActivity(activity)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {activity.metadata?.orderId && (
                                <DropdownMenuItem>
                                  <Package className="w-4 h-4 mr-2" />
                                  View Order
                                </DropdownMenuItem>
                              )}
                              {activity.user && (
                                <DropdownMenuItem>
                                  <Users className="w-4 h-4 mr-2" />
                                  View Customer
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {[...Array(Math.min(5, totalPages))].map((_, idx) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + idx;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Activity Details Modal */}
        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedActivity && getActivityIcon(selectedActivity.type, selectedActivity.status)}
                Activity Details - {selectedActivity?.id}
              </DialogTitle>
            </DialogHeader>

            {selectedActivity && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <Badge className={`${getTypeColor(selectedActivity.type)} mt-1`}>
                      {selectedActivity.type.charAt(0).toUpperCase() + selectedActivity.type.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <Badge className={`${getStatusColor(selectedActivity.status)} mt-1`}>
                      {selectedActivity.status.charAt(0).toUpperCase() + selectedActivity.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Message</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedActivity.message}</p>
                </div>

                {selectedActivity.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedActivity.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedActivity.date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Time</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedActivity.time}</p>
                  </div>
                </div>

                {selectedActivity.amount && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Amount</label>
                    <p className={`text-sm font-semibold mt-1 ${selectedActivity.type === 'refund' ? 'text-red-600' : 'text-green-600'
                      }`}>
                      {selectedActivity.type === 'refund' ? '-' : '+'}{selectedActivity.amount}
                    </p>
                  </div>
                )}

                {selectedActivity.user && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">User Information</label>
                    <div className="flex items-center space-x-3 mt-2 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedActivity.user.avatar} />
                        <AvatarFallback>
                          {selectedActivity.user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedActivity.user.name}</p>
                        <p className="text-sm text-gray-500">{selectedActivity.user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Additional Information</label>
                    <div className="mt-2 space-y-2 p-3 bg-gray-50 rounded-lg">
                      {selectedActivity.metadata.orderId && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Order ID:</span>
                          <span className="text-gray-900 font-mono">{selectedActivity.metadata.orderId}</span>
                        </div>
                      )}
                      {selectedActivity.metadata.customerId && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Customer ID:</span>
                          <span className="text-gray-900 font-mono">{selectedActivity.metadata.customerId}</span>
                        </div>
                      )}
                      {selectedActivity.metadata.paymentId && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Payment ID:</span>
                          <span className="text-gray-900 font-mono">{selectedActivity.metadata.paymentId}</span>
                        </div>
                      )}
                      {selectedActivity.metadata.location && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Location:</span>
                          <span className="text-gray-900">{selectedActivity.metadata.location}</span>
                        </div>
                      )}
                      {selectedActivity.metadata.device && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Device:</span>
                          <span className="text-gray-900">{selectedActivity.metadata.device}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setSelectedActivity(null)}>
                    Close
                  </Button>
                  {selectedActivity.metadata?.orderId && (
                    <Button>
                      <Package className="w-4 h-4 mr-2" />
                      View Order
                    </Button>
                  )}
                  {selectedActivity.user && (
                    <Button>
                      <Users className="w-4 h-4 mr-2" />
                      View Customer
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RecentActivityPage;