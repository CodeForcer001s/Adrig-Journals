
export default function RecentEntries({ entries }: { entries: any[] }) {
  if (!entries.length) {
    return <p className="text-gray-400">No recent entries found.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-white">Your Recent Entries</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry, idx) => (
          <div key={idx} className="bg-gray-800/50 shadow rounded overflow-hidden border border-gray-700/50">
            <img src={entry.media_base64} alt="" className="w-full h-32 object-cover" />
            <div className="p-4">
              <h4 className="font-semibold text-sm text-white">{entry.title}</h4>
              <p className="text-xs text-gray-400">{entry.date}</p>
              <p className="text-sm text-gray-300 mt-1 line-clamp-2">{entry.content}</p>
              <a href={`/journal/${entry.id}`} className="text-sm text-gray-300 hover:text-white mt-2 hover:underline">Read Entry</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}