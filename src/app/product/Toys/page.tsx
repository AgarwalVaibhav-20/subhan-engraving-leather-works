"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Card, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WisListContext";
import toast, { Toaster } from "react-hot-toast";
import ProductSkeletonCard from "@/components/Productskeleton";
import { useAuth } from "@/context/UserContext";

type ProductType = {
  _id: string; 
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  inStock: number;
  isFeatured?: boolean;
  productID: string;
};

export default function Product() {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/product/toys");
        console.log("API Response:", res.data);

        // ✅ API returns { success, data: [] }
        if (res.data.success) {
          setProducts(res.data.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 h-full">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductSkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 3000 }}
      />
      <div className="container mx-auto h-full p-5 w-full">
        <div className="min-h-screen flex justify-center flex-wrap items-center gap-10 max-md:flex-col">
          {products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            products.map((product) => (
              <Link
                key={product.productID}
                href={`/product/RubberLogo/${product.productID}`}
              >
                <Card className="max-sm:hidden w-[300px] rounded-2xl p-2 gap-2 h-full min-h-[580px] flex flex-col justify-between ">
                  <div>
                    <div className="relative w-full h-[300px] rounded-xl overflow-hidden group">
                      {/* Default Image */}
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                      />
                      {/* Hover Image */}
                      <Image
                        src={product.images[1]}
                        alt={product.name}
                        fill
                        className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    </div>

                    <CardHeader>
                      <h3 className="text-xl font-semibold line-clamp-2 hover:underline p-2">
                        {product.name}
                      </h3>
                      <div className="flex justify-between max-sm:flex-col p-2">
                        <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                          {product.brand}
                        </p>
                        <StarRating rating={4.5} />
                      </div>
                    </CardHeader>

                    <div className="flex items-center justify-between p-2">
                      <span className="text-green-600 font-bold text-lg">
                        ₹ {product.price}
                      </span>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          product.inStock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {product.inStock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between items-center md:flex-col md:gap-4">
                    <Button
                      className="md:w-full"
                      disabled={user?.role === "admin" || product.inStock <= 0}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart({
                          id: product.productID,
                          name: product.name,
                          price: product.price,
                          images: product.images,
                          quantity: 1,
                        });
                        toast.success("Added to Cart");
                      }}
                    >
                      <ShoppingCart className="mr-1" />
                      {product.inStock > 0 ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Button
                      variant="outline"
                      className="md:w-full"
                      disabled={user?.role === "admin"}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToWishlist({
                          id: product.productID,
                          name: product.name,
                          price: product.price,
                          images: product.images,
                          quantity: 1,
                        });
                        toast.success("Added to Wishlist");
                      }}
                    >
                      <Heart className="mr-1" />
                      Wishlist
                    </Button>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
