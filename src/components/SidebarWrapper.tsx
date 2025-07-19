'use client';

import { useAuth } from '@/utils/context/AuthContext';
import Sidebar from './sidebar';
import { usePathname } from 'next/navigation';

export default function SidebarWrapper() {
  const { user, isLoading, authError } = useAuth();
  const pathname = usePathname();
  
  // Don't show sidebar on auth pages or if there's an auth error
  if (pathname.startsWith('/auth') || !user || authError) {
    return null;
  }
  
  return <Sidebar />;
}