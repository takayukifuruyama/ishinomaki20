'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { BottomNav } from '@/components/BottomNav';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditRankingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { rankings, currentUser, updateRanking, deleteRanking } = useStore();
  const ranking = rankings.find((r) => r.id === resolvedParams.id);

  const [title, setTitle] = useState('');
  const [rules, setRules] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (ranking) {
      setTitle(ranking.title);
      setRules(ranking.rules);
      if (ranking.deadline) {
        const date = new Date(ranking.deadline);
        setDeadline(date.toISOString().split('T')[0]);
      }
    }
  }, [ranking]);

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

  if (!currentUser || currentUser.id !== ranking.creatorId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">編集権限がありません</p>
          <Link href={`/rankings/${ranking.id}`} className="text-blue-600 hover:underline">
            ランキングに戻る
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateRanking(ranking.id, {
      title: title.trim(),
      rules: rules.trim(),
      deadline: deadline ? new Date(deadline + 'T23:59:59Z').toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    });

    router.push(`/rankings/${ranking.id}`);
  };

  const handleDelete = () => {
    deleteRanking(ranking.id);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href={`/rankings/${ranking.id}`} className="text-gray-600 hover:text-gray-900 mr-3">
              <ArrowLeft size={24} />
            </Link>
            <span className="font-medium">ランキングを編集</span>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ルール
            </label>
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              締切日
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Link
              href={`/rankings/${ranking.id}`}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium text-center hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              保存する
            </button>
          </div>
        </form>
      </main>

      <BottomNav />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">ランキングを削除</h3>
            <p className="text-gray-600 mb-6">
              このランキングを削除しますか？この操作は取り消せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
