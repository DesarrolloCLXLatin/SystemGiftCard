import React from 'react';
import { Clock, CreditCard, Store, User as UserIcon, X } from 'lucide-react';

export function UserDetails({ user, activities, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Detalles del Usuario</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-4 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Información Personal
            </h4>
            <div className="space-y-2">
              <p><span className="font-medium">Nombre:</span> {user.name}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Estado:</span> 
                <span className={`ml-2 ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {user.isActive ? 'Activo' : 'Deshabilitado'}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-4 flex items-center">
              <Store className="h-5 w-5 mr-2" />
              Información de Tienda
            </h4>
            <div className="space-y-2">
              <p><span className="font-medium">Tienda:</span> {user.storeName}</p>
              <p><span className="font-medium">Saldo Actual:</span> ${user.balance.toFixed(2)}</p>
              <p><span className="font-medium">Total Canjes:</span> {user.redemptionsCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Registro de Actividades
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="mb-3 p-2 border-b border-gray-200 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    activity.type === 'REDEMPTION' ? 'bg-blue-100 text-blue-800' :
                    activity.type === 'LOGIN' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}