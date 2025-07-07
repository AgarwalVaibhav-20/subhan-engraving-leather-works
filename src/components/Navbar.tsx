'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';
import { IoCloseOutline } from 'react-icons/io5';
import AnimateWrapper from './Animation';
import logo from '../assets/new.png';
import { useAuth } from '@/context/UserContext';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

const Navbar = () => {
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  const toggleSearchBar = () => setOpenSearchBar((prev) => !prev);
  const toggleMobileMenu = () => setMenuOpen((prev) => !prev);

  return (
    <main className="w-full sticky top-0  bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">
      {/* Top navbar */}
      <section className="flex justify-between px-4 items-center border-b dark:border-gray-700">
        {/* Logo + mobile menu toggle */}
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Image src={logo} alt="logo" className="w-[90px] h-auto object-contain" />
          </Link>
        </div>

        {/* Desktop Navigation Icons */}
        <div className="hidden sm:flex items-center gap-6">
          {/* Search - always visible */}
          <button onClick={toggleSearchBar} className="hover:opacity-75">
            <Search />
          </button>

          {user ? (
            <>
              {/* Admin */}
              {user.role === 'admin' && (
                <Link href="/admin" title="Admin Dashboard">
                  <Image
                    width={32}
                    height={32}
                    src="https://img.icons8.com/windows/32/system-administrator-male.png"
                    alt="admin-icon"
                    className="cursor-pointer"
                  />
                </Link>
              )}

              {/* Account */}
              <Link href="/account" title="Account">
                <User className="cursor-pointer" />
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <ShoppingCart className="cursor-pointer" />
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Heart className="cursor-pointer" />
              </Link>

              {/* Logout */}
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button className="text-sm px-3 py-1 rounded  text-white cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="text-sm px-3 py-1 rounded  text-white cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
        <button className="sm:hidden" onClick={toggleMobileMenu}>
            {menuOpen ? <X /> : <Menu />}
          </button>
      </section>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden px-5 py-4 border-b dark:border-gray-700 space-y-4 flex flex-col">
          <Link href="/" onClick={toggleMobileMenu}>Home</Link>

          {user ? (
            <>
              <Link href="/account" onClick={toggleMobileMenu}>Account</Link>
              <Link href="/cart" onClick={toggleMobileMenu}>Cart</Link>
              <Link href="/wishlist" onClick={toggleMobileMenu}>Wishlist</Link>
              {user.role === 'admin' && (
                <Link href="/admin" onClick={toggleMobileMenu}>Admin Panel</Link>
              )}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signOut({ callbackUrl: '/login' });
                }}
                className="text-red-600 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Button>
                <Link href="/login" onClick={toggleMobileMenu}>Login</Link>
              </Button>
              <Button>
                <Link href="/signup" onClick={toggleMobileMenu}>Sign Up</Link>
              </Button>
             
            </>
          )}
        </div>
      )}

      {/* Search Bar */}
      {openSearchBar && (
        <section className="border-b dark:border-gray-700 w-full relative">
          <AnimateWrapper keyValue={openSearchBar ? 'open' : 'closed'}>
            <div className="absolute z-30 bg-white dark:bg-gray-900 flex justify-center items-center py-4 px-3 w-full gap-2 pr-12 pl-12 border-b dark:border-gray-700">
              <Search size={22} className="text-gray-300" />
              <input
                type="text"
                placeholder="Search product"
                aria-label="Search product"
                className="w-full bg-transparent text-[17px] h-auto border-none focus:outline-none dark:text-white"
              />
              <button onClick={toggleSearchBar} className="cursor-pointer">
                <IoCloseOutline size={24} className="dark:text-white" />
              </button>
            </div>
          </AnimateWrapper>
        </section>
      )}
    </main>
  );
};

export default Navbar;
