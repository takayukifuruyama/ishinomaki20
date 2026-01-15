'use client';

import { useState } from 'react';
import { MapPin, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AuthModal } from './AuthModal';

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser, setCurrentUser } = useStore();

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={24} className="text-blue-600" />
            <h1 className="text-lg font-bold text-gray-900">どこでもランキング</h1>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{currentUser.name}</span>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600"
                title="ログアウト"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ログイン
            </button>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
