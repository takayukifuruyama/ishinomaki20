'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { BottomNav } from '@/components/BottomNav';
import { AuthModal } from '@/components/AuthModal';
import { CategoryLabels, CategoryIcons } from '@/types';
import type { Category, Ranking } from '@/types';

const categories: Category[] = [
  'GOURMET',
  'SPORTS',
  'HOBBY',
  'DISCOVERY',
  'CHALLENGE',
  'OTHER',
];

const prefectures = [
  '愛知県', '岐阜県', '三重県', '静岡県', '長野県',
  '東京都', '神奈川県', '埼玉県', '千葉県', '大阪府', '兵庫県', '京都府',
];

const areasByPrefecture: Record<string, string[]> = {
  '愛知県': ['名古屋市', '豊田市', '岡崎市', '一宮市', '豊橋市', '春日井市'],
  '岐阜県': ['岐阜市', '大垣市', '各務原市', '多治見市'],
  '三重県': ['津市', '四日市市', '鈴鹿市', '松阪市'],
  '静岡県': ['静岡市', '浜松市', '沼津市', '富士市'],
  '長野県': ['長野市', '松本市', '上田市', '飯田市'],
  '東京都': ['新宿区', '渋谷区', '港区', '中央区', '千代田区', '豊島区', '世田谷区'],
  '神奈川県': ['横浜市', '川崎市', '相模原市', '藤沢市'],
  '埼玉県': ['さいたま市', '川口市', '所沢市', '越谷市'],
  '千葉県': ['千葉市', '船橋市', '市川市', '松戸市'],
  '大阪府': ['大阪市', '堺市', '東大阪市', '枚方市'],
  '兵庫県': ['神戸市', '姫路市', '西宮市', '尼崎市'],
  '京都府': ['京都市', '宇治市', '亀岡市', '舞鶴市'],
};

export default function CreateRankingPage() {
  const router = useRouter();
  const { currentUser, addRanking } = useStore();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [category, setCategory] = useState<Category>('OTHER');
  const [prefecture, setPrefecture] = useState('愛知県');
  const [area, setArea] = useState('名古屋市');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const areas = areasByPrefecture[prefecture] || [];

  const handlePrefectureChange = (newPrefecture: string) => {
    setPrefecture(newPrefecture);
    const newAreas = areasByPrefecture[newPrefecture] || [];
    if (newAreas.length > 0) {
      setArea(newAreas[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    if (!rules.trim()) {
      setError('ルールを入力してください');
      return;
    }

    const newRanking: Ranking = {
      id: `ranking${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      rules: rules.trim(),
      category,
      area,
      prefecture,
      deadline: deadline ? new Date(deadline + 'T23:59:59Z').toISOString() : undefined,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creatorId: currentUser.id,
      creator: currentUser,
      entries: [],
    };

    addRanking(newRanking);
    router.push(`/rankings/${newRanking.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center">
          <Link href="/" className="text-gray-600 hover:text-gray-900 mr-3">
            <ArrowLeft size={24} />
          </Link>
          <span className="font-medium">新しいランキングを作成</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 名古屋で一番辛いラーメン完食チャレンジ"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明（任意）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ランキングの概要を説明してください"
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ルール <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="参加条件、計測方法、エビデンスの形式などを記載してください"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {CategoryIcons[cat]} {CategoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                都道府県
              </label>
              <select
                value={prefecture}
                onChange={(e) => handlePrefectureChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {prefectures.map((pref) => (
                  <option key={pref} value={pref}>
                    {pref}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                市区町村
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              締切日（任意）
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            ランキングを作成する
          </button>
        </form>
      </main>

      <BottomNav />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="register"
      />
    </div>
  );
}
