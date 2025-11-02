"use client"
import React, { useState } from 'react';
import { User, MapPin, Heart, Package, Edit, Camera, Trash2, Eye, X, Plus, Save, ShoppingCart, Check } from 'lucide-react';

const CustomerProfile = () => {
  // Sample customer data - in real app, this would come from your API/database
  const [customer, setCustomer] = useState({
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinDate: "January 2023"
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      isDefault: true
    },
    {
      id: 2,
      type: "Office",
      street: "456 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      country: "USA",
      isDefault: false
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      date: "2024-07-20",
      status: "Delivered",
      total: 299.99,
      items: 3,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop",
      products: [
        { name: "Wireless Headphones", quantity: 1, price: 199.99 },
        { name: "Phone Case", quantity: 2, price: 50.00 }
      ]
    },
    {
      id: "ORD-002",
      date: "2024-07-15",
      status: "Shipped",
      total: 159.99,
      items: 2,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop",
      products: [
        { name: "Running Shoes", quantity: 1, price: 129.99 },
        { name: "Socks", quantity: 1, price: 30.00 }
      ]
    },
    {
      id: "ORD-003",
      date: "2024-07-10",
      status: "Processing",
      total: 89.99,
      items: 1,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop",
      products: [
        { name: "T-Shirt", quantity: 1, price: 89.99 }
      ]
    }
  ]);

  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
      inStock: true
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
      inStock: true
    },
    {
      id: 3,
      name: "Laptop Bag",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
      inStock: false
    },
    {
      id: 4,
      name: "Bluetooth Speaker",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop",
      inStock: true
    }
  ]);

  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...customer });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Address form state
  const [addressForm, setAddressForm] = useState({
    type: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    isDefault: false
  });

  // Notification system
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Profile editing functions
  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditedProfile({ ...customer });
  };

  const handleSaveProfile = () => {
    setCustomer({ ...editedProfile });
    setIsEditingProfile(false);
    addNotification('Profile updated successfully');
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditedProfile({ ...customer });
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newProfile = { ...customer, profileImage: e.target.result };
        setCustomer(newProfile);
        addNotification('Profile image updated');
      };
      reader.readAsDataURL(file);
    }
  };

  // Address management functions
  const handleAddAddress = () => {
    if (addressForm.type && addressForm.street && addressForm.city) {
      const newAddress = {
        id: Date.now(),
        ...addressForm
      };

      let updatedAddresses = [...addresses, newAddress];

      // If this is set as default, remove default from others
      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map(addr =>
          addr.id === newAddress.id ? addr : { ...addr, isDefault: false }
        );
      }

      setAddresses(updatedAddresses);
      setAddressForm({
        type: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        isDefault: false
      });
      setShowAddAddress(false);
      addNotification('Address added successfully');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address.id);
    setAddressForm({ ...address });
  };

  const handleUpdateAddress = () => {
    let updatedAddresses = addresses.map(addr =>
      addr.id === editingAddress ? { ...addressForm } : addr
    );

    // If this is set as default, remove default from others
    if (addressForm.isDefault) {
      updatedAddresses = updatedAddresses.map(addr =>
        addr.id === editingAddress ? addr : { ...addr, isDefault: false }
      );
    }

    setAddresses(updatedAddresses);
    setEditingAddress(null);
    setAddressForm({
      type: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      isDefault: false
    });
    addNotification('Address updated successfully');
  };

  const handleDeleteAddress = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== addressId));
      addNotification('Address deleted successfully');
    }
  };

  const setDefaultAddress = (addressId) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    setAddresses(updatedAddresses);
    addNotification('Default address updated');
  };

  // Wishlist functions
  const removeFromWishlist = (itemId) => {
    setWishlist(wishlist.filter(item => item.id !== itemId));
    addNotification('Item removed from wishlist');
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    addNotification(`${item.name} added to cart`);
  };

  const moveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  // Order functions
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'shipped': return 'text-blue-600 bg-blue-50';
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-2 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
          >
            <div className="flex items-center space-x-2">
              <Check size={16} />
              <span>{notification.message}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={customer.profileImage}
                alt={customer.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                <Camera size={14} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Customer Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditingProfile ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 bg-transparent outline-none"
                    />
                    <div className="flex gap-2">
                      <button onClick={handleSaveProfile} className="text-green-600 hover:text-green-700">
                        <Save size={18} />
                      </button>
                      <button onClick={handleCancelEdit} className="text-red-600 hover:text-red-700">
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="block w-full text-gray-600 border-b border-gray-300 bg-transparent outline-none focus:border-blue-500"
                  />
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="block w-full text-gray-600 border-b border-gray-300 bg-transparent outline-none focus:border-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                    <button
                      onClick={handleEditProfile}
                      className="text-blue-600 hover:text-blue-700 w-fit mx-auto md:mx-0"
                    >
                      <Edit size={18} />
                    </button>
                  </div>

                  <p className="text-gray-600 mb-1">{customer.email}</p>
                  <p className="text-gray-600 mb-2">{customer.phone}</p>
                  <p className="text-sm text-gray-500">Member since {customer.joinDate}</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xl font-bold text-blue-600">{orders.length}</div>
                <div className="text-xs text-gray-600">Orders</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-xl font-bold text-purple-600">{wishlist.length}</div>
                <div className="text-xs text-gray-600">Wishlist</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xl font-bold text-green-600">{cart.length}</div>
                <div className="text-xs text-gray-600">Cart Items</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'orders', label: 'Orders', icon: Package },
                { id: 'addresses', label: 'Addresses', icon: MapPin },
                { id: 'wishlist', label: 'Wishlist', icon: Heart }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
                  <span className="text-sm text-gray-500">{orders.length} orders</span>
                </div>
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={order.image}
                          alt="Order"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">{order.date} • {order.items} items</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="font-semibold text-gray-900">${order.total}</span>
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Saved Addresses</h2>
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Address</span>
                  </button>
                </div>

                {/* Add/Edit Address Form */}
                {(showAddAddress || editingAddress) && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-4">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Address Type (Home, Office, etc.)"
                        value={addressForm.type}
                        onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={addressForm.zipCode}
                        onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={addressForm.country}
                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor="isDefault" className="text-sm text-gray-600">
                        Set as default address
                      </label>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingAddress ? 'Update' : 'Add'} Address
                      </button>
                      <button
                        onClick={() => {
                          setShowAddAddress(false);
                          setEditingAddress(null);
                          setAddressForm({
                            type: '',
                            street: '',
                            city: '',
                            state: '',
                            zipCode: '',
                            country: 'USA',
                            isDefault: false
                          });
                        }}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {addresses.map((address) => (
                  <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{address.type}</h3>
                          {address.isDefault && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">
                          {address.street}<br />
                          {address.city}, {address.state} {address.zipCode}<br />
                          {address.country}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        {!address.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(address.id)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">My Wishlist</h2>
                  <span className="text-sm text-gray-500">{wishlist.length} items</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {wishlist.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 group hover:shadow-sm transition-shadow">
                      <div className="relative mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-2 right-2 bg-white text-red-600 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                        >
                          <Heart size={14} fill="currentColor" />
                        </button>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-lg font-semibold text-gray-900 mb-2">${item.price}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => moveToCart(item)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${item.inStock
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          disabled={!item.inStock}
                        >
                          <ShoppingCart size={14} />
                          <span>{item.inStock ? 'Move to Cart' : 'Out of Stock'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Order Details</h3>
              <button onClick={closeOrderDetails} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Order #{selectedOrder.id}</p>
                <p className="text-sm text-gray-500">Date: {selectedOrder.date}</p>
                <p className="text-sm">
                  Status: <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Items:</h4>
                {selectedOrder.products.map((product, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">${product.price}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <p className="font-semibold">Total:</p>
                <p className="font-semibold">${selectedOrder.total}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;