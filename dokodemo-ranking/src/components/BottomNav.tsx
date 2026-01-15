'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Plus, Trophy, User } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'ホーム' },
  { href: '/search', icon: Search, label: '検索' },
  { href: '/rankings/create', icon: Plus, label: '作成' },
  { href: '/medals', icon: Trophy, label: 'メダル' },
  { href: '/profile', icon: User, label: 'マイページ' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center px-4 py-2 ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
