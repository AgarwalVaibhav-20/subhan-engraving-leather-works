"use client";
import React, { useState } from "react";
import {
  Heart,
  Trash2,
  ShoppingCart,
  Star,
  Sparkles,
  Gift,
} from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { Card , CardHeader } from "./ui/card";
function WishList() {
  const [removingItem, setRemovingItem] = useState(null);

  // Enhanced wishlist data with more details
  const wishlistItems= [
  ];

  const handleRemoveItem = (itemId) => {
    setRemovingItem(itemId);
    setTimeout(() => {
      setRemovingItem(null);
      // Here you would actually remove the item from the list
    }, 800);
  };

 
  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full  animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto p-4 relative z-10">
        {/* Enhanced Header */}
        <div className="mb-8 p-8  relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Heart size={36} className=" animate-pulse" />
                <Sparkles
                  size={20}
                  className="absolute -top-2 -right-2 text-yellow-300 animate-bounce"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold  bg-clip-text">
                My Wishlist
              </h1>
            </div>
          </div>
          <hr className="h-6 w-full"/>
        </div>
        {/* Enhanced Wishlist Items */}
        <div className="grid gap-6">
          {wishlistItems.map((item) => (
            <Card
              key={item.id}
              className={`overflow-hidden h relative group ${
                removingItem === item.id
                  ? "animate-pulse scale-95 opacity-50"
                  : ""
              }`}
            >

              {/* Mobile Layout */}
              <div className="block lg:hidden p-6">
                <div className="relative">
                  <div className="flex gap-6">
                    {/* Enhanced Product Image */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-28 h-28  rounded-2xl flex items-center justify-center  relative overflow-hidden group">
                        <div className="w-24 h-24  rounded-xl flex items-center justify-center transform ">
                          <Image fill alt="Product image" src={"/new.png"} />
                        </div>
                        <div className="absolute inset-0  to-transparent opacity-0 "></div>
                      </div>
                                         </div>

                    {/* Enhanced Product Info */}
                    <div className="flex-1 min-w-0">
                      {/* <div className="flex flex-wrap gap-2 mb-2">
                        {item.badges.map((badge, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              badge === "Best Seller"
                                ? "bg-green-100 text-green-700"
                                : badge === "New Arrival"
                                  ? "bg-blue-100 text-blue-700"
                                  : badge === "Trending"
                                    ? "bg-orange-100 text-orange-700"
                                    : badge === "Premium"
                                      ? "bg-purple-100 text-gray-900"
                                      : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div> */}

                      <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.brand} • {item.color}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <Star
                            size={14}
                            className="text-yellow-400 fill-yellow-400"
                          />
                          <span className="text-sm font-semibold text-gray-700 ml-1">
                            {item.rating}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          ({item.reviews} reviews)
                        </span>
                      </div>

                      {/* Enhanced Price */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl font-bold">
                            ₹{item.price.toLocaleString()}
                          </span>
                          <span className="text-sm line-through text-gray-400">
                            ₹{item.originalPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full font-bold">
                            {item.discount}% OFF
                          </span>
                          <span className="text-sm text-green-600 font-semibold">
                            Save ₹
                            {(item.originalPrice - item.price).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Stock Status */}
                      <div className="mb-4">
                        <span
                          className={`text-sm px-3 py-1 rounded-full font-semibold ${
                            item.inStock
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex justify-center items-center gap-3 mt-6 p-3">
                    
                    <Button
                      className="text-sm h-12 font-bold bg-black text-white flex items-center w-full "
                      disabled={!item.inStock}
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="destructive"
                      className="h-12 px-4"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:block p-8">
                <div className="flex items-center gap-8">
                  {/* Enhanced Product Image & Info */}
                  <div className="flex items-center gap-6 flex-1">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-2xl flex items-center justify-center  relative overflow-hidden group">
                        <div className="w-28 h-28  flex items-center justify-center">
                         <Image src={'/Aiavatar.jpeg'} fill alt="product image"/>
                        </div>
                        
                      </div>
                     
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-900 text-xl mb-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {item.brand} • {item.color}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          <Star
                            size={16}
                            className="text-yellow-400 fill-yellow-400"
                          />
                          <span className="text-sm font-semibold text-gray-700 ml-1">
                            {item.rating}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({item.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Price */}
                  <div className="text-center min-w-0 flex-shrink-0">
                    <CardHeader className="text-sm font-semibold text-gray-500 mb-3">
                      Price
                    </CardHeader>
                    <div className="mb-2">
                      <div className="text-2xl font-bold ">
                        ₹{item.price.toLocaleString()}
                      </div>
                      <div className="text-sm line-through text-gray-400">
                        ₹{item.originalPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full font-bold">
                        {item.discount}% OFF
                      </span>
                      <span className="text-xs text-green-600 font-semibold">
                        Save ₹
                        {(item.originalPrice - item.price).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Stock Status */}
                  <div className="text-center min-w-0 flex-shrink-0">
                    <CardHeader className="text-sm font-semibold text-gray-500 mb-3">
                      Availability
                    </CardHeader>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                        item.inStock
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                    </span>
                  </div>

                  {/* Enhanced Actions */}
                  <div className="gap-2 flex shrink-0">
                    
                    <Button
                      className="text-sm font-bold cursor-pointer"
                      disabled={!item.inStock}
                    > 
                    <ShoppingCart size={18} className="mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={() => handleRemoveItem(item.id)} 
                      className="cursor-pointer bg-red-500 hover:bg-red-200"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced Empty State */}
        {wishlistItems.length === 0 && (
          <div className="text-center py-20">
            <div className="relative mb-8">
              <Heart size={80} className="mx-auto text-purple-300" />
              <Sparkles
                size={32}
                className="absolute top-0 right-1/2 transform translate-x-8  animate-bounce"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Your wishlist is waiting for magic!
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              Discover amazing products and add them to your collection.
            </p>
            <Button  className="text-lg px-8 py-4">
              <Link href="/" className="flex justify-center items-center">
              <Gift size={20} className="mr-2" />
              Start Shopping
              </Link>
            </Button>
          </div>
        )}

        {/* Action Bar */}
        <div className="sticky bottom-4 mt-8">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Total:{" "}
                  <span className="font-bold text-lg ">
                    ₹
                    {wishlistItems
                      .reduce((sum, item) => sum + item.price, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-green-600 font-semibold">
                  You save: ₹
                  {wishlistItems
                    .reduce(
                      (sum, item) => sum + (item.originalPrice - item.price),
                      0
                    )
                    .toLocaleString()}
                </div>
              </div>
              <div className="flex">
                <Button>
                  <ShoppingCart size={18} className="mr-2" />
                  Add All to Cart
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default WishList;
