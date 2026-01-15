'use client';

import { Check, Clock } from 'lucide-react';
import type { Entry } from '@/types';

interface EntryCardProps {
  entry: Entry;
  onClick?: () => void;
}

const getMedalEmoji = (medal: string | null) => {
  switch (medal) {
    case 'GOLD':
      return '🥇';
    case 'SILVER':
      return '🥈';
    case 'BRONZE':
      return '🥉';
    default:
      return null;
  }
};

export function EntryCard({ entry, onClick }: EntryCardProps) {
  const medalEmoji = getMedalEmoji(entry.medal);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-4 ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      } ${
        entry.rank && entry.rank <= 3
          ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-white'
          : 'border-gray-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
          {medalEmoji ? (
            <span className="text-3xl">{medalEmoji}</span>
          ) : (
            <span className="text-xl font-bold text-gray-400">#{entry.rank}</span>
          )}
        </div>

        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{entry.user.name}</span>
            {entry.isVerified ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                <Check size={12} className="mr-1" />
                認証済み
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">
                <Clock size={12} className="mr-1" />
                承認待ち ({entry.approvals.length}/3)
              </span>
            )}
          </div>
          <div className="text-lg font-bold text-blue-600 mt-1">{entry.score}</div>
          {entry.comment && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{entry.comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}
