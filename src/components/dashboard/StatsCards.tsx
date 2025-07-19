interface StatsCardsProps {
  totalEntries: number;
}

export default function StatsCards({ totalEntries }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Total Entries Card */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-gray-800/30 rounded-xl p-6 shadow-2xl transition-all duration-300 hover:border-gray-700/50 hover:shadow-3xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gray-600/5 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gray-700/5 rounded-full blur-2xl animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon and label */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700/40 to-gray-800/40 rounded-lg flex items-center justify-center shadow-lg border border-gray-700/30">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Total Entries</h2>
              <div className="w-8 h-0.5 bg-gradient-to-r from-gray-600 to-transparent mt-1 rounded-full" />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-4">
            <p className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2 transition-all duration-300 group-hover:scale-105">
              {totalEntries.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              All time entries written
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gray-600 to-gray-500 rounded-full transition-all duration-1000" 
                   style={{ width: Math.min((totalEntries / 100) * 100, 100) + '%' }} />
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {totalEntries > 0 ? 'Active' : 'Start writing'}
            </span>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700/0 to-gray-800/0 group-hover:from-gray-700/5 group-hover:to-gray-800/5 transition-all duration-500 rounded-xl" />
      </div>

      {/* Quick Actions Card */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-gray-800/30 rounded-xl p-6 shadow-2xl transition-all duration-300 hover:border-gray-700/50 hover:shadow-3xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gray-600/5 rounded-full blur-2xl animate-pulse delay-500" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gray-700/5 rounded-full blur-2xl animate-pulse delay-1500" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700/40 to-gray-800/40 rounded-lg flex items-center justify-center shadow-lg border border-gray-700/30">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Quick Actions
              </h3>
              <div className="w-12 h-0.5 bg-gradient-to-r from-gray-600 to-transparent mt-1 rounded-full" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Create New Entry Button */}
            <a 
              href="/journal/new" 
              className="group/btn flex items-center justify-center gap-3 w-full px-4 py-3.5 bg-gradient-to-r from-gray-700/80 to-gray-800/80 hover:from-gray-600 hover:to-gray-700 border border-gray-700/30 hover:border-gray-600/30 rounded-lg text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 relative overflow-hidden"
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/0 to-gray-700/0 group-hover/btn:from-gray-600/20 group-hover/btn:to-gray-700/20 transition-all duration-500" />
              
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-600/50 rounded-full flex items-center justify-center transition-all duration-300 group-hover/btn:bg-gray-500/60 group-hover/btn:rotate-90">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <span className="transition-all duration-300 group-hover/btn:translate-x-1">
                  Create New Entry
                </span>
                <svg className="w-4 h-4 opacity-60 transition-all duration-300 group-hover/btn:opacity-100 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </a>

            {/* Edit Profile Button */}
            <a 
              href="/profile" 
              className="group/btn flex items-center justify-center gap-3 w-full px-4 py-3.5 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/30 rounded-lg text-gray-300 hover:text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden"
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700/0 to-gray-800/0 group-hover/btn:from-gray-700/10 group-hover/btn:to-gray-800/10 transition-all duration-500" />
              
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-700/50 rounded-full flex items-center justify-center transition-all duration-300 group-hover/btn:bg-gray-600/60">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="transition-all duration-300 group-hover/btn:translate-x-1">
                  Edit Your Profile
                </span>
                <svg className="w-4 h-4 opacity-40 transition-all duration-300 group-hover/btn:opacity-70 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </a>
          </div>

          {/* Quick stats footer */}
          <div className="mt-6 pt-4 border-t border-gray-800/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-pulse" />
                Quick access
              </span>
              <span className="text-gray-500">Ready to write</span>
            </div>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700/0 to-gray-800/0 group-hover:from-gray-700/5 group-hover:to-gray-800/5 transition-all duration-500 rounded-xl" />
      </div>
    </div>
  );
}