'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link'; // Import Link from Next.js

export default function JournalEntryPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setEntry(data);
        setIsOwner(data.user_id === user?.id);
      }

      setLoading(false);
    };

    fetchEntry();
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this journal entry?');
    if (!confirm) return;

    const { error } = await supabase.from('journal_entries').delete().eq('id', id);
    if (!error) {
      router.push('/journal');
    } else {
      alert('Failed to delete entry');
    }
  };

  if (loading)
    return (
      <div className="p-4 text-white bg-gradient-to-br from-gray-950 via-black to-gray-900 min-h-screen">
        Loading...
      </div>
    );
  if (!entry)
    return (
      <div className="p-4 text-red-500 bg-gradient-to-br from-gray-950 via-black to-gray-900 min-h-screen">
        Journal entry not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back to Blogs Link */}
        <div className="mb-6">
          <Link href="/journal" className="text-gray-400 hover:text-gray-200 transition underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Blogs
          </Link>
        </div>

        {/* Title Card */}
        <div className="rounded-2xl border border-gray-800/30 bg-gray-800/30 p-6 shadow-md hover:shadow-lg transition">
          <h1 className="text-3xl font-bold text-white hover:text-gray-300 transition">
            {entry.title}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            {new Date(entry.date).toLocaleDateString()}
          </p>
        </div>

        {entry.tags && (
          <div className="flex flex-wrap gap-3 p-4 rounded-2xl bg-gray-800/30 border border-gray-800/30 shadow-inner">
            {(Array.isArray(entry.tags)
              ? entry.tags
              : (() => {
                  try {
                    const parsed = JSON.parse(entry.tags);
                    return Array.isArray(parsed) ? parsed : entry.tags.split(',');
                  } catch {
                    return entry.tags.split(',');
                  }
                })()
            ).map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-sm text-gray-300 bg-gray-900 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.05),inset_-1px_-1px_5px_rgba(0,0,0,0.5)] hover:shadow-[0_0_10px_rgba(0_0_0_0.3)] hover:text-white transition-all"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Image Card */}
        {entry.media_base64 && (
          <div className="rounded-2xl border border-gray-800/30 bg-gray-800/30 p-2 shadow-md hover:shadow-lg transition">
            <img
              src={entry.media_base64}
              alt="Journal visual"
              className="rounded-xl max-h-96 w-full object-cover"
            />
          </div>
        )}

        {/* Content Card */}
        <div className="rounded-2xl border border-gray-800/30 bg-gray-800/30 p-6 shadow-md hover:shadow-lg transition whitespace-pre-wrap text-gray-300">
          {entry.content}
        </div>

        {/* Action Buttons Card */}
        {isOwner && (
          <div className=" rounded-2xl border border-gray-800/30 bg-gray-800/30 p-6 shadow-md flex gap-4 hover:shadow-lg transition">
            <button
              onClick={() => router.push(`/journal/${id}/edit`)}
              className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}