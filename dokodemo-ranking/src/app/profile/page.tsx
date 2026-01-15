'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogOut, User, Pencil, QrCode, Check, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { BottomNav } from '@/components/BottomNav';
import { AuthModal } from '@/components/AuthModal';
import { QRCodeModal } from '@/components/QRCodeModal';
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

export default function ProfilePage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'participating' | 'created'>('participating');
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const { currentUser, setCurrentUser, rankings } = useStore();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-md mx-auto px-4 py-3">
            <h1 className="text-lg font-bold text-gray-900">マイページ</h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8 text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">ログインしてください</h2>
          <p className="text-gray-600 mb-6">
            マイページを表示するにはログインが必要です
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

  // 参加しているランキングとエントリーを取得
  const participatingEntries: { ranking: typeof rankings[0]; entry: Entry }[] = [];
  rankings.forEach((ranking) => {
    const entry = ranking.entries.find((e) => e.userId === currentUser.id);
    if (entry) {
      participatingEntries.push({ ranking, entry });
    }
  });

  // 作成したランキング
  const createdRankings = rankings.filter((r) => r.creatorId === currentUser.id);

  // 統計情報
  const totalParticipating = participatingEntries.length;
  const totalVerified = participatingEntries.filter((p) => p.entry.isVerified).length;
  const medals = {
    gold: participatingEntries.filter((p) => p.entry.medal === 'GOLD').length,
    silver: participatingEntries.filter((p) => p.entry.medal === 'SILVER').length,
    bronze: participatingEntries.filter((p) => p.entry.medal === 'BRONZE').length,
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleShowQR = (entry: Entry) => {
    setSelectedEntry(entry);
    setShowQRModal(true);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold text-gray-900">マイページ</h1>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
          >
            <LogOut size={16} />
            ログアウト
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        {/* プロフィールカード */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={28} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{currentUser.name}</h2>
                <p className="text-sm text-gray-500">
                  参加日: {formatDate(currentUser.createdAt)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50 rounded-lg py-3">
                <div className="text-2xl font-bold text-gray-900">{totalParticipating}</div>
                <div className="text-xs text-gray-500">参加</div>
              </div>
              <div className="bg-gray-50 rounded-lg py-3">
                <div className="text-2xl font-bold text-gray-900">{totalVerified}</div>
                <div className="text-xs text-gray-500">認証</div>
              </div>
              <div className="bg-gray-50 rounded-lg py-3">
                <div className="text-lg font-bold text-gray-900">
                  {medals.gold > 0 && <span>🥇{medals.gold}</span>}
                  {medals.silver > 0 && <span>🥈{medals.silver}</span>}
                  {medals.bronze > 0 && <span>🥉{medals.bronze}</span>}
                  {medals.gold === 0 && medals.silver === 0 && medals.bronze === 0 && '-'}
                </div>
                <div className="text-xs text-gray-500">メダル</div>
              </div>
            </div>
          </div>
        </div>

        {/* タブ */}
        <div className="bg-white border-b border-gray-200 px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('participating')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'participating'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              参加中 ({participatingEntries.length})
            </button>
            <button
              onClick={() => setActiveTab('created')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'created'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              作成した ({createdRankings.length})
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="px-4 py-4 space-y-3">
          {activeTab === 'participating' ? (
            participatingEntries.length > 0 ? (
              participatingEntries.map(({ ranking, entry }) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl border border-gray-100 p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      href={`/rankings/${ranking.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600 flex items-center gap-1"
                    >
                      {ranking.title}
                      {getMedalEmoji(entry.medal) && (
                        <span>{getMedalEmoji(entry.medal)}</span>
                      )}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                    <span className="font-medium text-blue-600">{entry.score}</span>
                    <span>({entry.rank}位)</span>
                    {entry.isVerified ? (
                      <span className="inline-flex items-center text-green-600">
                        <Check size={14} className="mr-1" />
                        認証済
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-yellow-600">
                        <Clock size={14} className="mr-1" />
                        承認待ち ({entry.approvals.length}/3)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>参加日: {formatDate(entry.createdAt)}</span>
                    <div className="flex gap-2">
                      {!entry.isVerified && (
                        <button
                          onClick={() => handleShowQR(entry)}
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <QrCode size={14} />
                          QR承認
                        </button>
                      )}
                      <Link
                        href={`/profile/entries/${entry.id}/edit`}
                        className="text-gray-600 hover:text-gray-700 flex items-center gap-1"
                      >
                        <Pencil size={14} />
                        編集
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>参加しているランキングはありません</p>
                <Link href="/" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                  ランキングを探す
                </Link>
              </div>
            )
          ) : createdRankings.length > 0 ? (
            createdRankings.map((ranking) => (
              <Link
                key={ranking.id}
                href={`/rankings/${ranking.id}`}
                className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 mb-1">{ranking.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{ranking.entries.length}人参加</span>
                  <span>作成日: {formatDate(ranking.createdAt)}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>作成したランキングはありません</p>
              <Link href="/rankings/create" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                ランキングを作成する
              </Link>
            </div>
          )}
        </div>
      </main>

      <BottomNav />

      {selectedEntry && (
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => {
            setShowQRModal(false);
            setSelectedEntry(null);
          }}
          entry={selectedEntry}
        />
      )}
    </div>
  );
}
