import React from 'react';
import { Source } from '../types';

interface SourceListProps {
  sources: Source[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (sources.length === 0) return null;

  // Deduplicate sources by URL
  // Explicitly type the Map and Array to prevent 'unknown' inference issues
  const uniqueSources: Source[] = Array.from(
    new Map<string, Source>(sources.map((item) => [item.url, item])).values()
  );

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">แหล่งข้อมูลอ้างอิง (Sources)</h3>
      <div className="flex flex-wrap gap-2">
        {uniqueSources.slice(0, 5).map((source, index) => (
          <a
            key={index}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-full transition-colors truncate max-w-[200px]"
            title={source.title}
          >
            {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SourceList;