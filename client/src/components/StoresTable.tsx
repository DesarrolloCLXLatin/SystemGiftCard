import React from 'react';
import { Pencil, Trash2, Users } from 'lucide-react';
import type { Store } from '../types/store';
import '../styles/css/store.css';

interface StoresTableProps {
  stores: Store[];
  onEdit: (store: Store) => void;
  onDelete: (storeId: string) => void;
  onAssignCards: (storeId: string) => void;
}

export function StoresTable({ stores, onEdit, onDelete, onAssignCards }: StoresTableProps) {
  // Lógica para manejar la paginación
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(stores.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentStores = stores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <table className="store-table">
        <thead>
          <tr>
            <th>Tienda</th>
            <th>Usuarios</th>
            <th>Canjes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentStores.map((store) => (
            <tr key={store.id}>
              <td>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {store.name}
                  </div>
                  <div className="text-sm text-gray-500">{store.address}</div>
                </div>
              </td>
              <td>
                <div className="text-sm text-gray-900">{store.assignedUsers}</div>
              </td>
              <td>
                <div className="text-sm text-gray-900">{store.redemptions}</div>
              </td>
              <td>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(store)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onAssignCards(store.id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Users className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(store.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="store-pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? 'disabled' : ''}
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? 'disabled' : ''}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
