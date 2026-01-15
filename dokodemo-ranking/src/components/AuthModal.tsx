'use client';

import { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { User } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const { setCurrentUser, users, addUser } = useStore();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      // ログイン処理（モック）
      const user = users.find((u) => u.email === email);
      if (user) {
        setCurrentUser(user);
        onClose();
        setEmail('');
        setPassword('');
      } else {
        setError('メールアドレスが見つかりません');
      }
    } else {
      // 新規登録処理（モック）
      if (!name.trim()) {
        setError('ニックネームを入力してください');
        return;
      }
      if (users.find((u) => u.email === email)) {
        setError('このメールアドレスは既に登録されています');
        return;
      }

      const newUser: User = {
        id: `user${Date.now()}`,
        email,
        name: name.trim(),
        avatarUrl: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addUser(newUser);
      setCurrentUser(newUser);
      onClose();
      setEmail('');
      setPassword('');
      setName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div className="p-4 flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <MapPin size={48} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">どこでもランキング</h1>
          </div>

          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 font-medium ${
                mode === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
            >
              ログイン
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-3 font-medium ${
                mode === 'register'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
            >
              新規登録
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ニックネーム
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="表示される名前"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {mode === 'login' ? 'ログイン' : '登録する'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            {mode === 'login' ? (
              <>
                アカウントをお持ちでない方は{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-blue-600 hover:underline"
                >
                  新規登録
                </button>
              </>
            ) : (
              <>
                既にアカウントをお持ちの方は{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-blue-600 hover:underline"
                >
                  ログイン
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
