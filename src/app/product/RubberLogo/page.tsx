"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { Heart, ShoppingCart, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WisListContext";
import toast, { Toaster } from "react-hot-toast";
import ProductSkeletonCard from "@/components/Productskeleton";
import { useAuth } from "@/context/UserContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

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
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/product/rubberlogo");
        
        if (res.data.success) {
          setProducts(res.data.data);
          setFilteredProducts(res.data.data);
          const max = Math.max(...res.data.data.map((p: ProductType) => p.price));
          setMaxPrice(max);
          setPriceRange([0, max]);
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique brands
  const brands = Array.from(new Set(products.map(p => p.brand)));

  // Filter and Sort Logic
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((product) => selectedBrands.includes(product.brand));
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    setFilteredProducts(result);
  }, [searchQuery, sortBy, priceRange, selectedBrands, products]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, maxPrice]);
    setSelectedBrands([]);
    setSortBy("featured");
  };

  const handleAddToCart = (e: React.MouseEvent, product: ProductType) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.productID,
      name: product.name,
      price: product.price,
      images: product.images,
      quantity: 1,
    });
    toast.success("Added to cart");
  };

  const handleAddToWishlist = (e: React.MouseEvent, product: ProductType) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToWishlist({
      id: product.productID,
      name: product.name,
      price: product.price,
      images: product.images,
      quantity: 1,
    });
    toast.success("Added to wishlist");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeFiltersCount = 
    (searchQuery ? 1 : 0) + 
    (priceRange[0] !== 0 || priceRange[1] !== maxPrice ? 1 : 0) + 
    selectedBrands.length;

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Rubber Logos</h1>
                  <p className="text-sm text-gray-600 mt-1">Premium Quality Rubber Logo Collection</p>
                </div>
              </div>

              {/* Search and Filter Bar */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2 relative">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Products</SheetTitle>
                      <SheetDescription>
                        Refine your search results
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      {/* Sort By */}
                      <div className="p-5">
                        <Label className="text-sm font-semibold mb-3 block">Sort By</Label>
                        <RadioGroup value={sortBy} onValueChange={setSortBy}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="featured" id="featured" />
                            <Label htmlFor="featured" className="cursor-pointer">Featured</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="price-low" id="price-low" />
                            <Label htmlFor="price-low" className="cursor-pointer">Price: Low to High</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="price-high" id="price-high" />
                            <Label htmlFor="price-high" className="cursor-pointer">Price: High to Low</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="name" id="name" />
                            <Label htmlFor="name" className="cursor-pointer">Name: A-Z</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Price Range */}
                      <div className="p-5">
                        <Label className="text-sm font-semibold mb-3 block">
                          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                        </Label>
                        <Slider
                          min={0}
                          max={maxPrice}
                          step={100}
                          value={priceRange}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          className="mt-2"
                        />
                      </div>

                      {/* Brands */}
                      {brands.length > 0 && (
                        <div className="p-5">
                          <Label className="text-sm font-semibold mb-3 block">Brands</Label>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {brands.map((brand) => (
                              <div key={brand} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={brand}
                                  checked={selectedBrands.includes(brand)}
                                  onChange={() => handleBrandToggle(brand)}
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <Label htmlFor={brand} className="ml-2 cursor-pointer">
                                  {brand}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Clear Filters */}
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          className="w-full"
                        >
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {searchQuery && (
                    <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      Search: {searchQuery}
                      <X
                        className="w-3 h-3 cursor-pointer ml-1"
                        onClick={() => setSearchQuery("")}
                      />
                    </div>
                  )}
                  {selectedBrands.map((brand) => (
                    <div
                      key={brand}
                      className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {brand}
                      <X
                        className="w-3 h-3 cursor-pointer ml-1"
                        onClick={() => handleBrandToggle(brand)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/MetalLogo/${product._id}`}
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <Card className="group h-full flex flex-col overflow-hidden border-gray-200 hover:shadow-2xl transition-all duration-300">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {product.images[1] && (
                        <Image
                          src={product.images[1]}
                          alt={product.name}
                          fill
                          className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isFeatured && (
                          <span className="bg-black text-white px-3 py-1 text-xs font-medium uppercase">
                            Featured
                          </span>
                        )}
                        {product.inStock <= 5 && product.inStock > 0 && (
                          <span className="bg-orange-500 text-white px-3 py-1 text-xs font-medium">
                            Only {product.inStock} left
                          </span>
                        )}
                        {product.inStock === 0 && (
                          <span className="bg-red-500 text-white px-3 py-1 text-xs font-medium">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
                        hoveredProduct === product._id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                      }`}>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="bg-white hover:bg-gray-100 rounded-full shadow-lg"
                          disabled={user?.role === "admin"}
                          onClick={(e) => handleAddToWishlist(e, product)}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          {product.brand}
                        </p>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <StarRating rating={4.5} />
                          <span className="text-xs text-gray-500">(4.5)</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{product.price.toLocaleString()}
                          </span>
                        </div>

                        <Button
                          className="w-full bg-black hover:bg-gray-800 text-white"
                          disabled={user?.role === "admin" || product.inStock <= 0}
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {product.inStock > 0 ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}