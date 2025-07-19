export default function JournalEntrySidebar({
    tags,
    onTagsChange,
    date,
    onDateChange,
  }: {
    tags: string;
    onTagsChange: (val: string) => void;
    date: string;
    onDateChange: (val: string) => void;
  }) {
    return (
      <aside className="bg-gradient-to-br from-gray-800/40 to-gray-800/30 p-4 border border-gray-800/30 rounded-lg shadow-md space-y-4 w-full md:w-[300px] backdrop-blur-md h-64">
        <h2 className="font-semibold text-lg text-white">Entry Details</h2>
        <div>
          <label className="text-sm font-medium text-gray-300">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => onTagsChange(e.target.value)}
            placeholder="Meditation, Peace, Mindfulness"
            className="mt-1 w-full bg-gray-700/40 border border-gray-700/50 px-3 py-2 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600/30"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="mt-1 w-full bg-gray-700/40 border border-gray-700/50 px-3 py-2 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600/30"
          />
        </div>
      </aside>
    );
  }
  