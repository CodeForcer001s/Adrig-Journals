import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import JournalCard from "@/components/journal/JournalCard";

export default async function JournalListPage() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/auth");

  // Fetch journal entries for this user
  const { data: entries, error: entriesError } = await supabase
    .from("journal_entries")
    .select("id, title, content, date, media_base64")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Journal</h1>
        <Link
        href="/journal/new"
        className="block py-2 px-4 bg-gradient-to-br from-gray-950 via-black to-gray-900 hover:bg-gray-800/30 text-white font-medium rounded-md shadow-sm border border-gray-700/50 transition-all duration-200"
        >
        + New Journal Entry
        </Link>


      </div>

      {entriesError ? (
        <p className="text-red-600 mt-10">Error occurred while fetching entries: {entriesError.message}</p>
      ) : entries && entries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <JournalCard
              key={entry.id}
              id={entry.id}
              title={entry.title}
              content={entry.content}
              date={entry.date}
              media_base64={entry.media_base64}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <p className="text-gray-400 mb-4">You haven't created any journal entries yet.</p>
          <Link
            href="/journal/new"
            className="inline-block py-2 px-4 bg-gradient-to-br from-gray-950 via-black to-gray-900 hover:bg-gray-800/30 text-white font-medium rounded-md shadow-sm border border-gray-700/50 transition-all duration-200"
          >
            Create Your First Entry
          </Link>
        </div>
      )}
    </div>
  );
}
