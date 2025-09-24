'use client';

import { ReactNode, useState } from 'react';
import AdminSidebar from './components/Sidebar';
import { Menu } from 'lucide-react';


export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile menu toggle button */}
      <button
        className="sm:hidden p-2 fixed top-2 left-2 z-50 bg-white rounded-md shadow"
        onClick={() => setIsMobileOpen((prev) => !prev)}
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Sidebar */}
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Scrollable main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
