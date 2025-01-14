import React from 'react';
import { User } from '../types/user';
import { Circle, Store, CreditCard, Activity } from 'lucide-react';

interface UserTableProps {
  users: User[];
  onViewDetails: (userId: string) => void;
}

export function UserTable({ users, onViewDetails }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tienda</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Canjes</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Circle className={`h-3 w-3 ${user.isOnline ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={`ml-2 ${!user.isActive ? 'text-red-500' : 'text-gray-500'}`}>
                    {user.isActive ? (user.isOnline ? 'En línea' : 'Ausente') : 'Deshabilitado'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Store className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{user.storeName}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{user.redemptionsCount}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">${user.balance.toFixed(2)}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onViewDetails(user.id)}
                  className="text-indigo-600 hover:text-indigo-900 flex items-center"
                >
                  <Activity className="h-4 w-4 mr-1" />
                  Ver detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}