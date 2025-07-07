'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Home,
  ShoppingCart,
  Upload,
  Menu,
  X,
  BarChart3,
  Package,
  Users,
  Settings,
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, route: '/admin/dashboard' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, route: '/admin/orders' },
  { id: 'products', label: 'Products', icon: Package, route: '/admin/products' },
  { id: 'upload', label: 'Upload Product', icon: Upload, route: '/admin/uploads' },
  { id: 'customers', label: 'Customers', icon: Users, route: '/admin/customers' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, route: '/admin/analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, route: '/admin/settings' },
];

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const SidebarItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = pathname === item.route;

    return (
      <div
        title={item.label}
        onClick={() => {
          router.push(item.route);
          if (isMobile) setIsMobileOpen(false);
        }}
        className={`relative flex items-center gap-3 px-3 py-3 mx-2 rounded-xl cursor-pointer
        transition-all duration-200 group hover:bg-blue-50
        ${isActive ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-600 hover:text-blue-600'}
        ${isCollapsed ? 'justify-center' : ''}`}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
        )}

        <div className={`${isCollapsed ? 'w-8 h-8' : 'w-6 h-6'} flex items-center justify-center`}>
          <Icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} transition-all`} />
        </div>

        {!isCollapsed && <div className="text-sm font-medium">{item.label}</div>}
      </div>
    );
  };

  return (
    <div
      className={`
        bg-white border-r border-gray-200 
        h-full z-50
        ${isCollapsed ? 'w-20' : 'w-64'}
        transition-[width] duration-300 ease-in-out

        max-sm:fixed max-sm:top-0 max-sm:left-0 max-sm:h-screen max-sm:shadow-lg
        max-sm:transform max-sm:transition-transform max-sm:duration-300 max-sm:ease-in-out
        ${isMobileOpen ? 'max-sm:translate-x-0' : 'max-sm:-translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {!isCollapsed && <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>}
        <button
          onClick={() => {
            if (isMobile) {
              setIsMobileOpen(false);
            } else {
              setIsCollapsed(!isCollapsed);
            }
          }}
          className="p-2 rounded-lg hover:bg-gray-100"
          title={isMobile ? 'Close' : isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isMobile ? (
            <X className="w-5 h-5" />
          ) : isCollapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="py-4 space-y-4">
        {menuItems.map((item) => (
          <SidebarItem key={item.id} item={item} />
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
