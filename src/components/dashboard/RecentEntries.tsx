export default function RecentEntries({ entries }: { entries: any[] }) {
  if (!entries.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <p className="text-gray-400 text-center">No journal entries found.</p>
        <p className="text-gray-500 text-sm text-center mt-2">Create your first entry to get started</p>
      </div>
    );
  }

  const formattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        Your Recent Entries
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {entries.map((entry, idx) => (
          <div 
            key={entry.id || idx} 
            className="group bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-gray-800/20 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-gray-700/40 hover:-translate-y-1 flex flex-col"
          >
            {/* Image or Dark Placeholder */}
            <div className="relative">
              {entry.media_base64 ? (
                <img 
                  src={entry.media_base64} 
                  alt={entry.title} 
                  className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-gray-600">
                    <svg className="w-10 h-10 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              {/* Category indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Recent
                </span>
                <div className="w-6 h-6 rounded-full bg-gray-800/60 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500/60"></div>
                </div>
              </div>

              {/* Title */}
              <h4 className="font-bold text-base text-white leading-tight group-hover:text-gray-100 transition-colors duration-300 mb-2">
                {entry.title}
              </h4>

              {/* Date */}
              <p className="text-xs font-medium text-gray-400 mb-3">
                {formattedDate(entry.date)}
              </p>

              {/* Content Preview */}
              <p className="text-sm text-gray-300 leading-relaxed line-clamp-2 group-hover:text-gray-200 transition-colors duration-300 flex-1 mb-4">
                {entry.content}
              </p>

              {/* Action Link */}
              <a 
                href={`/journal/${entry.id}`} 
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 w-full rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-gray-700/80 to-gray-800/80 hover:from-gray-600 hover:to-gray-700 border border-gray-600/20 hover:border-gray-500/40 transition-all duration-300 shadow-md hover:shadow-lg group/button"
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
              </a>
            </div>

            {/* Bottom accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700/60 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}