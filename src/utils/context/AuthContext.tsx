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
  
  // In the useEffect hook
  useEffect(() => {
    const supabase = createClient();
    
    // Check active session
    const checkSession = async () => {
      try {
        console.log('Checking auth session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error.message);
          setAuthError(error.message);
          setUser(null); // Ensure user is null on error
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
        setUser(null); // Ensure user is null on error
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Listen for auth changes with improved handling
    // Inside the AuthProvider component
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state');
          setUser(null);
          // Force a re-check of the session to ensure we're in sync
          checkSession();
        } else if (event === 'SIGNED_IN') {
          console.log('User signed in, updating state');
          if (session) {
            setUser(session.user);
          }
          // Force a re-check of the session to ensure we're in sync
          checkSession();
        } else if (session) {
          console.log('Session updated:', session.user.email);
          setUser(session.user);
        }
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