"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, ArrowRight, Heart, CircleCheckBig } from "lucide-react";
import RatingForm from "@/components/RatingForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

type ProductType = {
  name: string;
  description: string;
  price: number;
  images: string[];
  aboutTheItems: string[];
  category: string;
  brand: string;
  colour: string;
  pieces: number;
  inStock: number;
  id: string;
};
const piecesOptions = ["500", "2500"];
export default function ProductViewPage() {
  const { addToCart } = useCart();
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useState<ProductType | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedPieces, setSelectedPieces] = useState<number>(500);
  useEffect(() => {
    if (id) {
      axios
        .get(`/api/product/${id}`)
        .then((res) => {
          setProduct(res.data);
          if (res.data?.images?.length) {
            setSelectedImage(res.data.images[0]);
          }
        })
        .catch((err) => console.error("Failed to fetch product:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handlePrev = () => {
    if (!product?.images?.length) return;
    const currentIndex = product.images.indexOf(selectedImage);
    const newIndex =
      (currentIndex - 1 + product.images.length) % product.images.length;
    setSelectedImage(product.images[newIndex]);
  };

  const handleNext = () => {
    if (!product?.images?.length) return;
    const currentIndex = product.images.indexOf(selectedImage);
    const newIndex = (currentIndex + 1) % product.images.length;
    setSelectedImage(product.images[newIndex]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div
          className=" w-10 h-10 border-3  border-t-transparent  border-black
     rounded-full animate-spin text-gray-800 "
        ></div>
      </div>
    );
  }

  if (!product) {
    return <div className="p-6">Product not found.</div>;
  }

  return (
    <div className=" min-h-screen z-50 px-4 py-6 overflow-x-hidden">
      <div className="max-w-7xl w-full mx-auto flex flex-col gap-10 min-h-screen">
        {/* Product Preview Section */}
        <div className="flex flex-col lg:flex-row gap-10 items-start ">
          {/* Images Section */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 w-full lg:w-1/2 md:items-center">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible scrollbar-hide max-sm:items-center max-sm:j-center">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`cursor-pointer border-2 rounded-lg transition-all duration-200 ${
                    selectedImage === img
                      ? "border-blue-500 shadow-md ring-2 ring-blue-200"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                    <Image
                      fill
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="object-cover rounded-md"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative w-full max-w-xl">
              <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={selectedImage}
                  alt={`Product image - ${product.name}`}
                  fill
                  className="object-cover"
                />
                {/* Arrows */}
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow border hover:scale-110 transition"
                  aria-label="Previous image"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow border hover:scale-110 transition"
                  aria-label="Next image"
                >
                  <ArrowRight className="w-5 h-5 text-gray-700" />
                </button>
                {/* Counter */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                  {product.images.indexOf(selectedImage) + 1} /{" "}
                  {product.images.length}
                </div>
              </div>
            </div>
          </div>
          {/* Product Info */}
          <div className="flex flex-col space-y-4 w-full lg:max-w-xl">
            <h1 className="text-2xl font-semibold text-gray-800">
              {product.name}
            </h1>

            <div className="text-sm text-gray-500">
              Brand: <span className="text-gray-700">{product.brand}</span> |
              Category:{" "}
              <span className="text-gray-700">{product.category}</span>
            </div>

            <div
              className={`text-sm ${
                product.inStock > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.inStock > 0
                ? `In Stock (${product.inStock})`
                : "Out of Stock"}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>⭐ 670 ratings</span>
              <span>💬 620 comments</span>
            </div>

            <div className="flex items-center gap-2 text-2xl font-bold text-gray-800">
              ₹{product.price}
              <span className="text-sm line-through text-gray-400">
                ₹999.00
              </span>
            </div>
            <div className="flex justify-start items-center space-x-2">
              <p className="text-lg font-medium">
                Customizing Colors are avaliable
              </p>
              <CircleCheckBig size={18} />
            </div>
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium ">
                Pieces
              </label>
              <select
                name="piece"
                id="piece"
                defaultValue={product.pieces}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-all"
              >
                <option value="">Select an Option</option>
                {piecesOptions.map((piece) => (
                  <option key={piece} value={piece}>
                    {piece} Pcs.
                  </option>
                ))}
              </select>
            </div>
            <div className="text-base text-gray-700 dark:text-gray-300 text-justify break-words w-full max-w-2xl mx-auto">
              {product.description}
            </div>

            <div className="flex justify-start flex-col items-start  w-full text-base/6 line-clamp-6">
              <h1 className="text-[20px] font-semibold"> About The Items</h1>
              <ul className="">
                {product.aboutTheItems.map((item, index) => (
                  <li key={index} className="p-3">
                   ● {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-3 gap-3">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    images: product.images,
                    quantity: 1,
                  });
                }}
              >
                Add to Cart
              </Button>
              <Button className="w-full sm:w-auto flex gap-1 items-center">
                Wishlist <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div>
          <RatingForm />
        </div>
      </div>
    </div>
  );
}
