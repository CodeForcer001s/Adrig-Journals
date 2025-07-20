'use client';

import { signinWithGoogle, emailSignup, emailSignin } from '@/utils/supabase/actions';
import React, { useEffect, useState, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type AuthResult = {
  error?: { message: string };
};

export default function AuthPage(): React.ReactElement {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('success') === 'confirm_email') {
      setSuccess('✅ Please check your email (including spam folder) to confirm your account.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      setError('');
      setSuccess('');
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      if (!isLogin) formData.append('username', displayName);

      const result = (isLogin ? await emailSignin(formData) : await emailSignup(formData)) as AuthResult;

      if (result?.error) {
        const msg = result.error.message || 'Something went wrong';
        if (msg.includes('Email not confirmed')) {
          setError('Please confirm your email before signing in.');
        } else {
          setError(msg);
        }
        return;
      }

      if (!isLogin) {
        setSuccess('Account created! Please confirm via email.');
        setTimeout(() => router.replace('/auth?success=confirm_email'), 2000);
      }
    });
  };

  const handleResendConfirmation = async () => {
    if (!email) return setError('Enter your email first.');
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', 'dummy');

    const result = await emailSignup(formData) as AuthResult;
    if (result?.error && !result.error.message?.includes('already registered')) {
      setError(result.error.message);
    } else {
      setSuccess('Confirmation email resent!');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      <div className="hidden md:flex w-1/2 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/loginbg.png')" }} />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-6">
          <div className="text-white text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">Discover Possibilities,<br />Unleash Your Brilliance</h1>
            <p className="text-base text-gray-200">Team Journal: Your collaborative space for growth and reflection.</p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white text-center">
            {isLogin ? 'Login to Team Journal' : 'Create your account'}
          </h2>
          <p className="text-sm text-gray-400 mb-6 text-center">
            {isLogin ? 'Enter your credentials to access your account' : 'Enter your details to sign up'}
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" />

            <label className="block text-sm text-gray-300 mb-1">
              Password
              {isLogin && <a href="/auth/reset-password" className="float-right text-sm hover:underline">Forgot?</a>}
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" />

            {!isLogin && (
              <>
                <label className="block text-sm text-gray-300 mb-1">Display Name</label>
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="input" />
              </>
            )}

            <button type="submit" disabled={pending} className="btn">
              {pending ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
            </button>

            {success && <p className="msg success">{success}</p>}
            {error && (
              <div className="msg error">
                <p>{error}</p>
                {error.includes('confirm') && (
                  <button type="button" onClick={handleResendConfirmation} className="link">Resend confirmation email</button>
                )}
              </div>
            )}

            {!isLogin && email && (
              <p className="text-center text-sm mt-2">
                <button onClick={handleResendConfirmation} className="link">Didn't get email? Resend</button>
              </p>
            )}
          </form>

          <div className="divider">Or</div>

          <form>
            <button type="submit" formAction={signinWithGoogle} className="btn alt cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="link">{isLogin ? 'Sign Up' : 'Sign In'}</button>
          </p>

          <p className="text-xs text-gray-400 text-center mt-4">
            💡 Tip: Check spam/junk folder if you don’t get the email.
          </p>
        </div>
      </div>
    </div>
  );
}
