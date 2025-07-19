'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  authError: string | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  authError: null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  useEffect(() => {
    const supabase = createClient();
    console.log('Supabase client initialized with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Anon key defined:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Check active session
    const checkSession = async () => {
      try {
        console.log('Checking auth session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error.message);
          setAuthError(error.message);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          console.log('Session found, user authenticated:', session.user.email);
          setUser(session.user);
        } else {
          console.log('No active session found');
          setUser(null);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Unexpected error during session check:', err);
        setAuthError(err instanceof Error ? err.message : 'Unknown authentication error');
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, isLoading, authError }}>
      {children}
    </AuthContext.Provider>
  );
}