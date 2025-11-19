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
  const [skeletonCount, setSkeletonCount] = useState(0);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/product");
        console.log("Fetched products:", res.data);
        setProducts(res.data.products); // ✅ correct field
        setSkeletonCount(res.data.products.length);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProducts([]); // prevent map crash
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 h-full">
        {Array.from({ length: skeletonCount }).map((_, index) => (
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
        toastOptions={{
          duration: 3000,
        }}
      />
      <div className="container mx-auto h-full p-5 w-full">
        {/* <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3  max-sm:gap-1 w-full min-h-screen max-sm:p-2"> */}
        <div className="minj-screen flex justify-center flex-wrap items-center gap-10 max-md:flex-col">
          {products.map((product) => (
            <Link
              key={product.productID}
              href={`/product/${product.productID}`}
            >
              <Card className="max-sm:hidden w-[300px] rounded-2xl p-2 gap-2 h-full min-h-[580px] flex flex-col justify-between ">
                <div>
                  <div className="relative w-full h-[300px] rounded-xl overflow-hidden group">
                    {/* Default Image */}
                    <Image
                      src={product.images[0]}
                      alt={product.name || "Product image"}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Hover Image */}
                    <Image
                      src={product.images[1]}
                      alt="Hover image"
                      fill
                      className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <CardHeader className="">
                    <h3 className="text-xl font-semibold line-clamp-2 hover:underline p-2">
                      {product.name}
                    </h3>
                    <div className="flex justify-between max-sm:flex-col p-2">
                      <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                        {product.brand}
                      </p>
                      <StarRating rating={4.5} />
                    </div>
                    {/* <p className="text-gray-700 text-sm font-semibold   w-full p-2 ">
                      {product.description.slice(0, 50)}
                    </p> */}
                  </CardHeader>

                  <div className="flex items-center justify-between p-2">
                    <span className="text-green-600 font-bold text-lg">
                      ₹ {product.price}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${product.inStock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                        }`}
                    >
                      {product.inStock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>

                {/* Button Row at Bottom */}
                <div className="flex justify-between items-center  md:flex-col md:gap-4">
                  {user?.role === "admin" ? <>
                    <Button
                      className="md:w-full" disabled
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
                        toast.success("Adding in your Cart");
                      }}
                    >
                      <ShoppingCart className="mr-1" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      className="md:w-full" disabled
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
                        toast.success("Adding in your Wishlist");
                      }}
                    >
                      <Heart className="mr-1" />
                      Wishlist
                    </Button>
                  </> : <>
                    <Button
                      className="md:w-full"
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
                        toast.success("Adding in your Cart");
                      }}
                    >
                      <ShoppingCart className="mr-1" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      className="md:w-full"
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
                        toast.success("Adding in your Wishlist");
                      }}
                    >
                      <Heart className="mr-1" />
                      Wishlist
                    </Button></>}
                </div>
              </Card>
              {/* Mobile view */}
              <section className="w-full ">
                <Card className="max-w-full max-sm:w-auto max-md:w-[590px] rounded-sm h-auto block sm:hidden ">
                  <div className="flex p-2 gap-2 items-start">
                    {/* Image Section */}
                    <div className="relative w-[110px] h-[110px] rounded-md overflow-hidden group">
                      {/* Default Image (1st) */}
                      <Image
                        src={product.images[0]}
                        alt="Product image"
                        fill
                        className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                        sizes="110px"
                      />
                      {/* Hover Image (2nd) */}
                      <Image
                        src={product.images[1]}
                        alt="Hover image"
                        fill
                        className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        sizes="110px"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-between w-full">
                      <CardHeader className="p-0 space-y-1">
                        <h3 className="text-[13px] font-semibold line-clamp-2 hover:underline">
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-gray-500 line-clamp-1">
                          {product.brand}
                        </p>
                        <StarRating rating={4.5} />
                        <p className="text-[10px] text-gray-700">
                          {product.description.slice(0, 50)}...
                        </p>
                      </CardHeader>

                      <div className="flex justify-between gap-2 mt-2">
                        <Button
                          className="flex-1"
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
                          Cart
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
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
                    </div>
                  </div>
                </Card>
              </section>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
