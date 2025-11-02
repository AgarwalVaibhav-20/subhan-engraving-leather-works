
"use client"

import { useEffect, useState } from 'react';
import { Search, Filter, Download, Plus, Eye, Edit2, Trash2, Mail, Phone, MapPin, Calendar, ShoppingBag, IndianRupee, X, User, Package, CreditCard, Clock, Star, ChevronLeft, ChevronRight, Save, Cancel } from 'lucide-react';
import { useCustomers, Customer as ContextCustomer } from "@/context/CustomerProvider";

interface CustomerDisplay extends ContextCustomer {
  phone?: string;
  address?: string;
  status?: 'Active' | 'Inactive' | 'Suspended';
  joinDate?: string;
  lastLogin?: string;
  totalOrders?: number;
  totalSpent?: number;
  averageOrderValue?: number;
  preferredPayment?: string;
  lastOrderDate?: string;
  loyaltyPoints?: number;
}

interface Order {
  orderID: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  items: number;
  paymentMethod: string;
}

// Generate mock orders for a customer
const generateMockOrders = (customerId: string, orderCount: number): Order[] => {
  const statuses: Order['status'][] = ['Completed', 'Pending', 'Cancelled'];
  const payments = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'];

  return Array.from({ length: orderCount }, (_, i) => ({
    orderID: `ORD-${customerId.slice(-3)}-${String(i + 1).padStart(3, '0')}`,
    date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
    amount: Math.floor(Math.random() * 10000) + 500,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    items: Math.floor(Math.random() * 10) + 1,
    paymentMethod: payments[Math.floor(Math.random() * payments.length)]
  }));
};

// Transform context customer to display customer with computed fields
const transformCustomerForDisplay = (customer: ContextCustomer): CustomerDisplay => {
  const defaultAddress = customer.addresses?.find(a => a.isDefault) || customer.addresses?.[0];

  // Generate consistent random data based on customer ID
  const seed = customer.customerID.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  const totalOrders = random(1, 50);
  const totalSpent = random(5000, 100000);

  return {
    ...customer,
    phone: (customer as any).phone || '+91 ' + String(random(7000000000, 9999999999)),
    address: defaultAddress
      ? `${defaultAddress.city}, ${defaultAddress.state}`
      : 'Not specified',
    status: customer.isloggedIn ? 'Active' : customer.isVerified ? 'Inactive' : 'Suspended',
    joinDate: customer.createdAt,
    lastLogin: customer.updatedAt,
    totalOrders: totalOrders,
    totalSpent: totalSpent,
    averageOrderValue: totalSpent / totalOrders,
    preferredPayment: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking'][random(0, 3)],
    lastOrderDate: customer.updatedAt,
    loyaltyPoints: random(100, 1000)
  };
};

export default function CustomersTablePage() {
  const { customers: contextCustomers, updateCustomer, deleteCustomer, loading, error } = useCustomers();
  const [customers, setCustomers] = useState<CustomerDisplay[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDisplay | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'edit' | 'orders'>('view');
  const [editForm, setEditForm] = useState<CustomerDisplay | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Transform context customers to display customers
  useEffect(() => {
    const displayCustomers = contextCustomers.map(transformCustomerForDisplay);
    setCustomers(displayCustomers);
  }, [contextCustomers]);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aValue: any, bValue: any;
    switch (sortBy) {
      case 'name':
        aValue = a.fullname.toLowerCase();
        bValue = b.fullname.toLowerCase();
        break;
      case 'orders':
        aValue = a.totalOrders || 0;
        bValue = b.totalOrders || 0;
        break;
      case 'spent':
        aValue = a.totalSpent || 0;
        bValue = b.totalSpent || 0;
        break;
      case 'date':
        aValue = new Date(a.joinDate || 0);
        bValue = new Date(b.joinDate || 0);
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = sortedCustomers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCustomerClick = (customer: CustomerDisplay) => {
    setSelectedCustomer(customer);
    setSidebarMode('view');
    setSidebarOpen(true);
  };

  const handleEditCustomer = (customer: CustomerDisplay) => {
    setSelectedCustomer(customer);
    setEditForm({ ...customer });
    setSidebarMode('edit');
    setSidebarOpen(true);
  };

  const handleViewOrders = (customer: CustomerDisplay) => {
    setSelectedCustomer(customer);
    const orders = generateMockOrders(customer.customerID, customer.totalOrders || 0);
    setCustomerOrders(orders);
    setSidebarMode('orders');
    setSidebarOpen(true);
  };

  const handleSaveCustomer = async () => {
    if (editForm) {
      const updateData: Partial<ContextCustomer> = {
        fullname: editForm.fullname,
        email: editForm.email,
        isloggedIn: editForm.status === 'Active',
        isVerified: editForm.status !== 'Suspended'
      };

      const result = await updateCustomer(editForm._id, updateData);
      if (result) {
        setSidebarMode('view');
        setSelectedCustomer(editForm);
      }
    }
  };

  const handleDeleteCustomer = async (customer: CustomerDisplay) => {
    if (confirm(`Are you sure you want to delete ${customer.fullname}?`)) {
      const success = await deleteCustomer(customer._id);
      if (success) {
        closeSidebar();
      }
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setTimeout(() => {
      setSelectedCustomer(null);
      setEditForm(null);
      setCustomerOrders([]);
      setSidebarMode('view');
    }, 300);
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status?: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Inactive':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'Suspended':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getOrderStatusBadge = (status?: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active': return 'bg-green-400';
      case 'Inactive': return 'bg-gray-400';
      case 'Suspended': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const customersTier = (totalSpent?: number) => {
    if (!totalSpent) return 'Silver';
    if (totalSpent > 50000) return 'Premium';
    if (totalSpent > 25000) return 'Gold';
    return 'Silver';
  };

  const calculateDaysSinceJoining = (joinDate?: string) => {
    if (!joinDate) return 0;
    return Math.floor((Date.now() - new Date(joinDate).getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateOrderFrequency = (customer: CustomerDisplay) => {
    const daysSinceJoining = calculateDaysSinceJoining(customer.joinDate);
    const monthsSinceJoining = Math.max(Math.floor(daysSinceJoining / 30), 1);
    return Math.floor((customer.totalOrders || 0) / monthsSinceJoining);
  };

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <main className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Customers</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <main className={`flex-1 p-6 max-w-7xl mx-auto transition-all duration-300 ${sidebarOpen ? 'mr-96' : ''}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-600 mt-1">Manage your customer database</p>
            </div>
            {/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus size={20} />
              Add Customer
            </button> */}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="text-blue-600" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-xl font-semibold">{customers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <IndianRupee className="text-green-600" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-xl font-semibold">{formatCurrency(customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0))}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ShoppingBag className="text-purple-600" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Active Customers</p>
                  <p className="text-xl font-semibold">{customers.filter(c => c.status === 'Active').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CreditCard className="text-orange-600" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(
                      customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) /
                      Math.max(customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0), 1)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="orders-desc">Most Orders</option>
                <option value="spent-desc">Highest Spent</option>
                <option value="date-desc">Newest First</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCustomers.map((customer) => (
                  <tr
                    key={customer.customerID}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleCustomerClick(customer)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                            {customer.profileImage}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.fullname}</div>
                          <div className="text-sm text-gray-500">ID: {customer.customerID.slice(0, 10).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Mail size={14} className="text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Phone size={14} className="text-gray-400" />
                        {customer.phone}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={14} className="text-gray-400" />
                        {customer.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer.totalOrders}</div>
                      <div className="text-sm text-gray-500">orders</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(customer.totalSpent)}</div>
                      <div className="text-sm text-gray-500">lifetime value</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(customer.status)}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(customer.joinDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="View Profile"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomerClick(customer);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors"
                          title="Edit Customer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCustomer(customer);
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                          title="View Orders"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewOrders(customer);
                          }}
                        >
                          <Package size={16} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete Customer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustomer(customer);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {paginatedCustomers.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'All'
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by adding your first customer.'
                }
              </p>
            </div>
          )}

          {/* Enhanced Pagination */}
          {sortedCustomers.length > 0 && (
            <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(endIndex, sortedCustomers.length)}</span> of{' '}
                    <span className="font-medium">{sortedCustomers.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {generatePageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                        disabled={typeof page !== 'number'}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : typeof page === 'number'
                            ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            : 'bg-white text-gray-400 border-gray-300 cursor-default'
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        {selectedCustomer && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 bg-gray-50 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {sidebarMode === 'edit' ? 'Edit Customer' :
                    sidebarMode === 'orders' ? 'Customer Orders' : 'Customer Details'}
                </h2>
                <button
                  onClick={closeSidebar}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Customer Header */}
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-xl">
                  {selectedCustomer.profileImage}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedCustomer.fullname}</h3>
                  <p className="text-gray-500">ID: {selectedCustomer.customerID.toLocaleUpperCase()}</p>
                  {sidebarMode !== 'edit' && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusBadge(selectedCustomer.status)}`}>
                      <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(selectedCustomer.status)}`}></div>
                      {selectedCustomer.status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {sidebarMode === 'edit' && editForm ? (
                /* Edit Form */
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editForm.fullname}
                      onChange={(e) => setEditForm({ ...editForm, fullname: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={editForm.address || ''}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editForm.status || 'Active'}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Customer['status'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Payment</label>
                    <select
                      value={editForm.preferredPayment || 'Credit Card'}
                      onChange={(e) => setEditForm({ ...editForm, preferredPayment: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSaveCustomer}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
                    >
                      <Save size={18} />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={() => setSidebarMode('view')}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
                    >
                      <X size={18} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : sidebarMode === 'orders' ? (
                /* Orders List */
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Order History</h4>
                  <div className="space-y-4">
                    {customerOrders.length > 0 ? (
                      customerOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((order) => (
                        <div key={order.orderID} className="bg-gray-50 rounded-lg p-4 border">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium text-gray-900">Order {order.orderID}</h5>
                              <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                            </div>
                            <span className={getOrderStatusBadge(order.status)}>
                              {order.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <div>
                              <p className="text-xs text-gray-500">Amount</p>
                              <p className="font-medium text-gray-900">{formatCurrency(order.amount)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Items</p>
                              <p className="font-medium text-gray-900">{order.items} items</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-gray-500">Payment Method</p>
                              <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                        <p className="mt-1 text-sm text-gray-500">This customer hasn't placed any orders yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Back to Profile Button */}
                  <div className="mt-6">
                    <button
                      onClick={() => setSidebarMode('view')}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
                    >
                      <Eye size={18} />
                      <span>Back to Profile</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode - Customer Details */
                <>
                  {/* Contact Information */}
                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-900">{selectedCustomer.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-900">{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-900">{selectedCustomer.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Statistics */}
                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Order Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <Package size={20} className="text-blue-600" />
                          <span className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</span>
                        </div>
                        <p className="text-sm text-blue-600 mt-1">Total Orders</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <IndianRupee size={20} className="text-green-600" />
                          <span className="text-lg font-bold text-green-600">{formatCurrency(selectedCustomer.totalSpent).slice(1)}</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">Total Spent</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <CreditCard size={20} className="text-purple-600" />
                          <span className="text-lg font-bold text-purple-600">{formatCurrency(selectedCustomer.averageOrderValue).slice(1)}</span>
                        </div>
                        <p className="text-sm text-purple-600 mt-1">Avg Order</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <Star size={20} className="text-orange-600" />
                          <span className="text-2xl font-bold text-orange-600">{selectedCustomer.loyaltyPoints}</span>
                        </div>
                        <p className="text-sm text-orange-600 mt-1">Loyalty Points</p>
                      </div>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Account Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Join Date</span>
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-900">{formatDate(selectedCustomer.joinDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Last Login</span>
                        <div className="flex items-center space-x-2">
                          <Clock size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-900">{formatDate(selectedCustomer.lastLogin)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Last Order</span>
                        <div className="flex items-center space-x-2">
                          <Package size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-900">{formatDate(selectedCustomer.lastOrderDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Preferred Payment</span>
                        <div className="flex items-center space-x-2">
                          <CreditCard size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-900">{selectedCustomer.preferredPayment}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Insights */}
                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Customer Insights</h4>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-400">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-900">Customer Since</span>
                          <span className="text-sm text-blue-700">
                            {calculateDaysSinceJoining(selectedCustomer.joinDate)} days
                          </span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-l-4 border-green-400">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-900">Customer Tier</span>
                          <span className="text-sm text-green-700">
                            {customersTier(selectedCustomer.totalSpent)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border-l-4 border-purple-400">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-purple-900">Order Frequency</span>
                          <span className="text-sm text-purple-700">
                            {calculateOrderFrequency(selectedCustomer)} orders/month
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
                      onClick={() => handleEditCustomer(selectedCustomer)}
                    >
                      <Edit2 size={18} />
                      <span>Edit Customer</span>
                    </button>
                    <button
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
                      onClick={() => alert(`Sending email to ${selectedCustomer.email}`)}
                    >
                      <Mail size={18} />
                      <span>Send Email</span>
                    </button>
                    <button
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
                      onClick={() => handleViewOrders(selectedCustomer)}
                    >
                      <Package size={18} />
                      <span>View Orders</span>
                    </button>
                    <button
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
                      onClick={() => handleDeleteCustomer(selectedCustomer)}
                    >
                      <Trash2 size={18} />
                      <span>Delete Customer</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}