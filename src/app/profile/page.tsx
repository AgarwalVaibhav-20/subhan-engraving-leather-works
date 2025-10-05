"use client"
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/UserContext";
import { useOrder } from "@/context/OrderContext"; // Import useOrder
import {
    Settings,
    Heart,
    Star,
    Camera,
    Package,
    Phone,
    MapPin,
    Mail,
    Loader2,
    AlertCircle,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from "next/image";

export default function MetalLogoProfile() {
    const [productImages, setProductImages] = useState<Record<string, string>>({});
    const [loadingImages, setLoadingImages] = useState(false);
    const { user } = useAuth();
    const { orders, loading, error, refreshOrders } = useOrder(); // Use OrderContext
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState("/default-avatar.jpg");
    const [activeTab, setActiveTab] = useState("orders");
    const [uploading, setUploading] = useState(false);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        try {
            const res = await axios.post("/api/profile/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            await axios.patch("/api/profile", { profileImage: res.data.url });
            setPreview(res.data.url);
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`/api/profile`);
                if (res.data.user.profileImage) {
                    setPreview(res.data.user.profileImage);
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);
    //new useState
    useEffect(() => {
        const fetchProductImages = async () => {
            if (orders.length === 0) return;

            setLoadingImages(true);

            // Get all unique product IDs
            const productIds = orders.flatMap(order =>
                order.items.map(item => item.id.toString())
            );
            const uniqueIds = [...new Set(productIds)];

            // ⚠️ IMPORTANT: Add ALL your category folder names here
            const categories = ['MetalLogo', 'RubberLogo']; 

            try {
                const promises = uniqueIds.map(async (id) => {
                    // Try each category until we find the product
                    for (const category of categories) {
                        try {
                            const response = await axios.get(`/api/product/${category}/${id}`);

                            // Extract image from response
                            const product = response.data?.product || response.data;
                            const imageUrl = product?.images?.[0] || product?.image || '/placeholder-product.jpg';
                            console.log("image url" , imageUrl)

                            return { id, imageUrl };
                        } catch (err) {
                            // Product not in this category, try next
                            continue;
                        }
                    }
                    // If not found in any category, use placeholder
                    return { id, imageUrl: '/placeholder-product.jpg' };
                });

                const results = await Promise.all(promises);

                // Create image map
                const imageMap: Record<string, string> = {};
                results.forEach(({ id, imageUrl }) => {
                    imageMap[id] = imageUrl;
                });

                setProductImages(imageMap);
            } catch (err) {
                console.error('Failed to fetch product images:', err);
            } finally {
                setLoadingImages(false);
            }
        };

        fetchProductImages();
    }, [orders]);

    const userStats = {
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    };

    const userdata = {
        name: user?.fullname || "User",
        email: user?.email || "user@example.com",
        phone: user?.phone || "N/A",
        address: user?.addresses?.[0]?.street || "N/A",
        city: user?.addresses?.[0]?.city || "N/A",
        state: user?.addresses?.[0]?.state || "N/A",
        country: user?.addresses?.[0]?.country || "IN",
        zip: user?.addresses?.[0]?.zipcode || "N/A"
    };

    const getStatusColor = (status: string) => {
        const colors = {
            delivered: "bg-green-100 text-green-800 border-green-200",
            shipped: "bg-blue-100 text-blue-800 border-blue-200",
            processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
            pending: "bg-orange-100 text-orange-800 border-orange-200",
            cancelled: "bg-red-100 text-red-800 border-red-200",
        };
        return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving settings...");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Header */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Profile Image */}
                        <div className="relative">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg ring-4 ring-white">
                                <Image
                                    src={preview}
                                    alt="Profile picture"
                                    fill
                                    className="object-cover"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <button
                                    onClick={handleButtonClick}
                                    disabled={uploading}
                                    className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transform hover:scale-110 transition-all duration-200 disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <Loader2 size={16} className="text-gray-600 animate-spin" />
                                    ) : (
                                        <Camera size={16} className="text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                {userdata.name}
                            </h1>

                            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className="fill-yellow-400 text-yellow-400"
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">5.0 • {userStats.totalOrders} Orders</span>
                            </div>

                            <div className="flex flex-col items-center md:items-start mt-4 text-gray-600 text-sm gap-2">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-400" />
                                    <span>{userdata.address}, {userdata.city}, {userdata.state}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-gray-400" />
                                    <span>{userdata.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-gray-400" />
                                    <span>{userdata.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm border border-blue-200">
                                <div className="text-2xl font-bold text-blue-600">
                                    {userStats.totalOrders}
                                </div>
                                <div className="text-xs text-blue-700 font-medium">Total Orders</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-sm border border-green-200">
                                <div className="text-2xl font-bold text-green-600">
                                    ₹{userStats.totalSpent.toLocaleString()}
                                </div>
                                <div className="text-xs text-green-700 font-medium">Total Spent</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <nav className="flex space-x-2 bg-white rounded-xl p-2 shadow-md border border-gray-100">
                    {[
                        { id: "orders", label: "Orders", icon: Package },
                        { id: "wishlist", label: "Wishlist", icon: Heart },
                        { id: "settings", label: "Settings", icon: Settings },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 font-medium ${activeTab === id
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <Icon size={18} />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Orders Tab */}
            {activeTab === "orders" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                            <button
                                onClick={refreshOrders}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Package className="w-4 h-4" />
                                )}
                                <span className="text-sm font-medium">Refresh</span>
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center gap-2 py-12 text-red-600">
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Package size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="text-lg">No orders yet</p>
                                <p className="text-sm">Your order history will appear here</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow className="bg-gray-50 border-b-2 border-gray-200">
                                            <TableHead className="font-semibold text-gray-700">Order ID</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Items</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Date</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                            <TableHead className="font-semibold text-gray-700 text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map((order: any) => (
                                            <TableRow
                                                key={order._id}
                                                className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                                            >
                                                <TableCell className="font-mono text-sm text-gray-600">
                                                    ORD-{order._id.toUpperCase()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-start gap-3">
                                                        {/* Product Images */}
                                                        <div className="flex -space-x-2">
                                                            {order.items.slice(0, 3).map((item: any, idx: number) => {
                                                                const itemId = item.id?.toString() || item.id;
                                                                const imageUrl = productImages[itemId];

                                                                return (
                                                                    <div
                                                                        key={idx}
                                                                        className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-white shadow-sm bg-gray-100"
                                                                        title={item.name}
                                                                    >
                                                                        {loadingImages ? (
                                                                            <div className="w-full h-full flex items-center justify-center">
                                                                                <Loader2 size={14} className="text-gray-400 animate-spin" />
                                                                            </div>
                                                                        ) : imageUrl && imageUrl !== '/placeholder-product.jpg' ? (
                                                                            <Image
                                                                                src={imageUrl}
                                                                                alt={item.name}
                                                                                fill
                                                                                className="object-cover"
                                                                                unoptimized
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center">
                                                                                <Package size={16} className="text-gray-400" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                            {order.items.length > 3 && (
                                                                <div className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center">
                                                                    <span className="text-xs font-medium text-gray-600">
                                                                        +{order.items.length - 3}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="flex flex-col gap-1">
                                                            {order.items.slice(0, 2).map((item: any, idx: number) => (
                                                                <span key={idx} className="text-sm text-gray-700">
                                                                    {item.name} x{item.quantity}
                                                                </span>
                                                            ))}
                                                            {order.items.length > 2 && (
                                                                <span className="text-xs text-gray-500">
                                                                    +{order.items.length - 2} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {formatDate(order.createdAt)}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                            order.status
                                                        )}`}
                                                    >
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-bold text-right text-gray-900">
                                                    ₹{order.totalAmount.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Account Settings</h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fullname">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullname"
                                        defaultValue={userdata.name}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        defaultValue={userdata.email}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        defaultValue={userdata.phone}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        defaultValue={userdata.address}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="city">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        defaultValue={userdata.city}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="state">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        id="state"
                                        defaultValue={userdata.state}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="country">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        id="country"
                                        defaultValue={userdata.country}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="zip">
                                        ZIP Code
                                    </label>
                                    <input
                                        type="text"
                                        id="zip"
                                        defaultValue={userdata.zip}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveSettings}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Wishlist</h2>
                        <div className="text-center py-12 text-gray-500">
                            <Heart size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-lg">Your wishlist is empty</p>
                            <p className="text-sm">Save items you love for later</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}