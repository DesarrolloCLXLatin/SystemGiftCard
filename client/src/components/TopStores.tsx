import React from 'react';
import { Trophy } from 'lucide-react';
import type { Store } from '../types/store';
import '../styles/css/store.css';

interface TopStoresProps {
  stores: Store[];
}

export function TopStores({ stores }: TopStoresProps) {
  const topStores = stores
    .sort((a, b) => b.redemptions - a.redemptions)
    .slice(0, 3);

  const badges = [
    'bg-yellow-100 text-yellow-800',
    'bg-gray-100 text-gray-800',
    'bg-orange-100 text-orange-800',
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-600" />
        <h2 className="text-lg font-semibold">Tiendas con Mejor Rendimiento</h2>
      </div>

      <div className="space-y-4">
        {topStores.map((store, index) => (
          <div
            key={store.id}
            className={`p-4 rounded-lg ${badges[index]} flex justify-between items-center`}
          >
            <div>
              <p className="font-semibold">{store.name}</p>
              <p className="text-sm opacity-75">{store.address}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{store.redemptions}</p>
              <p className="text-sm">canjes</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
