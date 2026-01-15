'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Users, Calendar, Flag, QrCode, Pencil } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { BottomNav } from '@/components/BottomNav';
import { EntryCard } from '@/components/EntryCard';
import { JoinRankingModal } from '@/components/JoinRankingModal';
import { QRCodeModal } from '@/components/QRCodeModal';
import { AuthModal } from '@/components/AuthModal';
import { CategoryLabels, CategoryIcons } from '@/types';
import type { Entry } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RankingDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const { rankings, currentUser } = useStore();
  const ranking = rankings.find((r) => r.id === resolvedParams.id);

  if (!ranking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">ランキングが見つかりません</p>
          <Link href="/" className="text-blue-600 hover:underline">
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  const sortedEntries = [...ranking.entries].sort((a, b) => (a.rank || 999) - (b.rank || 999));
  const userEntry = currentUser
    ? ranking.entries.find((e) => e.userId === currentUser.id)
    : null;
  const isCreator = currentUser?.id === ranking.creatorId;

  const handleJoinClick = () => {
    if (!currentUser) {
      setShowAuthModal(true);
    } else {
      setShowJoinModal(true);
    }
  };

  const handleEntryClick = (entry: Entry) => {
    if (currentUser && entry.userId === currentUser.id && !entry.isVerified) {
      setSelectedEntry(entry);
      setShowQRModal(true);
    }
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center">
          <Link href="/" className="text-gray-600 hover:text-gray-900 mr-3">
            <ArrowLeft size={24} />
          </Link>
          <span className="text-sm text-gray-600">一覧に戻る</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
            {CategoryIcons[ranking.category]} {CategoryLabels[ranking.category]}
          </span>

          <h1 className="text-xl font-bold text-gray-900 mb-2">{ranking.title}</h1>

          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin size={14} className="mr-1" />
            <span>{ranking.area}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 pb-4 border-b border-gray-100">
            <div className="flex items-center">
              <span className="mr-2">{CategoryIcons[ranking.category]}</span>
              <span>{ranking.creator.name}</span>
            </div>
            <div className="flex items-center">
              <Users size={14} className="mr-1" />
              <span>{ranking.entries.length}人</span>
            </div>
          </div>

          <div className="py-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Flag size={14} className="mr-1" />
              ルール
            </h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{ranking.rules}</p>
            {ranking.deadline && (
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <Calendar size={14} className="mr-1" />
                <span>締切: {formatDeadline(ranking.deadline)}</span>
              </div>
            )}
          </div>

          {isCreator ? (
            <Link
              href={`/rankings/${ranking.id}/edit`}
              className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium text-center hover:bg-gray-200 transition-colors"
            >
              <Pencil size={16} className="inline mr-2" />
              このランキングを編集
            </Link>
          ) : userEntry ? (
            <button
              onClick={() => {
                setSelectedEntry(userEntry);
                setShowQRModal(true);
              }}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <QrCode size={20} />
              QR承認を取得する
            </button>
          ) : (
            <button
              onClick={handleJoinClick}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              🏆 このランキングに参加する
            </button>
          )}
        </div>

        <div className="mb-3">
          <h2 className="text-sm font-medium text-gray-700 flex items-center gap-1">
            🏅 現在のランキング
          </h2>
        </div>

        <div className="space-y-3">
          {sortedEntries.length > 0 ? (
            sortedEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onClick={
                  currentUser?.id === entry.userId
                    ? () => handleEntryClick(entry)
                    : undefined
                }
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>まだ参加者がいません</p>
              <p className="text-sm mt-1">最初の参加者になりましょう！</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />

      <JoinRankingModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        ranking={ranking}
      />

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

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="register"
      />
    </div>
  );
}
