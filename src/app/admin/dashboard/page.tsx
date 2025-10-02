
"use client";
import { useState } from "react";
import ActivityFeed from '../components/Activity'
import RecentCustomers from '../components/RecentCustomer'
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  CalendarDays,
  Bell,
  Search,
  Download,
  EllipsisVertical,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  Activity,
  CreditCard,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customers, setCustomers] = useState([ 
    { name: "Ravi Sharma", email: "ravi@example.com", phone: "9876543210", address: "Delhi, India" },
     { name: "Priya Patel", email: "priya@example.com", phone: "9123456789", address: "Mumbai, India" }, 
     { name: "Amit Kumar", email: "amit@example.com", phone: "9988776655", address: "Bangalore, India" },
      { name: "Neha Singh", email: "neha@example.com", phone: "9112233445", address: "Kolkata, India" },
       { name: "Arjun Verma", email: "arjun@example.com", phone: "9223344556", address: "Chennai, India" }, ]);

  const [topProducts] = useState([
    {
      name: "Premium Subscription",
      sales: 245,
      revenue: "₹6,12,500",
      growth: "+18%",
      category: "Subscription",
    },
    {
      name: "Annual Plan",
      sales: 156,
      revenue: "₹4,68,000",
      growth: "+24%",
      category: "Subscription",
    },
    {
      name: "Basic Package",
      sales: 89,
      revenue: "₹1,33,500",
      growth: "+12%",
      category: "Product",
    },
    {
      name: "Enterprise Solution",
      sales: 34,
      revenue: "₹5,10,000",
      growth: "+31%",
      category: "Service",
    },
  ]);

  const [recentOrders] = useState([
    {
      id: "ORD001",
      customer: "Alice Johnson",
      product: "Premium Package",
      amount: "₹8,500",
      status: "Processing",
      time: "2 hours ago",
    },
    {
      id: "ORD002",
      customer: "Bob Martinez",
      product: "Standard Package",
      amount: "₹3,200",
      status: "Shipped",
      time: "4 hours ago",
    },
    {
      id: "ORD003",
      customer: "Carol Davis",
      product: "Basic Package",
      amount: "₹1,800",
      status: "Delivered",
      time: "1 day ago",
    },
    {
      id: "ORD004",
      customer: "David Chen",
      product: "Enterprise Package",
      amount: "₹12,000",
      status: "Pending",
      time: "2 days ago",
    },
  ]);

  const [activityFeed] = useState([
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
  ]);

  const [quickStats] = useState({
    conversionRate: "3.2%",
    avgOrderValue: "₹4,250",
    customerLifetime: "₹18,500",
    returnRate: "2.1%",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredCustomers.length / (itemsPerPage === -1 ? filteredCustomers.length : itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers =
    itemsPerPage === -1
      ? filteredCustomers
      : filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (indexToRemove: number) => {
    const updated = customers.filter((_, i) => i !== indexToRemove);
    setCustomers(updated);
  };

  const handleEdit = (name: string) => {
    alert(`Edit functionality for: ${name}`);
  };

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isOpenDate, setIsOpenDate] = useState(false);

  const toggleDateButtton = () => {
    setIsOpenDate((prev) => !prev);
  };

  const name = "Subhan";

  const generatePreviousMonthData = () => {
    const today = new Date();
    const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const year = prevMonthDate.getFullYear();
    const month = prevMonthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      data.push({
        date: date.toISOString().split("T")[0],
        transactions: Math.floor(Math.random() * 200) + 50,
        revenue: Math.floor(Math.random() * 50000) + 10000,
      });
    }

    return data;
  };

  const salesData = [
    { month: 'Jan', sales: 45000, orders: 124 },
    { month: 'Feb', sales: 52000, orders: 135 },
    { month: 'Mar', sales: 48000, orders: 118 },
    { month: 'Apr', sales: 61000, orders: 156 },
    { month: 'May', sales: 55000, orders: 142 },
    { month: 'Jun', sales: 67000, orders: 178 },
  ];

  const categoryData = [
    { name: 'Subscriptions', value: 45, color: '#8884d8' },
    { name: 'Products', value: 30, color: '#82ca9d' },
    { name: 'Services', value: 20, color: '#ffc658' },
    { name: 'Others', value: 5, color: '#ff7c7c' },
  ];

  const transactionData = generatePreviousMonthData();

  const statsCards = [
    {
      title: "Total Revenue",
      value: "₹1,25,000",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Income",
      value: "₹95,000",
      change: "+8%",
      trend: "up", 
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Profit",
      value: "₹35,000",
      change: "+15%",
      trend: "up",
      icon: TrendingUp,
      color: "text-purple-600", 
      bgColor: "bg-purple-50"
    },
    {
      title: "Pending Orders",
      value: "23",
      change: "-5%",
      trend: "down",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Total Customers",
      value: "1,254",
      change: "+18%",
      trend: "up",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Total Orders",
      value: "856",
      change: "+22%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ];

  const [filter, setFilter] = useState("All");

const filteredOrders = filter === "All" 
  ? recentOrders 
  : recentOrders.filter((o) => o.status === filter);

  return (
    <main className="bg-gray-50 min-h-screen w-full p-4 sm:p-6 md:p-8 overflow-x-hidden space-y-6">
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-md:flex-row">
          <div className="headings flex flex-col">
            <h4 className="font-semibold text-2xl text-gray-800">Welcome Back, {name}.</h4>
            <h4 className="font-extralight text-gray-600">Here's what's happening with your business today</h4>
          </div>

          <div className="flex items-center space-x-4 max-sm:items-end">
            <div className="p-3 border rounded-full bg-white hover:bg-gray-50 transition-colors">
              <Bell size={20} />
            </div>
            <div className="flex items-center space-x-3 max-sm:hidden">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-400">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="searchbar flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center border rounded-2xl px-3 py-2 w-full sm:w-[250px] bg-white">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search here .... "
              className="outline-none border-none w-full bg-transparent"
            />
            <Search size={18} />
          </div>

          <div className="flex items-center flex-wrap gap-4">
            <div className="relative">
              <Button
                onClick={toggleDateButtton}
                className="bg-white text-black hover:text-black hover:bg-gray-200"
              >
                <CalendarDays size={14} className="mr-2" />
                Date
              </Button>
              {isOpenDate && (
                <div className="absolute right-0 z-10 mt-2 bg-white p-2 rounded-lg border shadow-md">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                    captionLayout="dropdown"
                  />
                </div>
              )}
            </div>

            <Button className="cursor-pointer flex items-center gap-2">
              <Download size={14} />
              Export
            </Button>
          </div>
        </div>

        {/* Additional Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Conversion Rate</p>
                  <p className="text-2xl font-bold">{quickStats.conversionRate}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Avg. Order Value</p>
                  <p className="text-2xl font-bold">{quickStats.avgOrderValue}</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Customer Lifetime</p>
                  <p className="text-2xl font-bold">{quickStats.customerLifetime}</p>
                </div>
                <Star className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Return Rate</p>
                  <p className="text-2xl font-bold">{quickStats.returnRate}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsCards.map((stat, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' ? (
                        <TrendingUp size={16} className="text-green-500 mr-1" />
                      ) : (
                        <TrendingDown size={16} className="text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">from last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card className="bg-white p-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={transactionData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString("en-IN")}`}
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sales Distribution */}
          <Card className="bg-white p-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Sales Chart */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Overall Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'sales' ? `₹${value.toLocaleString()}` : value,
                      name === 'sales' ? 'Sales' : 'Orders'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sales" fill="#8884d8" name="Sales (₹)" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="bg-white lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 p-2">
                <Package className="w-5 h-5" />
                Recent Orders
              </CardTitle>
              <div className="flex gap-2">
                <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="sm">
      <Filter className="w-4 h-4 mr-1" />
      Filter
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => setFilter("All")}>All</DropdownMenuItem>
    <DropdownMenuItem onClick={() => setFilter("Delivered")}>Delivered</DropdownMenuItem>
    <DropdownMenuItem onClick={() => setFilter("Processing")}>Processing</DropdownMenuItem>
    <DropdownMenuItem onClick={() => setFilter("Pending")}>Pending</DropdownMenuItem>
    <DropdownMenuItem onClick={() => setFilter("Shipped")}>Shipped</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
                <Button variant="outline" size="sm">
                  <Link href="/admin/orders">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.product}</p>
                        <p className="text-xs text-gray-400">{order.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{order.amount}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={
                          order.status === 'Delivered' ? 'default' :
                          order.status === 'Processing' ? 'secondary' :
                          order.status === 'Shipped' ? 'outline' :
                          'destructive'
                        } className="text-xs">
                          {order.status}
                        </Badge>
                        <Button  variant="ghost" size="sm" 
                           className="h-6 w-6 p-0" onClick={() => setSelectedOrder(order)}>
  <Eye className="w-4 h-4" />
</Button>
<Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
    </DialogHeader>
    <div className="space-y-2 text-sm">
      <p><strong>Customer:</strong> {selectedOrder?.customer}</p>
      <p><strong>Product:</strong> {selectedOrder?.product}</p>
      <p><strong>Amount:</strong> {selectedOrder?.amount}</p>
      <p><strong>Status:</strong> {selectedOrder?.status}</p>
      <p><strong>Placed:</strong> {selectedOrder?.time}</p>
    </div>
  </DialogContent>
</Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="bg-white p-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 p-3">
                <Star className="w-5 h-5" />
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Sales:</span>
                        <span className="font-medium">{product.sales}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Revenue:</span>
                        <span className="font-semibold text-green-600">{product.revenue}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Growth:</span>
                        <span className="font-medium text-blue-600">{product.growth}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed and Recent Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ActivityFeed />
      <RecentCustomers />
    </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">All Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="border px-3 py-2 rounded-md w-full max-w-sm"
              />
              <div className="flex items-center space-x-2">
                <label htmlFor="pageSize" className="text-sm text-gray-600">
                  Rows per page:
                </label>
                <select
                  id="pageSize"
                  value={itemsPerPage}
                  onChange={(e) => {
                    const val = e.target.value === "All" ? -1 : parseInt(e.target.value);
                    setItemsPerPage(val);
                    setCurrentPage(1);
                  }}
                  className="border px-2 py-1 rounded-md text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value="All">All</option>
                </select>
              </div>
            </div>

            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3">Invoice</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Purchase</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 font-medium">{`S${(startIndex + index + 1)
                        .toString()
                        .padStart(5, "0")}`}</td>
                      <td className="p-3 flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={item.avatar} />
                          <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.email}</p>
                        </div>
                      </td>
                      <td className="p-3">{item.date}</td>
                      <td className="p-3">
                        <Badge variant={
                          item.status === "Paid" ? "default" :
                          item.status === "Pending" ? "secondary" :
                          "destructive"
                        } className="text-xs">
                          {item.status}
                        </Badge>
                      </td>
                      <td className="p-3">{item.purchase}</td>
                      <td className="p-3 font-semibold">{item.amount}</td>
                      <td className="p-3 text-right space-x-2">
                        <Button variant="outline" size="sm" className="h-8 px-2">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => handleEdit(item.name)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      No matching customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {itemsPerPage !== -1 && totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      size="sm"
                      variant={page === currentPage ? "default" : "outline"}
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Page;
// import { useState } from "react";
// import { Calendar } from "@/components/ui/calendar";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   Calendar as CalendarIcon,
//   Bell,
//   Search,
//   Download,
//   EllipsisVertical,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// const Page = () => {
//   const [customers, setCustomers] = useState([
    
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//       {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//       {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//       {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//       {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//       {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//       {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//       {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//       {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Krystal Beer",
//       email: "Evangeline30@gmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       name: "Mr. Tanya Runolfsdottir",
//       email: "Casper_Rippin@hotmail.com",
//       date: "Jan 6, 2022",
//       status: "Paid",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/33.jpg",
//     },
//     {
//       name: "Gloria Bechtelar",
//       email: "Reba95@hotmail.com",
//       date: "Jan 5, 2022",
//       status: "Refunded",
//       purchase: "Monthly subscription",
//       avatar: "https://randomuser.me/api/portraits/women/52.jpg",
//     },
//     // Add more if needed for testing
//   ]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);

//   const filteredCustomers = customers.filter(
//     (c) =>
//       c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       c.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(
//     filteredCustomers.length / (itemsPerPage === -1 ? filteredCustomers.length : itemsPerPage)
//   );
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedCustomers =
//     itemsPerPage === -1
//       ? filteredCustomers
//       : filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

//   const handleDelete = (indexToRemove: number) => {
//     const updated = customers.filter((_, i) => i !== indexToRemove);
//     setCustomers(updated);
//   };

//   const handleEdit = (name: string) => {
//     alert(`Edit functionality for: ${name}`);
//   };

//   const [date, setDate] = useState<Date | undefined>(new Date());
//   const [isOpenDate, setIsOpenDate] = useState(false);

//   const toggleDateButtton = () => {
//     setIsOpenDate((prev) => !prev);
//   };

//   const name = "Subhan";

//   const generatePreviousMonthData = () => {
//     const today = new Date();
//     const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//     const year = prevMonthDate.getFullYear();
//     const month = prevMonthDate.getMonth();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();

//     const data = [];

//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month, day);
//       data.push({
//         date: date.toISOString().split("T")[0],
//         transactions: Math.floor(Math.random() * 200) + 50,
//       });
//     }

//     return data;
//   };

//   const transactionData = generatePreviousMonthData();

//   return (
//     <main className="bg-white h-screen w-full p-4 sm:p-6 md:p-8 overflow-x-hidden   space-y-4">
//       <div className="space-y-6">
//         <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-md:flex-row">
//           <div className="headings flex flex-col">
//             <h4 className="font-semibold text-2xl">Welcome Back, {name}.</h4>
//             <h4 className="font-extralight">Welcome to the Dashboard</h4>
//           </div>

//           <div className="flex items-center space-x-4 max-sm:items-end">
//             <div className="p-3 border rounded-full">
//               <Bell size={20} />
//             </div>
//             <div className="flex items-center space-x-3 max-sm:hidden">
//               <Avatar>
//                 <AvatarImage src="https://github.com/shadcn.png" />
//                 <AvatarFallback>CN</AvatarFallback>
//               </Avatar>
//               <div>
//                 <p>{name}</p>
//                 <p className="text-sm text-gray-400">Admin</p>
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="searchbar flex flex-wrap justify-between items-center gap-4">
//           <div className="flex items-center border rounded-2xl px-3 py-2 w-full sm:w-[250px]">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//               placeholder="Search here .... "
//               className="outline-none border-none w-full bg-transparent"
//             />
//             <Search size={18} />
//           </div>

//           <div className="flex items-center flex-wrap gap-4">
//             <div className="relative">
//               <Button
//                 onClick={toggleDateButtton}
//                 className="bg-white text-black hover:text-black hover:bg-gray-200"
//               >
//                 <CalendarIcon size={14} className="mr-2" />
//                 Date
//               </Button>
//               {isOpenDate && (
//                 <div className="absolute right-0 z-10 mt-2 bg-white p-2 rounded-lg border shadow-md">
//                   <Calendar
//                     mode="single"
//                     selected={date}
//                     onSelect={setDate}
//                     className="rounded-md"
//                     captionLayout="dropdown"
//                   />
//                 </div>
//               )}
//             </div>

//             <Button className="cursor-pointer flex items-center gap-2">
//               <Download size={14} />
//               Export
//             </Button>
//           </div>
//         </div>

//         <section className="flex flex-wrap justify-center items-stretch gap-4">
//           {[1, 2, 3].map((item) => (
//             <div
//               key={item}
//               className="border rounded-2xl p-5 flex flex-col justify-between items-start w-full sm:w-[48%] md:w-[32%]"
//             >
//               <h3 className="text-[17px]">Total Revenue</h3>
//               <div className="pt-3 flex justify-between w-full items-center">
//                 <h1 className="text-3xl font-semibold">₹ 25,000</h1>
//                 <p className="bg-green-200 text-green-800 px-2 py-1 rounded-[8px] text-sm">
//                   +12%
//                 </p>
//               </div>
//               <p className="text-[14px] text-gray-400 mt-4">
//                 From Jan 01, 2024 - Mar 26, 2024
//               </p>
//             </div>
//           ))}
//         </section>
//       </div>

//       <Card className="w-full">
//         <CardHeader>
//           <CardTitle className="text-lg sm:text-xl md:text-2xl">
//             Daily Transaction Activity
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="overflow-x-auto">
//           <div className="min-w-[300px] h-[300px] sm:h-[350px] md:h-[400px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart
//                 data={transactionData}
//                 margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="date"
//                   tickFormatter={(date) =>
//                     new Date(date).toLocaleDateString("en-IN", {
//                       day: "2-digit",
//                       month: "short",
//                     })
//                   }
//                 />
//                 <YAxis />
//                 <Tooltip
//                   labelFormatter={(label) =>
//                     `Date: ${new Date(label).toLocaleDateString("en-IN")}`
//                   }
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="transactions"
//                   stroke="#42113c"
//                   name="Transactions"
//                   strokeWidth={2}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//       <Card className="p-3">
//         <div className="px-3 py-1 flex items-center justify-between w-full">
//           <h1>Customer Details</h1>
//           <button className="cursor-pointer">
//             <EllipsisVertical />
//           </button>
//         </div>

//         <Card className="p-4 overflow-x-auto">
//           <div className="flex justify-between items-center mb-3 gap-2 flex-wrap">
//             <input
//               type="text"
//               placeholder="Search by name or email..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="border px-3 py-2 rounded-md w-full max-w-sm"
//             />
//             <div className="flex items-center space-x-2">
//               <label htmlFor="pageSize" className="text-sm text-gray-600">
//                 Rows per page:
//               </label>
//               <select
//                 id="pageSize"
//                 value={itemsPerPage}
//                 onChange={(e) => {
//                   const val = e.target.value === "All" ? -1 : parseInt(e.target.value);
//                   setItemsPerPage(val);
//                   setCurrentPage(1);
//                 }}
//                 className="border px-2 py-1 rounded-md text-sm"
//               >
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//                 <option value="All">All</option>
//               </select>
//             </div>
//           </div>

//           <table className="min-w-full text-sm text-left">
//             <thead className="bg-gray-100 text-gray-600">
//               <tr>
//                 <th className="p-3">Invoice</th>
//                 <th className="p-3">Customer</th>
//                 <th className="p-3">Date</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3">Purchase</th>
//                 <th className="p-3 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y">
//               {paginatedCustomers.length > 0 ? (
//                 paginatedCustomers.map((item, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="p-3 font-medium">{`S${(startIndex + index + 1)
//                       .toString()
//                       .padStart(5, "0")}`}</td>
//                     <td className="p-3 flex items-center gap-3">
//                       <Avatar>
//                         <AvatarImage src={item.avatar} />
//                         <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <p className="font-medium text-gray-900">{item.name}</p>
//                         <p className="text-xs text-gray-500">{item.email}</p>
//                       </div>
//                     </td>
//                     <td className="p-3">{item.date}</td>
//                     <td className="p-3">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           item.status === "Paid"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-gray-200 text-gray-600"
//                         }`}
//                       >
//                         {item.status}
//                       </span>
//                     </td>
//                     <td className="p-3">{item.purchase}</td>
//                     <td className="p-3 text-right space-x-2">
//                       <button
//                         onClick={() => handleDelete(index)}
//                         className="text-red-500 hover:underline"
//                       >
//                         Delete
//                       </button>
//                       <button
//                         onClick={() => handleEdit(item.name)}
//                         className="text-purple-600 hover:underline"
//                       >
//                         Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={6} className="text-center py-4 text-gray-500">
//                     No matching customers found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {itemsPerPage !== -1 && totalPages > 1 && (
//             <div className="flex justify-center gap-2 mt-4 flex-wrap">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </Button>
//               {[...Array(totalPages)].map((_, i) => {
//                 const page = i + 1;
//                 return (
//                   <Button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     size="sm"
//                     variant={page === currentPage ? "default" : "outline"}
//                   >
//                     {page}
//                   </Button>
//                 );
//               })}
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </Button>
//             </div>
//           )}
//         </Card>
//       </Card>
//     </main>
//   );
// };

// export default Page;
