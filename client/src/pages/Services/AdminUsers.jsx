import React, { useState, useCallback } from 'react';
import { Users, UserCheck, UserX, Store } from 'lucide-react';
import { UserTable } from '../../components/UserTable';
import { UserDetails } from '../../components/UserDetails';
import { FilterButton } from '../../components/ui/FilterButton';
import { useUsers } from '../../hooks/useUsers';

// Definimos FilterStatus como un objeto en JavaScript
const FilterStatus = {
  ALL: 'all',
  ONLINE: 'online',
  DISABLED: 'disabled',
};

function AdminUsers() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.ALL);
  const [selectedStore, setSelectedStore] = useState('all');

  const { users, activities, isLoading, error } = useUsers();

  const filteredUsers = useCallback(() => {
    if (!users) return [];

    return users.filter(user => {
      if (filterStatus === FilterStatus.ONLINE && !user.isOnline) return false;
      if (filterStatus === FilterStatus.DISABLED && user.isActive) return false;
      if (selectedStore !== 'all' && user.storeId !== selectedStore) return false;
      return true;
    });
  }, [users, filterStatus, selectedStore]);

  const selectedUser = users?.find(user => user.id === selectedUserId);
  const userActivities = activities?.filter(activity => activity.userId === selectedUserId);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-700">
        Error al cargar los datos: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestión de Usuarios</h1>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <FilterButton
                icon={Users}
                label="Todos los Usuarios"
                isActive={filterStatus === FilterStatus.ALL}
                onClick={() => setFilterStatus(FilterStatus.ALL)}
              />
              <FilterButton
                icon={UserCheck}
                label="Usuarios en Línea"
                isActive={filterStatus === FilterStatus.ONLINE}
                onClick={() => setFilterStatus(FilterStatus.ONLINE)}
              />
              <FilterButton
                icon={UserX}
                label="Usuarios Deshabilitados"
                isActive={filterStatus === FilterStatus.DISABLED}
                onClick={() => setFilterStatus(FilterStatus.DISABLED)}
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <Store className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="all">Todas las Tiendas</option>
                  <option value="store1">Tienda Central</option>
                  {/* Add more stores as needed */}
                </select>
              </div>
            </div>

            <UserTable
              users={filteredUsers()}
              onViewDetails={setSelectedUserId}
            />
          </div>
        </div>
      </div>

      {selectedUser && userActivities && (
        <UserDetails
          user={selectedUser}
          activities={userActivities}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}

export default AdminUsers;
