"use client"
import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Plus,
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  IndianRupee ,
  ShoppingCart,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-2024-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    status: 'delivered',
    total: 149.97,
    items: 3,
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-18',
    paymentMethod: 'Credit Card',
    shippingAddress: '123 Main St, New York, NY 10001',
    trackingNumber: 'TRK123456789'
  },
  {
    id: 'ORD-2024-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    status: 'shipped',
    total: 88.96,
    items: 2,
    orderDate: '2024-01-20',
    estimatedDelivery: '2024-01-25',
    paymentMethod: 'PayPal',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
    trackingNumber: 'TRK987654321'
  },
  {
    id: 'ORD-2024-003',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    status: 'processing',
    total: 299.99,
    items: 1,
    orderDate: '2024-01-22',
    estimatedDelivery: '2024-01-28',
    paymentMethod: 'Credit Card',
    shippingAddress: '789 Pine St, Chicago, IL 60601',
    trackingNumber: null
  },
  {
    id: 'ORD-2024-004',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah@example.com',
    status: 'cancelled',
    total: 75.50,
    items: 2,
    orderDate: '2024-01-18',
    paymentMethod: 'Credit Card',
    shippingAddress: '321 Elm St, Houston, TX 77001',
    trackingNumber: null
  },
  {
    id: 'ORD-2024-005',
    customerName: 'David Brown',
    customerEmail: 'david@example.com',
    status: 'pending',
    total: 199.99,
    items: 4,
    orderDate: '2024-01-25',
    paymentMethod: 'Bank Transfer',
    shippingAddress: '654 Maple Ave, Phoenix, AZ 85001',
    trackingNumber: null
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle
};

export default function AdminOrderDashboard() {
  const [orders, setOrders] = useState(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportDateRange, setExportDateRange] = useState('all');
  const [exportStatus, setExportStatus] = useState('all');

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, orders]);

  // Get dashboard statistics
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.status !== 'cancelled' ? order.total : 0), 0),
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    deliveredOrders: orders.filter(order => order.status === 'delivered').length
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Export functionality
  const getFilteredExportData = () => {
    let exportData = [...orders];

    // Filter by status if not 'all'
    if (exportStatus !== 'all') {
      exportData = exportData.filter(order => order.status === exportStatus);
    }

    // Filter by date range
    if (exportDateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (exportDateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          exportData = exportData.filter(order => 
            new Date(order.orderDate) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          exportData = exportData.filter(order => 
            new Date(order.orderDate) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          exportData = exportData.filter(order => 
            new Date(order.orderDate) >= filterDate
          );
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          exportData = exportData.filter(order => 
            new Date(order.orderDate) >= filterDate
          );
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          exportData = exportData.filter(order => 
            new Date(order.orderDate) >= filterDate
          );
          break;
      }
    }

    return exportData;
  };

  const exportToCSV = (data) => {
    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Status',
      'Total Amount',
      'Items Count',
      'Order Date',
      'Delivery Date',
      'Payment Method',
      'Shipping Address',
      'Tracking Number'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(order => [
        order.id,
        `"${order.customerName}"`,
        order.customerEmail,
        order.status,
        order.total,
        order.items,
        order.orderDate,
        order.deliveryDate || order.estimatedDelivery || '',
        `"${order.paymentMethod}"`,
        `"${order.shippingAddress}"`,
        order.trackingNumber || ''
      ].join(','))
    ].join('\n');

    return csvContent;
  };

  const exportToJSON = (data) => {
    return JSON.stringify(data, null, 2);
  };

  const exportToXML = (data) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<orders>\n';
    
    data.forEach(order => {
      xml += `  <order>\n`;
      xml += `    <id>${order.id}</id>\n`;
      xml += `    <customerName>${order.customerName}</customerName>\n`;
      xml += `    <customerEmail>${order.customerEmail}</customerEmail>\n`;
      xml += `    <status>${order.status}</status>\n`;
      xml += `    <total>${order.total}</total>\n`;
      xml += `    <items>${order.items}</items>\n`;
      xml += `    <orderDate>${order.orderDate}</orderDate>\n`;
      xml += `    <deliveryDate>${order.deliveryDate || order.estimatedDelivery || ''}</deliveryDate>\n`;
      xml += `    <paymentMethod>${order.paymentMethod}</paymentMethod>\n`;
      xml += `    <shippingAddress>${order.shippingAddress}</shippingAddress>\n`;
      xml += `    <trackingNumber>${order.trackingNumber || ''}</trackingNumber>\n`;
      xml += `  </order>\n`;
    });
    
    xml += '</orders>';
    return xml;
  };

  const handleExport = () => {
    const exportData = getFilteredExportData();
    
    if (exportData.length === 0) {
      alert('No data to export with the selected filters.');
      return;
    }

    let content = '';
    let filename = '';
    let mimeType = '';

    const dateStr = new Date().toISOString().split('T')[0];
    const statusStr = exportStatus === 'all' ? 'all' : exportStatus;
    const rangeStr = exportDateRange === 'all' ? 'all' : exportDateRange;

    switch (exportFormat) {
      case 'csv':
        content = exportToCSV(exportData);
        filename = `orders_${statusStr}_${rangeStr}_${dateStr}.csv`;
        mimeType = 'text/csv';
        break;
      case 'json':
        content = exportToJSON(exportData);
        filename = `orders_${statusStr}_${rangeStr}_${dateStr}.json`;
        mimeType = 'application/json';
        break;
      case 'xml':
        content = exportToXML(exportData);
        filename = `orders_${statusStr}_${rangeStr}_${dateStr}.xml`;
        mimeType = 'application/xml';
        break;
    }

    // Create and download file
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
      totalValue: data.reduce((sum, order) => sum + (order.status !== 'cancelled' ? order.total : 0), 0),
      statusBreakdown: data.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {})
    };
  };

  const StatusIcon = ({ status }) => {
    const Icon = statusIcons[status];
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
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <IndianRupee  className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toFixed(2)}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-md">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.deliveredOrders}</p>
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
                    placeholder="Search orders, customers..."
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
                  className="px-3 py-2 border border-gray-300 rounded-md  "
                > z
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
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
          <div className="overflow-x-auto max-sm:overflow-x-scroll">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        <StatusIcon status={order.status} />
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹ {order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.items}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openOrderModal(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-xs border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastItem, filteredOrders.length)}</span> of{' '}
                    <span className="font-medium">{filteredOrders.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-2xl">
          <div className="bg-white  rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Export Orders</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-500 cursor-pointer"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Export Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="csv">CSV (Comma Separated Values)</option>
                    <option value="json">JSON (JavaScript Object Notation)</option>
                    <option value="xml">XML (Extensible Markup Language)</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select
                    value={exportDateRange}
                    onChange={(e) => setExportDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="quarter">Last 3 Months</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status
                  </label>
                  <select
                    value={exportStatus}
                    onChange={(e) => setExportStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending Only</option>
                    <option value="processing">Processing Only</option>
                    <option value="shipped">Shipped Only</option>
                    <option value="delivered">Delivered Only</option>
                    <option value="cancelled">Cancelled Only</option>
                  </select>
                </div>

                {/* Export Preview */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Export Preview</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Orders to export:</span> {getExportPreview().count}</p>
                    <p><span className="font-medium">Total value:</span> ${getExportPreview().totalValue.toFixed(2)}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(getExportPreview().statusBreakdown).map(([status, count]) => (
                        <span
                          key={status}
                          className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}
                        >
                          {status}: {count}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Export Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={getExportPreview().count === 0}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export {getExportPreview().count} Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Order ID</p>
                    <p className="text-sm text-gray-900">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedOrder.status]}`}>
                      <StatusIcon status={selectedOrder.status} />
                      <span className="ml-1 capitalize">{selectedOrder.status}</span>
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Customer</p>
                    <p className="text-sm text-gray-900">{selectedOrder.customerName}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-sm text-gray-900">₹{selectedOrder.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Order Date</p>
                    <p className="text-sm text-gray-900">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Payment Method</p>
                    <p className="text-sm text-gray-900">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Shipping Address</p>
                  <p className="text-sm text-gray-900">{selectedOrder.shippingAddress}</p>
                </div>
                
                {selectedOrder.trackingNumber && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tracking Number</p>
                    <p className="text-sm text-gray-900 font-mono">{selectedOrder.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}