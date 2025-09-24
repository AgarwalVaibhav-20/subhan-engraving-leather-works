"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { IoCloseOutline } from "react-icons/io5";
import AnimateWrapper from "./Animation";
import logo from "../assets/new.png";
import { useAuth } from "@/context/UserContext";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { DropdownMenuDemo } from "@/components/ProfileMenu";
import { Avatar, AvatarImage } from "./ui/avatar";
import axios from "axios";

type ProductType = {
  name?: string;
  description?: string;
  price?: number;
  images?: string[];
  category?: string;
  brand?: string;
  inStock?: number;
  isFeatured?: boolean;
  productID?: string;
};

const Navbar = () => {
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [product, setProduct] = useState<ProductType[]>([]);
  const [filterData, setFilterData] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const toggleSearchBar = () => setOpenSearchBar((prev) => !prev);
  const toggleMobileMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/api/product");
      setProduct(res.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilterData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = product.filter((p) =>
        p.name?.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilterData(filtered);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, product]);

  useEffect(() => {
    if (openSearchBar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openSearchBar]);

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="font-semibold">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <main className="w-full top-0 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300 z-50">
      {/* Top Navbar */}
      <section className="flex justify-between px-4 items-center border-b dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src={logo}
              alt="logo"
              className="w-[70px] h-auto object-contain"
            />
          </Link>
        </div>

        <div className="flex justify-center items-center space-x-4 sm:space-x-6">
          <Link href="/product/MetalLogo" className="hover:text-[#4f4d4d]">Metal Logo</Link>
          <Link href="/product/RubberLogo" className="hover:text-[#4f4d4d]">Rubber Logo</Link>
          <Link href="/product/Toys" className="hover:text-[#4f4d4d]">Toys</Link>
          <Link href="/product/Toys" className="hover:text-[#4f4d4d]">Dog&apos;s Accessories</Link>
        </div>
        {/* Desktop Icons */}
        <div className="hidden sm:flex items-center space-x-8">
          <button onClick={toggleSearchBar} className="hover:opacity-75">
            <Search />
          </button>

          {user?.role === "user" && (
            <>
              <Link href="/cart">
                <ShoppingCart className="cursor-pointer" />
              </Link>
              <Link href="/wishlist">
                <Heart className="cursor-pointer" />
              </Link>
              <DropdownMenuDemo />
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link href="/admin/dashboard">
                {user?.profileImage ? (
                  <Avatar>
                    <AvatarImage src={user.profileImage} />
                  </Avatar>
                  // <Image
                  //   width={30}
                  //   height={30}
                  //   src={user.profileImage}
                  //   alt="admin-icon"
                  //   className="cursor-pointer rounded-full"
                  // />
                ) : (
                  <Image
                    width={32}
                    height={32}
                    src="https://img.icons8.com/windows/32/system-administrator-male.png"
                    alt="admin-icon"
                    className="cursor-pointer"
                  />
                )}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-xs px-2 py-1 rounded bg-[#212121] text-white"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link href="/login">
                <Button className="text-sm px-3 py-1 text-white">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="text-sm px-3 py-1 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleSearchBar}
          className="hover:opacity-75 hidden max-sm:block"
        >
          <Search />
        </button>
        <button className="sm:hidden" onClick={toggleMobileMenu}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </section>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden px-5 py-4 border-b dark:border-gray-700 space-y-4 flex flex-col">
          <Link href="/" onClick={toggleMobileMenu}>
            Home
          </Link>

          {user ? (
            <>
              <Link href="/account" onClick={toggleMobileMenu}>
                Account
              </Link>
              <Link href="/cart" onClick={toggleMobileMenu}>
                Cart
              </Link>
              <Link href="/wishlist" onClick={toggleMobileMenu}>
                Wishlist
              </Link>
              {user.role === "admin" && (
                <Link href="/admin/dashboard" onClick={toggleMobileMenu}>
                  Admin Panel
                </Link>
              )}
              <Button
                onClick={() => {
                  setMenuOpen(false);
                  signOut({ callbackUrl: "/login" });
                }}
                className="text-white bg-black"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button>
                <Link href="/login" onClick={toggleMobileMenu}>
                  Login
                </Link>
              </Button>
              <Button>
                <Link href="/signup" onClick={toggleMobileMenu}>
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      )}

      {/* Search Bar & Overlay */}
      {openSearchBar && (
        <>
          {/* Backdrop */}
          <div
            className="flex justify-center bg-black bg-opacity-40 backdrop-blur-sm z-40"
            onClick={toggleSearchBar}
          ></div>

          <AnimateWrapper keyValue="open">
            <section className=" w-full bg-white dark:bg-gray-900 z-50 shadow-md">
              <div className="flex justify-center items-center py-4 px-3 gap-2 pr-12 pl-12 border-b dark:border-gray-700">
                <Search size={22} className="text-gray-300" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search product"
                  className="w-full bg-transparent text-[17px] border-none focus:outline-none dark:text-white"
                />
                <button onClick={toggleSearchBar}>
                  <IoCloseOutline size={24} className="dark:text-white" />
                </button>
              </div>
            </section>

            <section className="absolute flex max-sm:top-[110px] h-[90vh] overflow-auto z-50 border bg-white dark:bg-gray-900 w-full px-4">
              <div className="w-[500px] max-sm:w-full mx-auto mb-4">
                {inputValue && (
                  <ul className="rounded p-3 bg-white dark:bg-gray-800 text-black dark:text-white">
                    <h4 className="font-semibold text-gray-600 dark:text-gray-300">
                      Suggestions
                    </h4>
                    <hr className="my-2" />
                    {loading ? (
                      <li className="animate-pulse">Loading...</li>
                    ) : filterData.length > 0 ? (
                      filterData.map((product, index) => (
                        <li key={index} className="py-1 cursor-pointer">
                          <Link
                            href={`/product/${product.productID}`}
                            onClick={() => setOpenSearchBar(false)}
                          >
                            {highlightMatch(product.name || "", inputValue)}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No products found.</li>
                    )}
                  </ul>
                )}
              </div>

              <div className="productView w-full max-w-[1200px] px-4 sm:px-6">
                {inputValue && (
                  <>
                    <h1 className="text-sm text-gray-500 dark:text-gray-300 p-3">
                      Products
                    </h1>
                    <hr className="mb-4" />

                    <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4">
                      {filterData.map((product: ProductType, i: number) => (
                        <div
                          key={i}
                          className="flex-shrink-0 w-[250px] sm:w-[280px] md:w-[260px] lg:w-[300px] border rounded-2xl bg-white dark:bg-zinc-900 shadow-md"
                        >
                          <Link
                            href={`/product/${product.productID}`}
                            onClick={() => setOpenSearchBar(false)}
                          >
                            <div className="group rounded-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
                              {/* Image */}
                              <div className="relative w-full h-52 sm:h-60 overflow-hidden dark:bg-gray-800 border-b">
                                <Image
                                  src={product.images?.[0] || ""}
                                  alt={product.name || "Product"}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>

                              {/* Info */}
                              <div className="p-4 space-y-2">
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                                  {product.name}
                                </h2>
                                <p className="text-md font-medium text-green-600 dark:text-green-400">
                                  ₹{product.price?.toFixed(2)}
                                </p>
                                <div className="flex items-center text-sm text-yellow-500">
                                  <span className="mr-1">⭐</span> 4.0
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

            </section>
          </AnimateWrapper>
        </>
      )}
    </main>
  );
};

export default Navbar;
