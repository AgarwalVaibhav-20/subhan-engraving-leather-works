// ✅ 1. app/admin/layout.tsx
'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function AdminLayout() {
     const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);
  return null;
}

