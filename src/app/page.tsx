'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentEntries from '@/components/dashboard/RecentEntries';
import { useAuth } from '@/utils/context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const supabase = createClient();
  const { user, isLoading, authError } = useAuth();

  const fetchDashboardData = async () => {
    setFetchError(null);
    try {
      // If user is not authenticated, don't fetch any data
      if (!user) {
        setLoading(false);
        return;
      }
  
      // If user is authenticated, proceed with actual data fetching
      const date30DaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
  
      // First check if the table exists
      const { error: tableCheckError } = await supabase
        .from('journal_entries')
        .select('id', { count: 'exact', head: true })
        .limit(1);
        
      if (tableCheckError) {
        console.error('Table check error:', tableCheckError);
        setFetchError(`Table check error: ${tableCheckError.message || 'Unknown error'}`);
        throw new Error('Table check failed');
      }
      
      const [countRes, last30Res, recentRes] = await Promise.all([
        // Fixed: Filter by user_id for total entries count
        supabase
          .from('journal_entries')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
  
        supabase
          .from('journal_entries')
          .select('id')
          .eq('user_id', user.id)
          .gte('date', date30DaysAgo),
  
        supabase
          .from('journal_entries')
          .select('id, title, content, date, media_base64')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(3),
      ]);
  
      // Check for errors in each response
      if (countRes.error) {
        console.error('Count query error:', countRes.error);
        setFetchError(`Count query: ${countRes.error.message || 'Unknown error'}`);
      }
      
      if (last30Res.error) {
        console.error('Last 30 days query error:', last30Res.error);
        setFetchError(prev => prev ? `${prev}; Last 30 days: ${last30Res.error.message || 'Unknown error'}` : `Last 30 days: ${last30Res.error.message || 'Unknown error'}`);
      }
      
      if (recentRes.error) {
        console.error('Recent entries query error:', recentRes.error);
        setFetchError(prev => prev ? `${prev}; Recent entries: ${recentRes.error.message || 'Unknown error'}` : `Recent entries: ${recentRes.error.message || 'Unknown error'}`);
      }
  
      if (countRes.error || last30Res.error || recentRes.error) {
        throw new Error('API errors occurred');
      }
  
      setData({
        totalEntries: countRes.count ?? 0,
        streak: last30Res.data?.length ?? 0,
        recentEntries: recentRes.data ?? [],
      });
    } catch (error) {
      console.error('Dashboard load failed:', error);
      setFetchError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      fetchDashboardData();
    }
  }, [user, isLoading]);

  // Show authentication message if user is not logged in
  if (!user && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mb-6 shadow-xl">
          <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Authentication Required</h2>
        <p className="text-gray-400 max-w-md mb-6">You need to be logged in to view your journal dashboard and entries.</p>
        <Link 
          href="/auth" 
          className="px-5 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition shadow-lg hover:shadow-xl border border-gray-700/30 hover:border-gray-600/30"
        >
          Sign In or Create Account
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <DashboardHeader />
      
      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Authentication Error:</strong>
          <span className="block sm:inline"> {authError}</span>
        </div>
      )}
      
      {fetchError && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Data Fetch Error:</strong>
          <span className="block sm:inline"> {fetchError}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
          <div className="bg-gray-200 h-24 rounded"></div>
          <div className="bg-gray-200 h-24 rounded"></div>
          <div className="bg-gray-200 h-24 rounded"></div>
        </div>
      ) : (
        <StatsCards totalEntries={data?.totalEntries} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 h-40 rounded" />
              ))}
            </div>
          ) : (
            <RecentEntries entries={data?.recentEntries || []} />
          )}
        </div>
        {/* Remove Journal Tips section */}
      </div>
    </div>
  );
}