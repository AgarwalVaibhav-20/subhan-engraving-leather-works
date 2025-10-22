'use client';
import { useEffect, useState } from 'react';
import { Eye, Edit2, Trash2, Plus, X, Search, Filter, Download } from 'lucide-react';
import { useTransaction } from "@/context/TransactionContext";
import { useAuth } from '@/context/UserContext';
export default function TransactionPage() {
    const { user } = useAuth();
    const { transactions, loading, error, addTransaction, fetchTransactions, deleteTransaction, updateTransaction } = useTransaction();
    // if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<any>(null);
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        amount: '',
        status: 'pending',
        paymentMethod: 'Cash',
        address: '',
        items: 1
    });
    const formatDate = (isoDate: string) => {
        return new Date(isoDate).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const token = localStorage.getItem('authToken');
    useEffect(() => {
        if (user && token) {
            console.log("User and token available, fetching transactions...");
            fetchTransactions();
        }
    }, [user, token]);

    const statusColors = {
        completed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        failed: 'bg-red-100 text-red-800'
    };

    const filteredTransactions = transactions.filter((t: any) => {
        const matchesSearch =
            t.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t._id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    console.log('Filtered Transactions:', filteredTransactions);

    // 🧾 View details
    const handleView = (transaction: any) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    // ✏️ Edit transaction
    const handleEdit = (transaction: any) => {
        setEditingTransaction(transaction);
        setFormData({
            customerName: transaction.customerName,
            email: transaction.email,
            amount: transaction.amount,
            status: transaction.status,
            paymentMethod: transaction.paymentMethod,
            address: transaction.address,
            items: transaction.items
        });
        setIsFormOpen(true);
    };

    // ❌ Delete transaction (from context)
    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            await deleteTransaction(id);
        }
    };

    // ✅ Add or Update transaction
    const handleSubmit = async () => {
        if (!formData.customerName || !formData.email || !formData.amount) {
            alert('Please fill in all required fields');
            return;
        }

        if(editingTransaction) {
            const updatedTransaction = {
                ...formData,
                amount: parseFloat(formData.amount),
                items: formData.items,
                date: editingTransaction.date, // keep original date if needed
            };
            await updateTransaction(editingTransaction._id, updatedTransaction);
        } else {
            const newTransaction = {
                ...formData,
                amount: parseFloat(formData.amount),
                date: new Date().toISOString(),
                type: "credit",
                description: "Manual Entry"
            };
            await addTransaction(newTransaction);
        }


        resetForm();
    };

    // Reset modal & form
    const resetForm = () => {
        setFormData({
            customerName: '',
            email: '',
            amount: '',
            status: 'pending',
            paymentMethod: 'Cash',
            address: '',
            items: 1
        });
        setEditingTransaction(null);
        setIsFormOpen(false);
    };

    const totalAmount = filteredTransactions.reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);

    if (loading) return <div role="status" className='flex justify-center items-center h-screen'>
        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
    </div>;

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Transaction Management</h1>
                            <p className="text-gray-600">View and manage all your e-commerce transactions</p>
                        </div>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Plus size={20} />
                            Add Transaction
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                            <p className="text-blue-600 text-sm font-medium">Total Transactions</p>
                            <p className="text-3xl font-bold text-blue-900">{filteredTransactions.length}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                            <p className="text-green-600 text-sm font-medium">Completed</p>
                            <p className="text-3xl font-bold text-green-900">
                                {transactions.filter(t => t.status === 'completed').length}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl">
                            <p className="text-yellow-600 text-sm font-medium">Pending</p>
                            <p className="text-3xl font-bold text-yellow-900">
                                {transactions.filter(t => t.status === 'pending').length}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                            <p className="text-purple-600 text-sm font-medium">Total Revenue</p>
                            <p className="text-3xl font-bold text-purple-900">₹{totalAmount.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by customer name, email, or transaction ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-gray-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                            <Download size={20} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Transaction ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Items</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTransactions.map((transaction) => (
                                    <tr key={transaction._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-medium text-gray-900">TRAN-{transaction._id.toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{transaction.customerName}</p>
                                                <p className="text-sm text-gray-500">{transaction.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{formatDate(transaction.date)}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-900">₹{transaction.amount.toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{transaction.items}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[transaction.status]}`}>
                                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleView(transaction)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(transaction)}
                                                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(transaction._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredTransactions.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No transactions found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* View Details Modal */}
            {isModalOpen && selectedTransaction && (
                <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center rounded-t-2xl">
                            <h2 className="text-2xl font-bold">Transaction Details</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-blue-400 hover:bg-opacity-20 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                                    <p className="font-mono font-semibold text-gray-900">TRAN-{selectedTransaction._id.toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Date</p>
                                    <p className="font-medium text-gray-900">{selectedTransaction.date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Customer Name</p>
                                    <p className="font-medium text-gray-900">{selectedTransaction.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Email</p>
                                    <p className="font-medium text-gray-900">{selectedTransaction.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                                    <p className="font-medium text-gray-900">{selectedTransaction.paymentMethod}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedTransaction.status]}`}>
                                        {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
                                <p className="font-medium text-gray-900">{selectedTransaction.address}</p>
                            </div>

                            {selectedTransaction.products && selectedTransaction.products.length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-3">Products</p>
                                    <div className="space-y-2">
                                        {selectedTransaction.products.map((product, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900">{product.name}</p>
                                                    <p className="text-sm text-gray-500">Quantity: {product.qty}</p>
                                                </div>
                                                <p className="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-semibold text-gray-900">Total Amount</p>
                                    <p className="text-2xl font-bold text-blue-600">₹{selectedTransaction.amount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 backdrop-blur-md bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center rounded-t-2xl">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="p-2 hover:bg-blue-600 hover:bg-opacity-20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                                aria-label="Close modal"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <div className="p-6 space-y-6">
                            <div>
                                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Customer Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="customerName"
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-50 placeholder-gray-400"
                                    placeholder="Enter customer name"
                                    required
                                    aria-required="true"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-50 placeholder-gray-400"
                                    placeholder="Enter email address"
                                    required
                                    aria-required="true"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Amount ($) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-50 placeholder-gray-400"
                                        placeholder="0.00"
                                        required
                                        aria-required="true"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="items" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Items
                                    </label>
                                    <input
                                        id="items"
                                        type="number"
                                        value={formData.items}
                                        onChange={(e) => setFormData({ ...formData, items: parseInt(e.target.value) || 1 })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-50 placeholder-gray-400"
                                        placeholder="1"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-50"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Payment Method
                                    </label>
                                    <select
                                        id="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-50"
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="Online">Online</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Shipping Address
                                </label>
                                <textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-50 placeholder-gray-400 resize-none"
                                    placeholder="Enter shipping address"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    aria-label={editingTransaction ? 'Update Transaction' : 'Create Transaction'}
                                >
                                    {editingTransaction ? 'Update Transaction' : 'Create Transaction'}
                                </button>
                                <button
                                    onClick={resetForm}
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    aria-label="Cancel"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}