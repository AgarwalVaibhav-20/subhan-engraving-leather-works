"use client"
import React, { useState, useRef } from "react";
import { useEffect} from "react";
import axios from "axios";
import { useAuth } from "@/context/UserContext";
import {
    User,
    Settings,
    Heart,
    Star,
    Edit3,
    Camera,
    Package,
    Phone,
    MapPin,
    Mail,
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
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState("")
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post("/api/profile/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Save URL in MongoDB
    await axios.patch("/api/profile", { profileImage: res.data.url });

    setPreview(res.data.url); // update preview immediately
  } catch (err) {
    console.error("Upload failed:", err);
  }
};

    const [activeTab, setActiveTab] = useState("orders");
    // const [isEditing, setIsEditing] = useState(false);

    const userStats = {
        totalOrders: 24,
        totalSpent: 2890,
        wishlistItems: 12,
        loyaltyPoints: 1450,
    };

    const recentOrders = [
        { id: "001", name: "Chrome Eagle Logo", price: 149, status: "Delivered", image: "🦅" },
        { id: "002", name: "Steel Wolf Emblem", price: 199, status: "Processing", image: "🐺" },
        { id: "003", name: "Titanium Dragon Crest", price: 299, status: "Shipped", image: "🐉" },
        { id: "001", name: "Chrome Eagle Logo", price: 149, status: "Delivered", image: "🦅" },
        { id: "002", name: "Steel Wolf Emblem", price: 199, status: "Processing", image: "🐺" },
        { id: "003", name: "Titanium Dragon Crest", price: 299, status: "Shipped", image: "🐉" },
        { id: "001", name: "Chrome Eagle Logo", price: 149, status: "Delivered", image: "🦅" },
        { id: "002", name: "Steel Wolf Emblem", price: 199, status: "Processing", image: "🐺" },
        { id: "003", name: "Titanium Dragon Crest", price: 299, status: "Shipped", image: "🐉" },
        { id: "001", name: "Chrome Eagle Logo", price: 149, status: "Delivered", image: "🦅" },
        { id: "002", name: "Steel Wolf Emblem", price: 199, status: "Processing", image: "🐺" },
        { id: "003", name: "Titanium Dragon Crest", price: 299, status: "Shipped", image: "🐉" },
    ];

    const favoriteLogos = [
        { name: "Lightning Bolt", price: 89, image: "⚡" },
        { name: "Phoenix Rise", price: 179, image: "🔥" },
        { name: "Skull Crown", price: 159, image: "👑" },
        { name: "Celtic Knot", price: 129, image: "🔗" },
    ];
    const userdata = {
        name: "Alex ",
        email: "alex.johnson@example.com",
        phone: "+1 234 567 8901",
        address: "1234 Elm Street",
        city: "Springfield",
        country: "USA",
        zip: "62704"
    }
    // const handleSubmitImage = async (e) => {
    //     e.preventDefault();
    //     fileInputRef.current?.click();
    //     const res = await axios.patch(`/api/profile`, { profileImage: preview });
    //     setPreview(res.data.user.profileImage);
    // };
    useEffect(() => {
        const fetchData = async () => {
          const res = await axios.get(`/api/profile`);
          setPreview(res.data.user.profileImage);
          console.log("Fetched user data:", res.data.user.profileImage);
        };
        fetchData();
      }, [user]);
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="relative max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Profile Image */}
                    <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-inner flex items-center justify-center">
                        {/* Profile Image */}
                        <Image
                            src={preview}
                            alt="Profile picture"
                            fill
                            className="object-cover"
                        />

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {/* Camera Button */}
                        <button
                            onClick={handleSubmitImage}
                            className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg transform hover:scale-110 transition-all duration-200"
                        >
                            <Camera size={16} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 text-center md:text-left">
  {/* Name */}
  <div className="flex items-center gap-3 justify-center md:justify-start">
    <h1 className="text-4xl font-bold">Alex Johnson</h1>
  </div>

  {/* Rating */}
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
    <span>5.0 • 24 Reviews</span>
  </div>

  {/* Address & Phone */}
  <div className="flex flex-col items-center md:items-start mt-3 text-gray-600 text-sm gap-1">
    <div className="flex items-center gap-2">
      <MapPin size={16} className="text-gray-500" />
      <span>{userdata.address}, {userdata.city}, {userdata.country}</span>
    </div>
    <div className="flex items-center gap-2">
      <Phone size={16} className="text-gray-500" />
      <span>{userdata.phone}</span>
    </div>
    <div className="flex items-center gap-2 justify-center">
      <Mail size={16} className="text-gray-500" />
      <span>{userdata.email}</span>
    </div>
  </div>
</div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                        <div className="rounded-xl p-4 shadow-xl border">
                            <div className="text-2xl font-bold text-blue-400">
                                {userStats.totalOrders}
                            </div>
                            <div className="text-sm">Total Orders</div>
                        </div>
                        <div className="rounded-xl p-4 shadow-xl border">
                            <div className="text-2xl font-bold text-green-400">
                                ${userStats.totalSpent}
                            </div>
                            <div className="text-sm">Total Spent</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <nav className="flex space-x-1 rounded-xl p-1">
                    {[
                        { id: "orders", label: "Orders", icon: Package },
                        { id: "wishlist", label: "Wishlist", icon: Heart },
                        { id: "settings", label: "Settings", icon: Settings },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 ${activeTab === id ? "shadow-lg transform scale-105" : ""
                                }`}
                        >
                            <Icon size={18} />
                            <span className="font-medium">{label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Orders Tab */}
            {activeTab === "orders" && (
                <div className="max-w-7xl mx-auto px-6 pb-12">
                    <h2 className="text-2xl font-bold mb-6">Order History</h2>
                    <div className="overflow-x-auto">
                        <Table className="w-full  border rounded-2xl p-5 ">
                            <TableHeader>
                                <TableRow className="bg-gray-100">
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        className="hover:bg-gray-100 transition-colors "
                                    >
                                        <TableCell className="p-3">#{order.id}</TableCell>
                                        <TableCell>{order.name}</TableCell>
                                        <TableCell>Dec 15, 2024</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded-full text-sm ${order.status === "Delivered"
                                                    ? "bg-green-600 text-green-100"
                                                    : order.status === "Shipped"
                                                        ? "bg-blue-600 text-blue-100"
                                                        : "bg-orange-600 text-orange-100"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            ${order.price}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
            {activeTab === 'settings' && (
                <section>
                    <div className="max-w-7xl mx-auto px-6 pb-12">
                        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-md border">
                                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="fullname">Full Name</label>
                                        <input type="text" id="fullname" defaultValue={userdata.name} className="w-full border rounded-lg p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                                        <input type="email" id="email" defaultValue="alex.johnson@example.com" className="w-full border rounded-lg p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone Number</label>
                                        <input type="tel" id="phone" defaultValue="+1 234 567 8901" className="w-full border rounded-lg p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="address">Address</label>
                                        <input type="text" id="address" defaultValue="1234 Elm Street" className="w-full border rounded-lg p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="state">State</label>
                                        <input type="text" id="state" placeholder="State" className="w-full border rounded-lg p-2" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="country">Country</label>
                                        <input type="text" id="country" defaultValue="USA" className="w-full border rounded-lg p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="city">City</label>
                                        <input type="text" id="city" defaultValue="Springfield" className="w-full border rounded-lg p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="zip">ZIP Code</label>
                                        <input type="text" id="zip" defaultValue="62704" className="w-full border rounded-lg p-2" />
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </section>

            )}
        </div>
    );
}
