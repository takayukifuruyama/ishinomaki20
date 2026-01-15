'use client';

import Link from 'next/link';
import { MapPin, Users } from 'lucide-react';
import type { Ranking } from '@/types';
import { CategoryLabels, CategoryIcons } from '@/types';

interface RankingCardProps {
  ranking: Ranking;
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
      return '';
  }
};

export function RankingCard({ ranking }: RankingCardProps) {
  const topEntries = [...ranking.entries]
    .sort((a, b) => (a.rank || 999) - (b.rank || 999))
    .slice(0, 3);

  return (
    <Link href={`/rankings/${ranking.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {CategoryIcons[ranking.category]} {CategoryLabels[ranking.category]}
          </span>
          <span className="inline-flex items-center text-xs text-gray-500">
            <MapPin size={12} className="mr-1" />
            {ranking.area}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{ranking.title}</h3>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <span className="mr-2">{CategoryIcons[ranking.category]}</span>
            <span>{ranking.creator.name}</span>
          </div>
          <div className="flex items-center">
            <Users size={14} className="mr-1" />
            <span>{ranking.entries.length}人</span>
          </div>
        </div>

        {topEntries.length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <div className="space-y-1">
              {topEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center">
                    <span className="w-6">{getMedalEmoji(entry.medal)}</span>
                    <span className="text-gray-700">{entry.user.name}</span>
                  </div>
                  <span className="text-gray-500">{entry.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
