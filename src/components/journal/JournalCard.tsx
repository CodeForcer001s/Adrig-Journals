"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface JournalCardProps {
  id: string;
  title: string;
  date: string;
  content: string;
  media_base64?: string;
}

export default function JournalCard({
  id,
  title,
  date,
  content,
  media_base64,
}: JournalCardProps) {
  const router = useRouter();
  const supabase = createClient();

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this journal entry?');
    if (!confirm) return;

    const { error } = await supabase.from('journal_entries').delete().eq('id', id);
    if (!error) {
      // Refresh the page to show updated list
      router.refresh();
    } else {
      alert('Failed to delete entry');
    }
  };

  const handleEdit = () => {
    router.push(`/journal/${id}/edit`);
  };

  return (
    <div className="group bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-gray-800/20 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-3xl hover:border-gray-700/40 hover:-translate-y-1 flex flex-col">
      {/* Image or Dark Placeholder */}
      <div className="relative">
        {media_base64 ? (
          <img
            src={media_base64}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-gray-600">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Category/Type indicator */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Journal Entry
          </span>
          <button
            onClick={handleEdit}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/50 hover:scale-110 group/edit cursor-pointer"
            title="Edit Entry"
          >
            <svg className="w-4 h-4 text-gray-400 hover:text-gray-200 transition-all duration-300 group-hover/edit:scale-110 group-hover/edit:rotate-12" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white leading-tight group-hover:text-gray-100 transition-colors duration-300">
          {title}
        </h3>

        {/* Date */}
        <p className="text-sm font-medium text-gray-400">
          {formattedDate}
        </p>

        {/* Content Preview */}
        <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 group-hover:text-gray-200 transition-colors duration-300 mt-3 flex-1">
          {content}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Link
            href={`/journal/${id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 shadow-lg hover:shadow-xl group/button"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            Read Entry
          </Link>
          
          <button
            onClick={handleDelete}
            className="cursor-pointer px-4 py-3 rounded-lg text-sm font-semibold text-red-400 bg-gradient-to-r from-red-950/30 to-red-900/30 hover:from-red-900/50 hover:to-red-800/50 border border-red-800/30 hover:border-red-700/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-900/20 group/delete"
            title="Delete Entry"
          >
            <svg
              className="w-4 h-4 transition-all duration-300 group-hover/delete:scale-110 group-hover/delete:rotate-12"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Subtle bottom accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
    </div>
  );
}