'use client';

import { useStore } from '@/store/useStore';
import { CategoryLabels, CategoryIcons } from '@/types';
import type { Category } from '@/types';

const categories: Category[] = [
  'GOURMET',
  'SPORTS',
  'HOBBY',
  'DISCOVERY',
  'CHALLENGE',
  'OTHER',
];

export function CategoryFilter() {
  const { selectedCategory, setSelectedCategory } = useStore();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => setSelectedCategory(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          selectedCategory === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        すべて
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {CategoryIcons[category]} {CategoryLabels[category]}
        </button>
      ))}
    </div>
  );
}
