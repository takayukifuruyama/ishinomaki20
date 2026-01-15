'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { Check, X, AlertCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AuthModal } from '@/components/AuthModal';
import type { QRApproval, Entry, Ranking } from '@/types';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default function QRApprovePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [error, setError] = useState('');

  const { rankings, currentUser, addApproval } = useStore();

  // エントリーを探す
  let foundEntry: Entry | null = null;
  let foundRanking: Ranking | null = null;

  for (const ranking of rankings) {
    const entry = ranking.entries.find((e) => e.id === resolvedParams.code);
    if (entry) {
      foundEntry = entry;
      foundRanking = ranking;
      break;
    }
  }

  const handleApprove = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (!foundEntry || !foundRanking) {
      setError('エントリーが見つかりません');
      return;
    }

    // 自己承認チェック
    if (foundEntry.userId === currentUser.id) {
      setError('自分自身のエントリーは承認できません');
      return;
    }

    // 既に承認済みかチェック
    const existingApproval = foundEntry.approvals.find(
      (a) => a.approverId === currentUser.id
    );
    if (existingApproval) {
      setError('既に承認済みです');
      return;
    }

    // 承認を追加
    const newApproval: QRApproval = {
      id: `approval${Date.now()}`,
      createdAt: new Date().toISOString(),
      entryId: foundEntry.id,
      approverId: currentUser.id,
      approver: currentUser,
      recipientId: foundEntry.userId,
    };

    addApproval(foundRanking.id, foundEntry.id, newApproval);
    setIsApproved(true);
  };

  if (!foundEntry || !foundRanking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">エントリーが見つかりません</h1>
          <p className="text-gray-600 mb-6">
            QRコードが無効か、既に削除されている可能性があります。
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  if (isApproved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">承認完了!</h1>
          <p className="text-gray-600 mb-6">
            {foundEntry.user.name}さんのエントリーを承認しました。
          </p>
          <div className="space-y-3">
            <Link
              href={`/rankings/${foundRanking.id}`}
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              ランキングを見る
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">QR承認リクエスト</h1>
          <p className="text-gray-600">以下のエントリーを承認しますか？</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="text-sm text-gray-500 mb-1">ランキング</div>
          <div className="font-medium text-gray-900 mb-3">{foundRanking.title}</div>

          <div className="text-sm text-gray-500 mb-1">参加者</div>
          <div className="font-medium text-gray-900 mb-3">{foundEntry.user.name}</div>

          <div className="text-sm text-gray-500 mb-1">スコア</div>
          <div className="text-lg font-bold text-blue-600">{foundEntry.score}</div>

          {foundEntry.comment && (
            <>
              <div className="text-sm text-gray-500 mb-1 mt-3">コメント</div>
              <div className="text-gray-700">{foundEntry.comment}</div>
            </>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-4 text-center">
          承認状況: {foundEntry.approvals.length}/3
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium text-center hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <X size={20} />
            キャンセル
          </Link>
          <button
            onClick={handleApprove}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={20} />
            承認する
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
}
