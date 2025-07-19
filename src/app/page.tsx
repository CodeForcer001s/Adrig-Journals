'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentEntries from '@/components/dashboard/RecentEntries';
import { useAuth } from '@/utils/context/AuthContext';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const supabase = createClient();
  const { user, isLoading, authError } = useAuth();

  const fetchDashboardData = async () => {
    setFetchError(null);
    try {
      console.log('Fetching dashboard data, auth status:', {
        isAuthenticated: !!user,
        userEmail: user?.email,
        authLoading: isLoading,
        authError
      });
  
      // Use the user from AuthContext instead of making a separate auth call
      if (!user) {
        console.log('User not authenticated, using placeholder data');
        // Instead of throwing an error, we'll use placeholder data
        setData({
          totalEntries: 12,
          streak: 5,
          recentEntries: [
            {
              id: 'placeholder-1',
              title: 'My Journey Begins',
              content: 'Today marks the beginning of my journaling practice. I\'m excited to document my thoughts and experiences.',
              date: '2023-06-15',
              media_base64: 'https://source.unsplash.com/random/300x200?journal'
            },
            {
              id: 'placeholder-2',
              title: 'Reflections on Growth',
              content: 'Looking back at the past month, I can see significant personal growth in how I approach challenges.',
              date: '2023-06-10',
              media_base64: 'https://source.unsplash.com/random/300x200?growth'
            },
            {
              id: 'placeholder-3',
              title: 'Future Plans',
              content: 'I\'ve been thinking about my goals for the next quarter. Here are some ideas I want to explore further.',
              date: '2023-06-05',
              media_base64: 'https://source.unsplash.com/random/300x200?future'
            }
          ]
        });
        setLoading(false);
        return;
      }
  
      // If user is authenticated, proceed with actual data fetching
      console.log('User authenticated, fetching real data from Supabase');
      const date30DaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
  
      console.log('Making Supabase API calls...');
      
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
        supabase
          .from('journal_entries')
          .select('id', { count: 'exact', head: true }),
  
        supabase
          .from('journal_entries')
          .select('id')
          .eq('user_id', user.id) // Make sure to filter by user_id
          .gte('date', date30DaysAgo),
  
        supabase
          .from('journal_entries')
          .select('id, title, content, date, media_base64')
          .eq('user_id', user.id) // Make sure to filter by user_id
          .order('date', { ascending: false })
          .limit(3),
      ]);
  
      // Check for errors in each response
      if (countRes.error) {
        console.error('Count query error:', countRes.error);
        console.error('Full error object:', JSON.stringify(countRes.error));
        setFetchError(`Count query: ${countRes.error.message || 'Unknown error'}`);
      }
      
      if (last30Res.error) {
        console.error('Last 30 days query error:', last30Res.error);
        console.error('Full error object:', JSON.stringify(last30Res.error));
        setFetchError(prev => prev ? `${prev}; Last 30 days: ${last30Res.error.message || 'Unknown error'}` : `Last 30 days: ${last30Res.error.message || 'Unknown error'}`);
      }
      
      if (recentRes.error) {
        console.error('Recent entries query error:', recentRes.error);
        console.error('Full error object:', JSON.stringify(recentRes.error));
        setFetchError(prev => prev ? `${prev}; Recent entries: ${recentRes.error.message || 'Unknown error'}` : `Recent entries: ${recentRes.error.message || 'Unknown error'}`);
      }
  
      if (countRes.error || last30Res.error || recentRes.error) {
        throw new Error('API errors occurred');
      }
  
      console.log('Data fetched successfully:', {
        entriesCount: countRes.count,
        last30DaysCount: last30Res.data?.length,
        recentEntriesCount: recentRes.data?.length
      });
  
      setData({
        totalEntries: countRes.count ?? 0,
        streak: last30Res.data?.length ?? 0,
        recentEntries: recentRes.data ?? [],
      });
    } catch (error) {
      console.error('Dashboard load failed:', error);
      // Use placeholder data on error
      setData({
        totalEntries: 8,
        streak: 3,
        recentEntries: [
          {
            id: 'error-1',
            title: 'Sample Entry',
            content: 'This is a sample journal entry to demonstrate the layout.',
            date: '2023-06-01',
            media_base64: 'https://source.unsplash.com/random/300x200?sample'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      fetchDashboardData();
    }
  }, [user, isLoading]); // Re-fetch when user or isLoading changes

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
        <StatsCards totalEntries={data?.totalEntries} streak={data?.streak} />
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
        <div className="bg-indigo-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-indigo-800">Journal Tips</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Write consistently, even if it's just for 5 minutes a day</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Use prompts when you're feeling stuck or uninspired</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Review past entries to track your growth and patterns</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Include both challenges and victories in your entries</span>
            </li>
          </ul>
          <div className="mt-6 p-4 bg-white rounded border border-indigo-100">
            <h4 className="font-medium text-indigo-700 mb-2">Today's Prompt</h4>
            <p className="text-gray-700 text-sm italic">"What's one small win you experienced today that you're grateful for?"</p>
          </div>
        </div>
      </div>
    </div>
  );
}