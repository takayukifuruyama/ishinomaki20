'use client';

import { useStore } from '@/store/useStore';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { RankingCard } from '@/components/RankingCard';
import { AreaFilter } from '@/components/AreaFilter';
import { CategoryFilter } from '@/components/CategoryFilter';

export default function HomePage() {
  const { rankings, selectedArea, selectedCategory } = useStore();

  // フィルタリング
  const filteredRankings = rankings.filter((ranking) => {
    if (ranking.status !== 'ACTIVE') return false;
    if (selectedArea && ranking.area !== selectedArea) return false;
    if (selectedCategory && ranking.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-md mx-auto px-4 py-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">地域のランキングを探そう</p>
          <AreaFilter />
        </div>

        <div className="mb-4">
          <CategoryFilter />
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-500">{filteredRankings.length}件のランキング</p>
        </div>

        <div className="space-y-4">
          {filteredRankings.length > 0 ? (
            filteredRankings.map((ranking) => (
              <RankingCard key={ranking.id} ranking={ranking} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>該当するランキングがありません</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
