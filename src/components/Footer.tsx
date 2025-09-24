"use client";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { FaXTwitter  } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { ImFacebook } from "react-icons/im";
import Link from "next/link";
// import axios from 'axios';

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Subhan Engraving Leather Works</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium custom metal logos and signage solutions for businesses.
              Crafted with precision and built to last.
            </p>
            <div className="flex space-x-4">
             <a href="www.facebook.com" className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" target="_blank" >
              <ImFacebook  size={20}/>
             </a>
               <a href="https://x.com/subhan_su67227" className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" target="_blank" >
                <FaXTwitter size={21} />
                </a>
                <a href="https://www.instagram.com/subhanengraving_leatherworks?igsh=dXBuOTlub3hpd2ly" target="_blank" className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors">
                <FaInstagram size={22}/>
                </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Products
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/custom-orders"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Custom Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Gallery
                </Link>
              </li> */}
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/aluminum-logos"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Aluminum Logos
                </Link>
              </li>
              <li>
                <Link
                  href="/stainless-steel"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Stainless Steel
                </Link>
              </li>
              <li>
                <Link
                  href="/brass-logos"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Brass Logos
                </Link>
              </li>
              <li>
                <Link
                  href="/copper-signs"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Copper Signs
                </Link>
              </li>
              <li>
                <Link
                  href="/led-backlit"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  LED Backlit
                </Link>
              </li>
              <li>
                <Link
                  href="/dimensional-letters"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  3D Letters
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">+91 7607267749</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">
                  <a 
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=subhanleatherworks@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" underline"
                  >
                    subhanleatherworks@gmail.com
                  </a>
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <span className="text-gray-400 text-sm">
                  130/9 JK Colony 
                  <br />
                  Jajmau , Kanpur-208010
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      {/* <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h5 className="text-lg font-semibold text-white mb-2">Stay Updated</h5>
              <p className="text-gray-400 text-sm">Get the latest updates on new products and special offers</p>
            </div>
            <div className="flex w-full md:w-auto">
              <form onSubmit={handleSubmit} method='POST'>
                <input
                type="email"
                placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)}
                className="flex-1 md:w-64 px-4 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-400 rounded-l-md focus:outline-none focus:border-gray-600"
              />
              <button className="px-6 py-2 bg-white text-black font-medium rounded-r-md hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
              </form>
              
            </div>
          </div>
        </div>
      </div> */}

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 flex justify-center items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Subhan Engraving and Leather
                Works .
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/returns"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Returns
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
