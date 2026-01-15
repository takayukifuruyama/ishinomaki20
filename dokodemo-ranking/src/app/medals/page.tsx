'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { AuthModal } from '@/components/AuthModal';
import type { Entry } from '@/types';

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

const getMedalName = (medal: string | null) => {
  switch (medal) {
    case 'GOLD':
      return '金メダル';
    case 'SILVER':
      return '銀メダル';
    case 'BRONZE':
      return '銅メダル';
    default:
      return '';
  }
};

export default function MedalsPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser, rankings } = useStore();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header />

        <main className="max-w-md mx-auto px-4 py-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={40} className="text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">メダルコレクション</h2>
          <p className="text-gray-600 mb-6">
            ログインして獲得したメダルを確認しましょう
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            ログイン / 新規登録
          </button>
        </main>

        <BottomNav />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  // メダルを獲得したエントリーを取得
  const medalEntries: { ranking: typeof rankings[0]; entry: Entry }[] = [];
  rankings.forEach((ranking) => {
    const entry = ranking.entries.find((e) => e.userId === currentUser.id && e.medal);
    if (entry) {
      medalEntries.push({ ranking, entry });
    }
  });

  // メダル別にグループ分け
  const goldMedals = medalEntries.filter((m) => m.entry.medal === 'GOLD');
  const silverMedals = medalEntries.filter((m) => m.entry.medal === 'SILVER');
  const bronzeMedals = medalEntries.filter((m) => m.entry.medal === 'BRONZE');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-md mx-auto px-4 py-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">メダルコレクション</h2>
          <p className="text-gray-600">獲得したメダルの一覧</p>
        </div>

        {/* メダル統計 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl mb-1">🥇</div>
              <div className="text-2xl font-bold text-gray-900">{goldMedals.length}</div>
              <div className="text-xs text-gray-500">金メダル</div>
            </div>
            <div>
              <div className="text-3xl mb-1">🥈</div>
              <div className="text-2xl font-bold text-gray-900">{silverMedals.length}</div>
              <div className="text-xs text-gray-500">銀メダル</div>
            </div>
            <div>
              <div className="text-3xl mb-1">🥉</div>
              <div className="text-2xl font-bold text-gray-900">{bronzeMedals.length}</div>
              <div className="text-xs text-gray-500">銅メダル</div>
            </div>
          </div>
        </div>

        {/* メダル一覧 */}
        {medalEntries.length > 0 ? (
          <div className="space-y-3">
            {medalEntries.map(({ ranking, entry }) => (
              <Link
                key={entry.id}
                href={`/rankings/${ranking.id}`}
                className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{getMedalEmoji(entry.medal)}</div>
                  <div className="flex-grow">
                    <div className="font-medium text-gray-900 mb-1">{ranking.title}</div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="text-blue-600 font-medium">{entry.score}</span>
                      <span>{getMedalName(entry.medal)}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      獲得日: {formatDate(entry.createdAt)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy size={40} className="text-gray-400" />
            </div>
            <p>まだメダルを獲得していません</p>
            <p className="text-sm mt-1">ランキングに参加してメダルを獲得しましょう！</p>
            <Link
              href="/"
              className="inline-block mt-4 text-blue-600 hover:underline"
            >
              ランキングを探す
            </Link>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
