"use client";

// import Link from 'next/link';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { Search, Users, Plus, Filter, Download, Eye, Trash2, Edit, MoreVertical } from 'lucide-react';

// interface Customer {
//   customerID: string;
//   fullname: string;
//   email: string;
//   phone?: string;
//   status?: 'active' | 'inactive' | 'suspended';
//   joinDate?: string;
//   lastLogin?: string;
//   totalOrders?: number;
//   totalSpent?: number;
// }

// export default function CustomersTablePage() {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [sortBy, setSortBy] = useState<'name' | 'email' | 'joinDate' | 'totalSpent'>('name');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('/api/customers');
//         setCustomers(response.data);
//       } catch (error) {
//         console.error("Failed to fetch customers", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Filter and sort customers
//   const filteredCustomers = customers
//     .filter(customer => {
//       const matchesSearch = 
//         customer.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         customer.customerID.toLowerCase().includes(searchTerm.toLowerCase());
      
//       const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      
//       return matchesSearch && matchesStatus;
//     })
//     .sort((a, b) => {
//       let aValue: any, bValue: any;
      
//       switch (sortBy) {
//         case 'name':
//           aValue = a.fullname.toLowerCase();
//           bValue = b.fullname.toLowerCase();
//           break;
//         case 'email':
//           aValue = a.email.toLowerCase();
//           bValue = b.email.toLowerCase();
//           break;
//         case 'joinDate':
//           aValue = new Date(a.joinDate || '');
//           bValue = new Date(b.joinDate || '');
//           break;
//         case 'totalSpent':
//           aValue = a.totalSpent || 0;
//           bValue = b.totalSpent || 0;
//           break;
//         default:
//           return 0;
//       }
      
//       if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
//       if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
//       return 0;
//     });

//   const handleSort = (field: typeof sortBy) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortBy(field);
//       setSortOrder('asc');
//     }
//   };

//   const handleDeleteCustomer = async (customerID: string) => {
//     if (confirm('Are you sure you want to delete this customer?')) {
//       try {
//         await axios.delete(`/api/customers/${customerID}`);
//         setCustomers(customers.filter(c => c.customerID !== customerID));
//       } catch (error) {
//         console.error("Failed to delete customer", error);
//       }
//     }
//   };

//   const exportCustomers = () => {
//     const csv = [
//       ['ID', 'Name', 'Email', 'Status', 'Join Date', 'Total Orders', 'Total Spent'],
//       ...filteredCustomers.map(customer => [
//         customer.customerID,
//         customer.fullname,
//         customer.email,
//         customer.status || 'active',
//         customer.joinDate || '',
//         customer.totalOrders || 0,
//         customer.totalSpent || 0
//       ])
//     ].map(row => row.join(',')).join('\n');
    
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'customers.csv';
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const getStatusBadge = (status: string = 'active') => {
//     const statusColors = {
//       active: 'bg-green-100 text-green-800',
//       inactive: 'bg-gray-100 text-gray-800',
//       suspended: 'bg-red-100 text-red-800'
//     };
    
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || statusColors.active}`}>
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <main className="p-6">
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           <span className="ml-2 text-gray-600">Loading customers...</span>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
//               <Users className="h-8 w-8 text-blue-600" />
//               Customers
//             </h1>
//             <p className="text-gray-600 mt-1">Manage and view customer information</p>
//           </div>
//           <Link
//             href="/admin/customers/new"
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//           >
//             <Plus className="h-4 w-4" />
//             Add Customer
//           </Link>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white p-6 rounded-lg shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Customers</p>
//                 <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
//               </div>
//               <Users className="h-8 w-8 text-blue-600" />
//             </div>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Active Customers</p>
//                 <p className="text-2xl font-bold text-green-600">
//                   {customers.filter(c => c.status === 'active' || !c.status).length}
//                 </p>
//               </div>
//               <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
//                 <div className="h-3 w-3 bg-green-600 rounded-full"></div>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">New This Month</p>
//                 <p className="text-2xl font-bold text-blue-600">
//                   {customers.filter(c => {
//                     const joinDate = new Date(c.joinDate || '');
//                     const now = new Date();
//                     return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
//                   }).length}
//                 </p>
//               </div>
//               <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
//                 <Plus className="h-4 w-4 text-blue-600" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Revenue</p>
//                 <p className="text-2xl font-bold text-purple-600">
//                   ${customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toLocaleString()}
//                 </p>
//               </div>
//               <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
//                 <span className="text-purple-600 font-bold text-sm">$</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters and Search */}
//         <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
//           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//             <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
//               {/* Search */}
//               <div className="relative flex-1 max-w-md">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search customers..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>

//               {/* Status Filter */}
//               <div className="flex items-center gap-2">
//                 <Filter className="h-4 w-4 text-gray-500" />
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                   <option value="suspended">Suspended</option>
//                 </select>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex gap-2">
//               <button
//                 onClick={exportCustomers}
//                 className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//               >
//                 <Download className="h-4 w-4" />
//                 Export
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th 
//                   onClick={() => handleSort('name')}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="flex items-center gap-1">
//                     Customer
//                     {sortBy === 'name' && (
//                       <span className="text-blue-600">
//                         {sortOrder === 'asc' ? '↑' : '↓'}
//                       </span>
//                     )}
//                   </div>
//                 </th>
//                 <th 
//                   onClick={() => handleSort('email')}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="flex items-center gap-1">
//                     Email
//                     {sortBy === 'email' && (
//                       <span className="text-blue-600">
//                         {sortOrder === 'asc' ? '↑' : '↓'}
//                       </span>
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th 
//                   onClick={() => handleSort('joinDate')}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="flex items-center gap-1">
//                     Join Date
//                     {sortBy === 'joinDate' && (
//                       <span className="text-blue-600">
//                         {sortOrder === 'asc' ? '↑' : '↓'}
//                       </span>
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Orders
//                 </th>
//                 <th 
//                   onClick={() => handleSort('totalSpent')}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="flex items-center gap-1">
//                     Total Spent
//                     {sortBy === 'totalSpent' && (
//                       <span className="text-blue-600">
//                         {sortOrder === 'asc' ? '↑' : '↓'}
//                       </span>
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredCustomers.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="px-6 py-12 text-center">
//                     <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
//                     <p className="text-gray-500">
//                       {searchTerm || statusFilter !== 'all' 
//                         ? 'Try adjusting your search or filters'
//                         : 'Get started by adding your first customer'
//                       }
//                     </p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredCustomers.map((customer, index) => (
//                   <tr key={customer.customerID || index} className="hover:bg-gray-50 transition-colors">
//                     {/* Customer Info */}
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
//                           {customer.fullname.charAt(0).toUpperCase()}
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {customer.fullname}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             ID: {customer.customerID}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Email */}
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{customer.email}</div>
//                       {customer.phone && (
//                         <div className="text-sm text-gray-500">{customer.phone}</div>
//                       )}
//                     </td>

//                     {/* Status */}
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {getStatusBadge(customer.status)}
//                     </td>

//                     {/* Join Date */}
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {customer.joinDate 
//                         ? new Date(customer.joinDate).toLocaleDateString()
//                         : 'N/A'
//                       }
//                     </td>

//                     {/* Orders */}
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {customer.totalOrders || 0}
//                     </td>

//                     {/* Total Spent */}
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       ${(customer.totalSpent || 0).toLocaleString()}
//                     </td>

//                     {/* Actions */}
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex items-center gap-2">
//                         <Link
//                           href={`/admin/customers/${customer.customerID}`}
//                           className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded"
//                           title="View Profile"
//                         >
//                           <Eye className="h-4 w-4" />
//                         </Link>
//                         <Link
//                           href={`/admin/customers/${customer.customerID}/edit`}
//                           className="text-gray-600 hover:text-gray-900 transition-colors p-1 rounded"
//                           title="Edit Customer"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </Link>
//                         <button
//                           onClick={() => handleDeleteCustomer(customer.customerID)}
//                           className="text-red-600 hover:text-red-900 transition-colors p-1 rounded"
//                           title="Delete Customer"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                         <div className="relative group">
//                           <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded">
//                             <MoreVertical className="h-4 w-4" />
//                           </button>
//                           <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border py-1 z-10 hidden group-hover:block">
//                             <Link
//                               href={`/admin/customers/${customer.customerID}/orders`}
//                               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                             >
//                               View Orders
//                             </Link>
//                             <Link
//                               href={`/admin/customers/${customer.customerID}/activity`}
//                               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                             >
//                               Activity Log
//                             </Link>
//                             <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                               Send Email
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {filteredCustomers.length > 0 && (
//           <div className="bg-white px-6 py-3 border-t border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-gray-700">
//                 Showing <span className="font-medium">{filteredCustomers.length}</span> of{' '}
//                 <span className="font-medium">{customers.length}</span> customers
//               </div>
//               <div className="flex gap-2">
//                 <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
//                   Previous
//                 </button>
//                 <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
//                   1
//                 </button>
//                 <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
import { useEffect, useState } from 'react';
import { Search, Filter, Download, Plus, Eye, Edit2, Trash2, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign } from 'lucide-react';
import axios from 'axios';
interface Customer {
  customerID: string;
  fullname: string;
  email: string;
  profileImage:string;
  phone?: string;
  status?: 'active' | 'inactive' | 'suspended';
  joinDate?: string;
  lastLogin?: string;
  totalOrders?: number;
  totalSpent?: number;
}

export default function CustomersTablePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case 'name':
        aValue = a.fullname.toLowerCase();
        bValue = b.fullname.toLowerCase();
        break;
      case 'orders':
        aValue = a.totalOrders;
        bValue = b.totalOrders;
        break;
      case 'spent':
        aValue = a.totalSpent;
        bValue = b.totalSpent;
        break;
      case 'date':
        aValue = new Date(a.joinDate);
        bValue = new Date(b.joinDate);
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

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    if (status === 'Active') {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
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

  return (
    <main className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-1">Manage your customer database</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={20} />
            Add Customer
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingBag className="text-blue-600" size={20} />
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
                <DollarSign className="text-green-600" size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-semibold">{formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}</p>
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
                <ShoppingBag className="text-orange-600" size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-xl font-semibold">{formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0) || 0)}</p>
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
              {sortedCustomers.map((customer) => (
                <tr key={customer.customerID} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                          {customer.profileImage}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.fullname}</div>
                        <div className="text-sm text-gray-500">ID: {customer.customerID.slice(0,20)}</div>
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
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors"
                        title="Edit Customer"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete Customer"
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
        {sortedCustomers.length === 0 && (
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

        {/* Pagination (mock) */}
        {sortedCustomers.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedCustomers.length}</span> of{' '}
                  <span className="font-medium">{sortedCustomers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-600 text-sm font-medium text-white">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}