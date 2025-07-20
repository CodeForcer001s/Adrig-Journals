/**
 * Utility function to completely clear all Supabase-related data from the browser
 */
export function clearSupabaseData() {
  // Clear localStorage
  if (typeof window !== 'undefined') {
    // Clear all Supabase-related items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') || key.includes('supabase')) {
        localStorage.removeItem(key);
      }
    });
    
    // Also clear session storage
    Object.keys(sessionStorage || {}).forEach(key => {
      if (key.startsWith('sb-') || key.includes('supabase')) {
        sessionStorage.removeItem(key);
      }
    });
  }
  
  // Clear cookies related to Supabase
  if (typeof document !== 'undefined') {
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      if (name && (name.startsWith('sb-') || name.includes('supabase'))) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
  }
}