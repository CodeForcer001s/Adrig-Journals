'use client';

import React, { useState, useEffect } from 'react';
import { signinWithGoogle } from '@/utils/supabase/actions';
import { useSearchParams } from 'next/navigation';

export default function AuthPage(): React.ReactElement {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('success') === 'confirm_email') {
      setSuccess('✅ Please check your email (including spam folder) to confirm your account.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (showErrorPopup && error) {
      const timer = setTimeout(() => setShowErrorPopup(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorPopup, error]);

  const handleGoogleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signinWithGoogle();
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('🔗 Google sign-in failed. Please try again.');
      setShowErrorPopup(true);
    }
  };

  const ErrorPopup = () => {
    if (!showErrorPopup || !error) return null;
    return (
      <div className="animate-slideIn p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
        <div className="flex items-start">
          <span className="flex-shrink-0 mt-0.5 mr-2">⚠️</span>
          <div className="flex-1">
            <p>{error}</p>
          </div>
          <button onClick={() => setShowErrorPopup(false)} className="ml-2 text-red-400 hover:text-red-300">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 mb-6 shadow-2xl shadow-purple-500/25">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            BlogCraft
          </h1>
          <p className="text-xl text-gray-300 mb-2">Sign In to Continue</p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
          <ErrorPopup />

          {success && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm animate-slideIn">
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 mt-0.5">✅</span>
                <span>{success}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleGoogleSignin} className="mt-6">
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              🔗 Continue with Google
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="text-2xl mr-2">💡</span>
            <span className="text-sm text-gray-400">
              Check your spam folder if you don't receive the email
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
