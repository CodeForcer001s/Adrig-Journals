
'use client';

import {
  signinWithGoogle,
  emailSignup,
  emailSignin,
} from '@/utils/supabase/actions';
import React, { useEffect, useState, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AuthPage(): React.ReactElement {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const router = useRouter();
  const successParam = searchParams.get('success');

  useEffect(() => {
    if (successParam === 'confirm_email') {
      alert('✅ Please check your email to confirm your account.');
    }
  }, [successParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    if (!isLogin) formData.append('username', displayName);

    startTransition(async () => {
      try {
        setError('');
        if (isLogin) {
          await emailSignin(formData);
        } else {
          await emailSignup(formData);
          router.replace('/auth?success=confirm_email'); // ✅ redirect after signup
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/loginbg.png')" }}
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-6">
          <div className="text-white text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4 leading-snug">
              Discover Possibilities,<br />Unleash Your Brilliance
            </h1>
            <p className="text-base text-gray-200">
              Team Journal: Your collaborative space for growth and reflection.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white text-center">
            {isLogin ? 'Login to Team Journal' : 'Create your account'}
          </h2>
          <p className="text-sm text-gray-400 mb-6 text-center">
            {isLogin
              ? 'Enter your credentials to access your account'
              : 'Enter your details to sign up'}
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="input input-bordered w-full mb-4 bg-gray-800/30 border border-gray-700/50 text-white"
            />

            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
              {isLogin && (
                <a
                  href="/auth/reset-password"
                  className="float-right text-sm text-gray-300 hover:text-white hover:underline"
                >
                  Forgot your password?
                </a>
              )}
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="input input-bordered w-full mb-4 bg-gray-800/30 border border-gray-700/50 text-white"
            />

            {!isLogin && (
              <>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  name="username"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  required
                  className="input input-bordered w-full mb-4 bg-gray-800/30 border border-gray-700/50 text-white"
                />
              </>
            )}

            <button
              type="submit"
              className="btn w-full bg-gray-700 hover:bg-gray-600 text-white border border-gray-700/30 hover:border-gray-600/30"
              disabled={pending}
            >
              {pending ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-800/30" />
            <span className="px-4 text-gray-400 text-sm">Or</span>
            <div className="flex-grow border-t border-gray-800/30" />
          </div>

          <form>
            <button
              className="btn w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-800/30 hover:border-gray-600/30 flex items-center justify-center gap-2 cursor-pointer"
              formAction={signinWithGoogle}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M21.805 10.023H12.24v3.956h5.505c-.237 1.33-.944 2.457-2.008 3.212v2.642h3.241c1.896-1.744 2.996-4.315 2.996-7.273 0-.64-.07-1.26-.17-1.537z"
                  fill="#4285F4"
                />
                <path
                  d="M12.24 21.91c2.712 0 4.986-.886 6.648-2.414l-3.242-2.642c-.897.598-2.05.94-3.406.94-2.617 0-4.837-1.764-5.63-4.14H3.282v2.65c1.66 3.28 5.102 5.606 8.958 5.606z"
                  fill="#34A853"
                />
                <path
                  d="M6.61 13.653A5.99 5.99 0 0 1 6.24 12c0-.575.098-1.13.265-1.653V7.697H3.282A9.705 9.705 0 0 0 2.24 12c0 1.565.377 3.04 1.042 4.303l3.328-2.65z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.24 6.454c1.47 0 2.787.506 3.823 1.497l2.865-2.865C17.224 3.47 14.95 2.273 12.24 2.273c-3.856 0-7.298 2.327-8.958 5.606l3.328 2.65c.793-2.376 3.013-4.14 5.63-4.14z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              className="text-gray-300 hover:text-white hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}