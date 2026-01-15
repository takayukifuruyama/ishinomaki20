'use client';

import { useState } from 'react';
import { X, Camera, Lightbulb } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Ranking, Entry } from '@/types';

interface JoinRankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ranking: Ranking;
}

export function JoinRankingModal({ isOpen, onClose, ranking }: JoinRankingModalProps) {
  const [score, setScore] = useState('');
  const [comment, setComment] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const { currentUser, addEntry } = useStore();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidenceFile(file);
    }
  };

  const parseScoreValue = (scoreStr: string): number | undefined => {
    // タイム形式 (例: "5分30秒" -> 330)
    const timeMatch = scoreStr.match(/(\d+)分(\d+)秒?/);
    if (timeMatch) {
      return parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2]);
    }

    // 秒のみ (例: "45秒" -> 45)
    const secMatch = scoreStr.match(/(\d+)秒/);
    if (secMatch) {
      return parseInt(secMatch[1]);
    }

    // 数値 + 単位 (例: "256いいね" -> 256)
    const numMatch = scoreStr.match(/(\d+)/);
    if (numMatch) {
      return parseInt(numMatch[1]);
    }

    return undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('ログインが必要です');
      return;
    }

    if (!score.trim()) {
      setError('スコアを入力してください');
      return;
    }

    if (!evidenceFile) {
      setError('エビデンス画像を選択してください');
      return;
    }

    // 既に参加しているかチェック
    const existingEntry = ranking.entries.find((e) => e.userId === currentUser.id);
    if (existingEntry) {
      setError('既にこのランキングに参加しています');
      return;
    }

    const scoreValue = parseScoreValue(score);

    // ランキング計算（新しいエントリーを含めて順位を計算）
    const allEntries = [...ranking.entries];
    const newEntry: Entry = {
      id: `entry${Date.now()}`,
      score: score.trim(),
      scoreValue,
      evidenceUrl: URL.createObjectURL(evidenceFile),
      comment: comment.trim() || undefined,
      isVerified: false,
      rank: undefined,
      medal: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: currentUser.id,
      user: currentUser,
      rankingId: ranking.id,
      approvals: [],
    };

    // スコア順にソート（数値が小さい方が上位 = タイム系）
    allEntries.push(newEntry);
    allEntries.sort((a, b) => {
      // 認証済みを優先
      if (a.isVerified !== b.isVerified) {
        return a.isVerified ? -1 : 1;
      }
      // スコア値でソート
      if (a.scoreValue !== undefined && b.scoreValue !== undefined) {
        return a.scoreValue - b.scoreValue;
      }
      return 0;
    });

    // 順位とメダルを設定
    allEntries.forEach((entry, index) => {
      entry.rank = index + 1;
      if (index === 0) entry.medal = 'GOLD';
      else if (index === 1) entry.medal = 'SILVER';
      else if (index === 2) entry.medal = 'BRONZE';
      else entry.medal = null;
    });

    // 新しいエントリーを追加
    const finalEntry = allEntries.find((e) => e.id === newEntry.id)!;
    addEntry(ranking.id, finalEntry);

    onClose();
    setScore('');
    setComment('');
    setEvidenceFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 sm:items-center">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            🏆 ランキングに参加
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              スコア / 記録 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="例: 5分30秒"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              エビデンス（写真/動画） <span className="text-red-500">*</span>
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
                  <span className="text-sm">タップして写真をアップロード</span>
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
              placeholder="チャレンジの感想など..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4 flex gap-3">
            <Lightbulb size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              参加後、知り合い3名にQR承認してもらうと「認証済み」バッジが付与されます。
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            参加を申請する
          </button>
        </form>
      </div>
    </div>
  );
}
