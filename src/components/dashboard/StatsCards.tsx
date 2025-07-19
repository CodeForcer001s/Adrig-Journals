  
interface StatsCardsProps {
  totalEntries: number;
  streak: number;
}

export default function StatsCards({ totalEntries, streak }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      <div className="bg-gray-800/50 p-4 shadow rounded border border-gray-700/50">
        <h2 className="text-sm text-gray-400">Total Entries</h2>
        <p className="text-2xl font-semibold text-white">{totalEntries}</p>
        <p className="text-sm text-gray-400">All time entries written</p>
      </div>
      <div className="bg-gray-800/50 p-4 shadow rounded border border-gray-700/50">
        <h2 className="text-sm text-gray-400">Last 30 Day Streak</h2>
        <p className="text-2xl font-semibold text-white">{streak} Days</p>
        <p className="text-sm text-gray-400">Consecutive journaling days</p>
      </div>
      <div className="bg-gray-800/50 p-4 shadow rounded border border-gray-700/50">
        <h3 className="font-semibold text-lg mb-3 text-white">Quick Actions</h3>
        <a href="/journal/new" className="btn w-full bg-gray-700 hover:bg-gray-600 text-white mb-2 text-center block border border-gray-700/30 hover:border-gray-600/30">
          + Create New Entry
        </a>
        <a href="/profile" className="btn w-full border border-gray-700/50 hover:border-gray-600/30 text-gray-300 hover:text-white text-center block hover:bg-gray-800/30">
          Edit Your Profile
        </a>
        <p className="text-xs text-gray-400 mt-4">
          Need inspiration? Write about your aspirations for the next month.
        </p>
      </div>
    </div>
  );
}