'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Camera, AlertTriangle, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { BottomNav } from '@/components/BottomNav';
import type { Entry, Ranking } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditEntryPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { rankings, currentUser, updateEntry, deleteEntry } = useStore();

  const [score, setScore] = useState('');
  const [comment, setComment] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // エントリーを探す
  let foundEntry: Entry | null = null;
  let foundRanking: Ranking | null = null;

  for (const ranking of rankings) {
    const entry = ranking.entries.find((e) => e.id === resolvedParams.id);
    if (entry) {
      foundEntry = entry;
      foundRanking = ranking;
      break;
    }
  }

  useEffect(() => {
    if (foundEntry) {
      setScore(foundEntry.score);
      setComment(foundEntry.comment || '');
    }
  }, [foundEntry?.id]);

  if (!foundEntry || !foundRanking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">エントリーが見つかりません</p>
          <Link href="/profile" className="text-blue-600 hover:underline">
            マイページに戻る
          </Link>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.id !== foundEntry.userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">編集権限がありません</p>
          <Link href="/profile" className="text-blue-600 hover:underline">
            マイページに戻る
          </Link>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidenceFile(file);
    }
  };

  const parseScoreValue = (scoreStr: string): number | undefined => {
    const timeMatch = scoreStr.match(/(\d+)分(\d+)秒?/);
    if (timeMatch) {
      return parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2]);
    }

    const secMatch = scoreStr.match(/(\d+)秒/);
    if (secMatch) {
      return parseInt(secMatch[1]);
    }

    const numMatch = scoreStr.match(/(\d+)/);
    if (numMatch) {
      return parseInt(numMatch[1]);
    }

    return undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updates: Partial<Entry> = {
      score: score.trim(),
      scoreValue: parseScoreValue(score),
      comment: comment.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    // エビデンスを更新した場合はQR承認をリセット
    if (evidenceFile) {
      updates.evidenceUrl = URL.createObjectURL(evidenceFile);
      updates.isVerified = false;
      updates.approvals = [];
    }

    updateEntry(foundRanking!.id, foundEntry!.id, updates);
    router.push('/profile');
  };

  const handleDelete = () => {
    deleteEntry(foundRanking!.id, foundEntry!.id);
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/profile" className="text-gray-600 hover:text-gray-900 mr-3">
              <ArrowLeft size={24} />
            </Link>
            <span className="font-medium">エントリーを編集</span>
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
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-700 font-medium">{foundRanking.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              スコア / 記録
            </label>
            <input
              type="text"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              エビデンス更新
            </label>
            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {evidenceFile ? (
                <div className="text-green-600">
                  <Camera size={24} className="mx-auto mb-2" />
                  <span className="text-sm">{evidenceFile.name}</span>
                </div>
              ) : (
                <div className="text-gray-500">
                  <Camera size={24} className="mx-auto mb-2" />
                  <span className="text-sm">新しい写真をアップロード</span>
                </div>
              )}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              コメント（任意）
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">
              エビデンスを更新すると、QR承認がリセットされます
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Link
              href="/profile"
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium text-center hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              更新する
            </button>
          </div>
        </form>
      </main>

      <BottomNav />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">参加を取り消す</h3>
            <p className="text-gray-600 mb-6">
              このランキングへの参加を取り消しますか？この操作は取り消せません。
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
                取り消す
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
