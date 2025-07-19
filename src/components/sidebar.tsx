'use client';

import Link from 'next/link';
import { signout } from '@/utils/supabase/actions';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/utils/context/AuthContext';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l7 7m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: 'Dashboard'
    },
    {
      href: '/create',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Create Page'
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full min-h-screen z-50 bg-gradient-to-br from-gray-950 via-black to-gray-900 
        text-white shadow-2xl transition-all duration-500 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-72'}
        lg:relative lg:translate-x-0 lg:h-full lg:min-h-screen
        border-r border-gray-800/30
        backdrop-blur-xl
      `}>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-600/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-700/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Toggle button for desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:block absolute -right-3 top-6 w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10 border-2 border-gray-600/40"
        >
          <svg className={`w-3 h-3 mx-auto text-white transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex flex-col h-full min-h-screen relative z-10">
          {/* Header */}
          <div className={`px-6 py-8 border-b border-gray-800/30 ${isCollapsed ? 'px-3' : ''}`}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            {!isCollapsed && (
              <div className="text-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Team Journal
                </h1>
                <div className="mt-3 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="text-xs text-gray-400 font-medium truncate">
                    {user?.email || 'Guest User'}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden
                  ${pathname === item.href 
                    ? 'bg-gradient-to-r from-gray-700/40 to-gray-800/40 text-white shadow-lg border border-gray-600/30 backdrop-blur-sm' 
                    : 'hover:bg-gray-800/30 hover:text-white text-gray-300 hover:shadow-md hover:border-gray-700/30 border border-transparent'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700/0 to-gray-800/0 group-hover:from-gray-700/20 group-hover:to-gray-800/20 transition-all duration-500 rounded-xl" />
                
                {/* Icon with animation */}
                <div className={`relative z-10 transition-transform duration-300 ${pathname === item.href ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                
                {/* Label with slide animation */}
                {!isCollapsed && (
                  <span className="relative z-10 font-medium transition-all duration-300 group-hover:translate-x-1">
                    {item.label}
                  </span>
                )}
                
                {/* Active indicator */}
                {pathname === item.href && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full shadow-lg shadow-gray-400/50" />
                )}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className={`px-4 py-6 space-y-3 border-t border-gray-800/30 ${isCollapsed ? 'px-2' : ''}`}>
            {/* Profile Link */}
            <Link
              href="/profile"
              className={`
                group flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden
                ${pathname === '/profile' 
                  ? 'bg-gradient-to-r from-gray-700/40 to-gray-800/40 text-white shadow-lg border border-gray-600/30' 
                  : 'hover:bg-gray-800/30 hover:text-white text-gray-300 hover:shadow-md hover:border-gray-700/30 border border-transparent'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700/0 to-gray-800/0 group-hover:from-gray-700/20 group-hover:to-gray-800/20 transition-all duration-500 rounded-xl" />
              <div className={`relative z-10 transition-transform duration-300 ${pathname === '/profile' ? 'scale-110' : 'group-hover:scale-110'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {!isCollapsed && (
                <span className="relative z-10 font-medium transition-all duration-300 group-hover:translate-x-1">
                  Profile
                </span>
              )}
            </Link>

            {/* Logout Button */}
            <form action={signout} className="w-full">
              <button
                type="submit"
                className={`
                  group flex items-center gap-4 p-3 rounded-xl transition-all duration-300 w-full relative overflow-hidden
                  bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-200 hover:text-white
                  hover:from-red-500/30 hover:to-pink-500/30 hover:shadow-lg hover:shadow-red-500/20
                  border border-red-500/20 hover:border-red-400/40
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-pink-500/0 group-hover:from-red-500/10 group-hover:to-pink-500/10 transition-all duration-500 rounded-xl" />
                <div className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                {!isCollapsed && (
                  <span className="relative z-10 font-medium transition-all duration-300 group-hover:translate-x-1">
                    Log Out
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}