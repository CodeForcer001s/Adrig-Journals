'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ImagePreview from '@/components/journal/ImagePreview';

export default function EditJournalEntry() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [entry, setEntry] = useState({
    title: '',
    content: '',
    tags: '',
    date: '',
    media_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntry = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setError('Unauthorized');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        setError('Entry not found or access denied.');
      } else {
        // Format tags properly - remove brackets and quotes
        let formattedTags = data.tags || '';
        if (typeof formattedTags === 'string') {
          // Remove brackets and quotes if they exist
          formattedTags = formattedTags.replace(/[\[\]"]+/g, '');
        } else if (Array.isArray(formattedTags)) {
          // Join array into comma-separated string
          formattedTags = formattedTags.join(', ');
        }

        setEntry({
          title: data.title || '',
          content: data.content || '',
          tags: formattedTags,
          date: data.date ? data.date.split('T')[0] : '',
          // Use media_base64 for backward compatibility
          media_url: data.media_url || data.media_base64 || '',
        });
      }

      setLoading(false);
    };

    if (id) fetchEntry();
  }, [id, supabase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (url: string) => {
    setEntry((prev) => ({ ...prev, media_url: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Convert tags to array if needed for API
      const tagArray = entry.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const res = await fetch(`/api/journal/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...entry,
          tags: tagArray,
          // Use media_url as media_base64 for backward compatibility
          media_base64: entry.media_url
        }),
      });

      const contentType = res.headers.get('Content-Type') || '';
      let result: any;

      if (contentType.includes('application/json')) {
        result = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Unexpected response: ${text}`);
      }

      if (!res.ok) {
        throw new Error(result?.error || 'Update failed');
      }

      router.push(`/journal/${id}`);
    } catch (err: any) {
      console.error('Update failed:', err);
      setError(err.message || 'Unexpected error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 text-mutedText">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const renderTags = (tags: string) => {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-gray-800/30 rounded-full text-sm text-gray-300 shadow-inner border border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300"
        >
          {tag}
        </span>
      ));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 rounded-2xl bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-gray-800/30 shadow-xl space-y-6"
    >
      <h2 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
        Edit Journal Entry
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            value={entry.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 hover:bg-gray-800/50 transition-all"
          />

          <input
            type="date"
            name="date"
            value={entry.date}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:border-gray-500 hover:bg-gray-800/50 transition-all"
          />

          <input
            type="text"
            name="tags"
            value={entry.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 hover:bg-gray-800/50 transition-all"
          />

          <div className="flex flex-wrap gap-2 mt-1">
            {renderTags(entry.tags)}
          </div>

          <ImagePreview src={entry.media_url} onChange={handleImageChange} />
        </div>

        <textarea
          name="content"
          value={entry.content}
          onChange={handleChange}
          rows={15}
          placeholder="Write your thoughts..."
          className="w-full h-full px-4 py-3 bg-gray-800/30 border border-gray-700/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 hover:bg-gray-800/50 transition-all"
        />
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {saving ? 'Saving...' : 'Update Entry'}
        </button>

        <button
          type="button"
          onClick={() => router.push(`/journal/${id}`)}
          className="text-gray-400 hover:text-gray-200 underline transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
