"use client"
import { useState, useEffect } from 'react';
import { useDashboard } from "@/context/DashboardContext";
import {
  Search,
  Eye,
  Trash2,
  Download,
  Plus,
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrder } from '@/context/OrderContext'
import toast from "react-hot-toast";
// Define the Order type to match the context
type Order = {
  _id: string;
  customerName: string;
  email: string;
  items: { name: string; price: number; quantity: number }[];
  address: { street?: string; apartment?: string; city?: string; state?: string; zipcode?: string; country?: string; };
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  createdAt: string;
  updatedAt: string;
};


const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  shipped: 'bg-purple-100 text-purple-800', // Added for consistency
};

const statusIcons: { [key: string]: React.ElementType } = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  completed: CheckCircle,
  cancelled: XCircle
};

export default function AdminOrderDashboard() {
  
  const { stats, loading, error: er, refreshStats } = useDashboard();
  console.log("stats" , stats)

  if (loading) return <div role="status" className='flex justify-center items-center h-screen'>
    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
    </svg>
    <span class="sr-only" >Loading Orders...</span>
  </div>
  if (er) return <p className="text-red-500 text-center">{er}</p>;
  // if (!stats) return <p className='flex justify-center items-center h-screen'>No Orders available</p>;
  const { orders, error, fetchOrders, updateOrder, deleteOrder } = useOrder();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showExportModal, setShowExportModal] = useState(false);

  console.log("Order", orders.length)

  // This state is local to the export modal
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportDateRange, setExportDateRange] = useState('all');
  const [exportStatus, setExportStatus] = useState('all');

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
    // fetchOrders()
    setCurrentPage(1);
  }, [searchTerm, statusFilter, orders]);

  console.log("Orders length:", orders.length);
  // Get dashboard statistics from live data
  const statistics = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.status !== 'cancelled' ? order.totalAmount : 0), 0),
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    deliveredOrders: orders.filter(order => order.status === 'completed').length
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    await updateOrder(orderId, { status: newStatus });
    toast.success("✅ Order status updated successfully!");
    await fetchOrders()
  };

  const handleDeleteOrder = async (orderId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      setDeleting(orderId);

      const toastId = toast.loading("Deleting order...");
      await deleteOrder(orderId);

      toast.dismiss(toastId);
      toast.success("✅ Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("❌ Failed to delete order. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // --- EXPORT FUNCTIONALITY ---
  const getFilteredExportData = () => {
    let exportData = [...orders];

    if (exportStatus !== 'all') {
      exportData = exportData.filter(order => order.status === exportStatus);
    }

    if (exportDateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (exportDateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      exportData = exportData.filter(order => new Date(order.createdAt) >= filterDate);
    }
    return exportData;
  };

  const exportToCSV = (data: Order[]) => {
    const headers = [
      'OrderID',
      'CustomerName',
      'Email',
      'Status',
      'TotalAmount',
      'TotalQuantity',
      'ItemsCount',
      'OrderDate',
      'Address'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(o => {
        const totalQuantity = o.items.reduce((sum, item) => sum + item.quantity, 0);
        const address = `${o.address.street || ''}, ${o.address.city || ''}, ${o.address.state || ''} ${o.address.zipcode || ''}`.trim();

        return [
          o._id,
          `"${o.customerName}"`,
          o.email,
          o.status,
          o.totalAmount,
          totalQuantity, // ✅ Fixed quantity (sum of all items)
          o.items.length,
          new Date(o.createdAt).toLocaleDateString(),
          `"${address}"`
        ].join(',');
      })
    ].join('\n');

    return csvContent;
  };


  const handleExport = () => {
    const exportData = getFilteredExportData();
    if (exportData.length === 0) {
      alert('No data to export with the selected filters.');
      return;
    }

    let content = '';
    let filename = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    let mimeType = 'text/csv';

    content = exportToCSV(exportData);

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const getExportPreview = () => {
    const data = getFilteredExportData();
    return {
      count: data.length,
      totalValue: data.reduce((sum, order) => sum + (order.status !== 'cancelled' ? order.totalAmount : 0), 0),
    };
  };

  const StatusIcon = ({ status }: { status: keyof typeof statusIcons }) => {
    const Icon = statusIcons[status] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600">Manage and track all customer orders</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders ? `₹${(stats?.totalOrders || 0).toLocaleString()}` : "₹0"}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <IndianRupee className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats?.totalRevenue}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-md">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.pendingOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-md">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.completedOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button
                  onClick={() => setShowExportModal(true)}
                  className="px-4 py-2 cursor-pointer flex items-center"
                >
                  <Download className="h-4 w-4 mr-2 text-white" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center p-8">Loading orders...</div>
            ) : error ? (
              <div className="text-center p-8 text-red-600 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 mr-2" /> Error: {error}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrders.length > 0 ? currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900" title={order._id}>ORD-{order._id.toUpperCase()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customerName || "N/A"}</div>
                          <div className="text-sm text-gray-500">{order.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          <StatusIcon status={order.status} />
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.items.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => openOrderModal(order)} className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></button>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value as Order['status'])}
                            className="text-xs border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            disabled={deleting === order._id}
                            className={`${deleting === order._id
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:text-red-900"
                              } transition-colors duration-200`}
                            title="Delete Order"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-500">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              {/* ... pagination UI ... */}
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Export Orders</h3>
                <button onClick={() => setShowExportModal(false)}><XCircle className="h-6 w-6 text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <select value={exportDateRange} onChange={(e) => setExportDateRange(e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                  <select value={exportStatus} onChange={(e) => setExportStatus(e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="bg-gray-50 p-4 rounded-md text-sm">
                  <h4 className="font-medium text-gray-800 mb-2">Export Preview</h4>
                  <p>Orders to export: <span className="font-bold">{getExportPreview().count}</span></p>
                  <p>Total value: <span className="font-bold">₹{getExportPreview().totalValue.toFixed(2)}</span></p>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <Button variant="ghost" onClick={() => setShowExportModal(false)}>Cancel</Button>
                  <Button onClick={handleExport} disabled={getExportPreview().count === 0}><Download className="h-4 w-4 mr-2" />Export</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Order Details</h3>
                <button onClick={() => setShowOrderModal(false)}><XCircle className="h-6 w-6 text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><p className="font-medium text-gray-500">Order ID</p><p>ORD-{selectedOrder._id.toUpperCase()}</p></div>
                  <div><p className="font-medium text-gray-500">Order Date</p><p>{new Date(selectedOrder.createdAt).toLocaleString()}</p></div>
                  <div><p className="font-medium text-gray-500">Customer</p><p>{selectedOrder.customerName}</p></div>
                  <div><p className="font-medium text-gray-500">Email</p><p>{selectedOrder.email}</p></div>
                  <div><p className="font-medium text-gray-500">Total Amount</p><p>₹{selectedOrder.totalAmount.toFixed(2)}</p></div>
                  <div>
                    <p className="font-medium text-gray-500">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedOrder.status]}`}>
                      <StatusIcon status={selectedOrder.status} /><span className="ml-1 capitalize">{selectedOrder.status}</span>
                    </span>
                  </div>
                </div>
                <div><p className="text-sm font-medium text-gray-500">Shipping Address</p><p className="text-sm">{`${selectedOrder.address.street}, ${selectedOrder.address.apartment || ''}\n${selectedOrder.address.city}, ${selectedOrder.address.state} ${selectedOrder.address.zipcode}`}</p></div>
                <div>
                  <h4 className="text-md font-medium mt-4 mb-2">Items</h4>
                  <ul className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <li key={index} className="py-2 flex justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Quantity:<span className="font-semibold">{item.quantity}</span> </p>
                        </div>
                        <p className="text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

