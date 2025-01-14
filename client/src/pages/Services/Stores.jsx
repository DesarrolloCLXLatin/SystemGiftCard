import React, { useCallback } from 'react';
import { Store, Building2, Plus } from 'lucide-react';
import { StoreForm } from '../../components/StoreForm';
import { TopStores } from '../../components/TopStores';
import { StoresTable } from '../../components/StoresTable';
import '../../styles/css/store.css';
import Swal from 'sweetalert2'; // Import SweetAlert2

// Mock data - Replace with actual API calls in production
const mockStores = [
  {
    id: '1',
    name: 'Tienda del Centro',
    address: '123 Calle Principal, Centro',
    phone: '(555) 123-4567',
    assignedUsers: 15,
    redemptions: 234,
    createdAt: '2024-03-10',
    updatedAt: '2024-03-15',
  },
  {
    id: '2',
    name: 'Tienda del Centro Comercial',
    address: '456 Avenida Compras, Centro Comercial',
    phone: '(555) 234-5678',
    assignedUsers: 8,
    redemptions: 156,
    createdAt: '2024-03-08',
    updatedAt: '2024-03-14',
  },
  {
    id: '3',
    name: 'Tienda de la Plaza',
    address: '789 Calle Plaza',
    phone: '(555) 345-6789',
    assignedUsers: 12,
    redemptions: 198,
    createdAt: '2024-03-05',
    updatedAt: '2024-03-13',
  },
];

function Stores() {
  const [stores, setStores] = React.useState(mockStores);
  const [showForm, setShowForm] = React.useState(false);
  const [editingStore, setEditingStore] = React.useState(null);

  const handleCreateStore = useCallback((data) => {
    const newStore = {
      id: Date.now().toString(),
      ...data,
      assignedUsers: 0,
      redemptions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStores([...stores, newStore]);
    setShowForm(false);
  }, [stores]);

  const handleUpdateStore = useCallback((data) => {
    if (!editingStore) return;

    const updatedStore = {
      ...editingStore,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    setStores(stores.map((store) =>
      store.id === editingStore.id ? updatedStore : store
    ));

    setEditingStore(null);
  }, [editingStore, stores]);

  const handleDeleteStore = useCallback((storeId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setStores(stores.filter((store) => store.id !== storeId));
        Swal.fire(
          'Eliminado',
          'Tu tienda ha sido eliminada.',
          'success'
        );
      }
    });
  }, [stores]);

  const handleAssignCards = useCallback((storeId) => {
    Swal.fire({
      title: 'Asignar Usuarios',
      text: 'Ingresa el número de usuarios a asignar:',
      input: 'number',
      inputAttributes: {
        min: 1,
        step: 1,
      },
      showCancelButton: true,
      confirmButtonText: 'Asignar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('Por favor, ingresa un número válido');
          return false;
        }
        return value;
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        const numberOfUsers = parseInt(result.value, 10);
        setStores(stores.map((store) =>
          store.id === storeId ? { ...store, assignedUsers: store.assignedUsers + numberOfUsers } : store
        ));
        Swal.fire(
          'Asignado',
          `Has asignado ${numberOfUsers} usuarios a la tienda.`,
          'success'
        );
      }
    });
  }, [stores]);

  return (
    <div className="store-container">

        <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Store className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold">Gestión de Tiendas</span>
            </div>
          </div>
        </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-600">Visión General de Tiendas</h1>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Añadir Tienda
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1">
            <StoresTable
              stores={stores}
              onEdit={setEditingStore}
              onDelete={handleDeleteStore}
              onAssignCards={handleAssignCards}
            />
          </div>

          <div className="lg:col-span-1">
            <TopStores stores={stores} />
          </div>
        </div>
      </main>

      {(showForm || editingStore) && (
        <StoreForm
          onSubmit={editingStore ? handleUpdateStore : handleCreateStore}
          onClose={() => {
            setShowForm(false);
            setEditingStore(null);
          }}
          initialData={editingStore || undefined}
          isEdit={!!editingStore}
        />
      )}
        </div>
    </div>
  );
}

export default Stores;
