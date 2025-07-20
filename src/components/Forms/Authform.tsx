'use client';

import { signinWithGoogle, emailSignup, emailSignin } from '@/utils/supabase/actions';
import React, { useEffect, useState, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

type AuthResult = {
  error?: { message: string };
  success?: boolean;
};

export default function AuthPage(): React.ReactElement {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pending, startTransition] = useTransition();
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('success') === 'confirm_email') {
      setSuccess('✅ Please check your email (including spam folder) to confirm your account.');
    }
  }, [searchParams]);

  // Auto-close error popup after 5 seconds
  useEffect(() => {
    if (showErrorPopup && error) {
      const timer = setTimeout(() => {
        setShowErrorPopup(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorPopup, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      setError('');
      setSuccess('');
      
      try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        if (!isLogin) formData.append('username', displayName);

        let result: AuthResult | undefined;
        
        try {
          result = (isLogin ? await emailSignin(formData) : await emailSignup(formData)) as AuthResult;
        } catch (authError: any) {
          // Catch any thrown errors and convert to graceful handling
          console.error('Auth action error:', authError);
          setError(authError?.message || 'An authentication error occurred. Please try again.');
          setShowErrorPopup(true);
          return;
        }

        if (result?.error) {
          const msg = result.error.message || 'Something went wrong';
          
          // Handle specific error cases with user-friendly messages
          if (msg.includes('Email not confirmed') || msg.includes('email_not_confirmed')) {
            setError('📧 Please confirm your email before signing in. Check your inbox and spam folder.');
          } else if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
            setError('❌ Invalid email or password. Please check your credentials and try again.');
          } else if (msg.includes('Email rate limit exceeded') || msg.includes('rate_limit')) {
            setError('⏰ Too many requests. Please wait a moment before trying again.');
          } else if (msg.includes('User already registered') || msg.includes('already_registered')) {
            setError('👤 An account with this email already exists. Try signing in instead.');
          } else if (msg.includes('Password should be at least')) {
            setError('🔒 Password must be at least 6 characters long.');
          } else if (msg.includes('Invalid email')) {
            setError('📧 Please enter a valid email address.');
          } else if (msg.includes('Network error') || msg.includes('fetch')) {
            setError('🌐 Network error. Please check your connection and try again.');
          } else {
            // Generic error with emoji for better UX
            setError(`⚠️ ${msg}`);
          }
          setShowErrorPopup(true);
          return;
        }

        // Handle successful signup
        if (!isLogin && result?.success) {
          setSuccess('🎉 Account created successfully! Please check your email to confirm your account.');
        }
        
        // Handle successful login
        if (isLogin && result?.success) {
          // Create a client-side Supabase instance
          const supabase = createClient();
          
          // Force the client to refresh its session
          await supabase.auth.getSession();
          
          // Add a small delay to ensure the session is fully processed
          setTimeout(() => {
            // Now it's safe to redirect
            router.push('/');
          }, 500);
        }
      } catch (err: any) {
        console.error('Unexpected error:', err);
        setError('❌ An unexpected error occurred. Please refresh the page and try again.');
        setShowErrorPopup(true);
      }
    });
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('📧 Please enter your email address first.');
      setShowErrorPopup(true);
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', 'dummy'); // Dummy password for resend

      let result: AuthResult | undefined;
      
      try {
        result = await emailSignup(formData) as AuthResult;
      } catch (resendError: any) {
        console.error('Resend error:', resendError);
        setError('📧 Failed to resend confirmation email. Please try again.');
        setShowErrorPopup(true);
        return;
      }

      if (result?.error && !result.error.message?.includes('already registered')) {
        if (result.error.message?.includes('rate_limit')) {
          setError('⏰ Please wait before requesting another confirmation email.');
        } else {
          setError(`⚠️ ${result.error.message}`);
        }
        setShowErrorPopup(true);
      } else {
        setSuccess('📧 Confirmation email sent! Please check your inbox and spam folder.');
        setError(''); // Clear any existing errors
      }
    } catch (err: any) {
      console.error('Resend confirmation error:', err);
      setError('❌ Failed to resend confirmation email. Please try again.');
      setShowErrorPopup(true);
    }
  };

  const handleGoogleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signinWithGoogle();
    } catch (googleError: any) {
      console.error('Google signin error:', googleError);
      setError('🔗 Google sign-in failed. Please try again or use email/password.');
      setShowErrorPopup(true);
    }
  };

  // Error Popup Component
  const ErrorPopup = () => {
    if (!showErrorPopup || !error) return null;
    
    return (
      <div className="animate-slideIn p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
        <div className="flex items-start">
          <span className="flex-shrink-0 mt-0.5 mr-2">
            {error.includes('📧') ? '📧' : 
             error.includes('❌') ? '❌' : 
             error.includes('⏰') ? '⏰' : 
             error.includes('👤') ? '👤' : 
             error.includes('🔒') ? '🔒' : 
             error.includes('🌐') ? '🌐' : 
             error.includes('🔗') ? '🔗' : '⚠️'}
          </span>
          <div className="flex-1">
            <p>{error}</p>
            {(error.includes('confirm') || error.includes('📧')) && email && (
              <button 
                type="button" 
                onClick={handleResendConfirmation} 
                className="mt-2 text-red-300 hover:text-red-200 underline transition-colors text-xs"
                disabled={pending}
              >
                🔄 Resend confirmation email
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowErrorPopup(false)}
            className="ml-2 text-red-400 hover:text-red-300 focus:outline-none"
          >
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
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating blog elements */}
      <div className="absolute top-10 left-10 text-white/20 transform rotate-12">
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      </div>
      <div className="absolute bottom-10 right-10 text-white/20 transform -rotate-12">
        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2H12a2 2 0 0 0 2-2V8l-6-6z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 mb-6 shadow-2xl shadow-purple-500/25">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            BlogCraft
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Community'}
          </p>
          <p className="text-gray-400">
            {isLogin ? 'Continue your blogging journey' : 'Start sharing your stories with the world'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Error Popup inside the card */}
          <ErrorPopup />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  disabled={pending}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  {isLogin && (
                    <a href="/auth/reset-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                      Forgot password?
                    </a>
                  )}
                </div>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  disabled={pending}
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    required 
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Choose your display name"
                    disabled={pending}
                  />
                </div>
              )}
            </div>

            {/* Success Message */}
            {success && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 mt-0.5">✅</span>
                  <span>{success}</span>
                </div>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={pending} 
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/25"
            >
              {pending ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                isLogin ? '🚀 Sign In to BlogCraft' : '✨ Create Your Account'
              )}
            </button>

            {!isLogin && email && !error && !success && (
              <div className="text-center">
                <button 
                  type="button"
                  onClick={handleResendConfirmation} 
                  className="text-sm text-gray-400 hover:text-gray-300 underline transition-colors"
                  disabled={pending}
                >
                  📧 Didn't receive the email? Resend confirmation
                </button>
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-4 text-gray-400 text-sm">or continue with</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* Google Sign In */}
          <form onSubmit={handleGoogleSignin}>
            <button 
              type="submit" 
              disabled={pending}
              className="w-full py-3 px-6 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Toggle Auth Mode */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              {isLogin ? "New to BlogCraft?" : 'Already have an account?'}{' '}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }} 
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                disabled={pending}
              >
                {isLogin ? 'Create an account' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer Tip */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="text-2xl mr-2">💡</span>
            <span className="text-sm text-gray-400">
              Check your spam folder if you don't receive the email
            </span>
          </div>
        </div>
      </div>
      
      {/* Add animation for popup */}
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
