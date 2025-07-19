'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import JournalEntrySidebar from '@/components/journal/JournalEntrySidebar';
import ImagePreview from '@/components/journal/ImagePreview';

export default function NewJournalEntry() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [imageURL, setImageURL] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: body,
          tags: tagArray,
          date,
          media_base64: imageURL, // This is now a URL to the image in Supabase storage
        }),
      });

      if (!res.ok) {
        const contentType = res.headers.get('Content-Type');
        const result = contentType?.includes('application/json')
          ? await res.json()
          : await res.text();

        throw new Error(
          typeof result === 'string' ? result : result?.error || 'Unknown error'
        );
      }

      alert('✅ Entry saved!');
      router.push('/journal');
    } catch (err) {
      console.error('❌ Save failed:', err);
      alert(`Save failed: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setTitle('');
    setBody('');
    setTags('');
    setImageURL('');
    alert('Entry cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <div className="text-sm text-gray-400 mb-2">
          <button
            onClick={() => router.back()}
            className="hover:underline hover:text-gray-300 transition"
          >
            &larr; Back to Journal
          </button>
        </div>

        {/* Title Input */}
        <div className="bg-gray-800/40 border border-gray-800/30 backdrop-blur rounded-2xl shadow-md p-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-2 text-lg font-semibold border border-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Body Editor + Image */}
          <div className="flex-1 bg-gray-800/40 border border-gray-800/30 backdrop-blur-md rounded-2xl shadow p-4 space-y-4">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your thoughts here..."
              rows={12}
              className="w-full bg-transparent text-gray-200 placeholder-gray-500 mt-4 px-4 py-3 text-sm border border-gray-700/30 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <ImagePreview src={imageURL} onChange={setImageURL} />
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 bg-gray-800/40 border border-gray-800/30 backdrop-blur-md rounded-2xl shadow px-2 py-12">
            <JournalEntrySidebar
              tags={tags}
              onTagsChange={setTags}
              date={date}
              onDateChange={setDate}
            />
          </div>
        </div>

        {/* Entry Actions */}
        <div className="bg-gray-800/40 border border-gray-800/30 backdrop-blur-md rounded-2xl shadow p-4">
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Delete Entry
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
            >
              {saving ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
