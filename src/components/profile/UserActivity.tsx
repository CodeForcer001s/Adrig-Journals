'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  media_base64?: string;
  created_at: string;
}

export default function UserActivity() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserEntries = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          setError('You must be logged in to view your activity');
          setLoading(false);
          return;
        }

        // Fetch journal entries for this user
        const { data, error: entriesError } = await supabase
          .from('journal_entries')
          .select('id, title, content, date, media_base64, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (entriesError) {
          setError(`Error fetching entries: ${entriesError.message}`);
        } else {
          setEntries(data || []);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEntries();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse text-gray-400">Loading your activity...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 text-red-300">
        {error}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 mb-4">You haven't created any journal entries yet.</p>
        <Link 
          href="/journal/new" 
          className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition"
        >
          Create Your First Entry
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Your Journal Activity</h2>
      <div className="space-y-4">
        {entries.map((entry) => (
          <div 
            key={entry.id} 
            className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 hover:border-gray-600/30 transition bg-gradient-to-r from-gray-700/40 to-gray-800/40"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-white">{entry.title}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <Link 
                href={`/journal/${entry.id}`}
                className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition"
              >
                View
              </Link>
            </div>
            <p className="mt-2 text-sm text-gray-300 line-clamp-2">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}