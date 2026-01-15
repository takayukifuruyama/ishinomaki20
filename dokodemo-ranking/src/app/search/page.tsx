'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { RankingCard } from '@/components/RankingCard';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { rankings } = useStore();

  // 検索フィルタリング
  const filteredRankings = rankings.filter((ranking) => {
    if (ranking.status !== 'ACTIVE') return false;
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      ranking.title.toLowerCase().includes(query) ||
      ranking.description?.toLowerCase().includes(query) ||
      ranking.rules.toLowerCase().includes(query) ||
      ranking.area.toLowerCase().includes(query) ||
      ranking.prefecture.toLowerCase().includes(query) ||
      ranking.creator.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-md mx-auto px-4 py-4">
        <div className="relative mb-4">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ランキングを検索..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-500">
            {searchQuery.trim()
              ? `「${searchQuery}」の検索結果: ${filteredRankings.length}件`
              : `${filteredRankings.length}件のランキング`}
          </p>
        </div>

        <div className="space-y-4">
          {filteredRankings.length > 0 ? (
            filteredRankings.map((ranking) => (
              <RankingCard key={ranking.id} ranking={ranking} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>該当するランキングがありません</p>
              {searchQuery.trim() && (
                <p className="text-sm mt-1">別のキーワードで検索してみてください</p>
              )}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
