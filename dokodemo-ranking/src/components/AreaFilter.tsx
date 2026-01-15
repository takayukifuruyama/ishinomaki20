'use client';

import { useStore } from '@/store/useStore';

export function AreaFilter() {
  const { rankings, selectedArea, setSelectedArea } = useStore();

  // ランキングから利用可能なエリアを抽出
  const areas = Array.from(new Set(rankings.map((r) => r.area))).sort();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => setSelectedArea(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          selectedArea === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        すべて
      </button>
      {areas.map((area) => (
        <button
          key={area}
          onClick={() => setSelectedArea(area)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedArea === area
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {area}
        </button>
      ))}
    </div>
  );
}
