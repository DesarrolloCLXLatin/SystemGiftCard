import React, { useState, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/css/consulta.css';

const DataTable = ({ data = [], isSidebarExpanded }) => {
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    consumption_date: '',
    expiration_date: '',
    serial: '',
    beneficiary: '',
    assigned_to: '',
    deactivated_by: ''
  });

  const formatRelativeDate = (date) => {
    if (!date) return '-';
    const now = new Date();
    const then = new Date(date);
    const diffInDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInDays < 1) return 'hoy';
    if (diffInDays === 1) return 'ayer';
    if (diffInDays < 30) return `hace ${diffInDays} días`;
    if (diffInMonths < 12) return `hace ${diffInMonths} meses`;
    return `hace ${diffInYears} años`;
  };

  const columns = useMemo(() => [
    {
      header: 'Balance',
      accessor: 'balance',
      render: (value) => value ? `$${value.toLocaleString()}` : '-'
    },
    {
      header: 'Balance Inicial',
      accessor: 'initial_balance',
      render: (value) => value ? `$${value.toLocaleString()}` : '-'
    },
    {
      header: 'Fecha de Consumo',
      accessor: 'consumption_date',
      render: (value) => formatRelativeDate(value)
    },
    { header: 'Fecha de Expiración', accessor: 'expiration_date' },
    { header: 'Serial', accessor: 'serial' },
    { header: 'Beneficiario', accessor: 'beneficiary' },
    {
      header: 'Estatus',
      accessor: 'status',
      render: (value) => (
        <span className={`status-badge ${value.toLowerCase()} ${isDarkMode ? 'dark' : 'light'}`}>
          {value || 'N/A'}
        </span>
      )
    },
    { header: 'Asignada a', accessor: 'assigned_to' },
    { header: 'Tienda de canje', accessor: 'redeem_store' },
    { header: 'Desactivada por', accessor: 'deactivated_by' }
  ], [isDarkMode]);

  const sortData = useCallback((data, sortConfig) => {
    if (!sortConfig.key || !data.length) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key] ?? '';
      const bValue = b[sortConfig.key] ?? '';

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, []);

  const handleSort = (key) => {
    setSortConfig((prevSort) => ({
      key,
      direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const filteredData = useMemo(() => {
    return data.filter(item =>
      Object.keys(filters).every(key =>
        String(item[key]).toLowerCase().includes(filters[key].toLowerCase())
      )
    );
  }, [data, filters]);

  const sortedData = useMemo(() => sortData(filteredData, sortConfig), [filteredData, sortConfig, sortData]);
  const pageCount = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = sortedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const canPreviousPage = currentPage > 0;
  const canNextPage = currentPage < pageCount - 1;

  const gotoPage = (page) => {
    setCurrentPage(Math.max(0, Math.min(page, pageCount - 1)));
  };

  const sampleData = useMemo(() => [
    {
      balance: 100,
      initial_balance: 200,
      consumption_date: '2024-12-01',
      expiration_date: '2025-12-01',
      serial: 'ABC123',
      beneficiary: 'John Doe',
      status: 'Activa',
      assigned_to: 'Jane Smith',
      redeem_store: 'Store 1',
      deactivated_by: 'N/A'
    },
    {
      balance: 150,
      initial_balance: 250,
      consumption_date: '2024-11-01',
      expiration_date: '2025-11-01',
      serial: 'DEF456',
      beneficiary: 'Alice Johnson',
      status: 'Inactiva',
      assigned_to: 'Bob Brown',
      redeem_store: 'Store 2',
      deactivated_by: 'N/A'
    },
    {
      balance: 200,
      initial_balance: 300,
      consumption_date: '2024-10-01',
      expiration_date: '2025-10-01',
      serial: 'GHI789',
      beneficiary: 'Charlie Brown',
      status: 'Deshabilitada',
      assigned_to: 'Eve White',
      redeem_store: 'Store 3',
      deactivated_by: 'N/A'
    },
    {
      balance: 250,
      initial_balance: 350,
      consumption_date: '2024-09-01',
      expiration_date: '2025-09-01',
      serial: 'JKL012',
      beneficiary: 'David Smith',
      status: 'Desactivada',
      assigned_to: 'Frank Black',
      redeem_store: 'Store 4',
      deactivated_by: 'N/A'
    },
    {
      balance: 300,
      initial_balance: 400,
      consumption_date: '2024-08-01',
      expiration_date: '2025-08-01',
      serial: 'MNO345',
      beneficiary: 'Emma White',
      status: 'Canjeada',
      assigned_to: 'Grace Green',
      redeem_store: 'Store 5',
      deactivated_by: 'N/A'
    }
  ], []);

  const displayData = data.length ? paginatedData : sampleData;

  return (
    <div className={`data-table-container ${isDarkMode ? 'dark' : 'light'} ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tablas de Consulta</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Datos Generales
          </p>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <input
            type="text"
            placeholder="Fecha de Consumo..."
            name="consumption_date"
            value={filters.consumption_date}
            onChange={handleFilterChange}
            className={`w-full px-4 py-2 border rounded-md ${isDarkMode ? 'dark' : 'light'}`}
          />
          <input
            type="text"
            placeholder="Fecha de Expiración..."
            name="expiration_date"
            value={filters.expiration_date}
            onChange={handleFilterChange}
            className={`w-full px-4 py-2 border rounded-md ${isDarkMode ? 'dark' : 'light'}`}
          />
          <input
            type="text"
            placeholder="Serial..."
            name="serial"
            value={filters.serial}
            onChange={handleFilterChange}
            className={`w-full px-4 py-2 border rounded-md ${isDarkMode ? 'dark' : 'light'}`}
          />
          <input
            type="text"
            placeholder="Beneficiario..."
            name="beneficiary"
            value={filters.beneficiary}
            onChange={handleFilterChange}
            className={`w-full px-4 py-2 border rounded-md ${isDarkMode ? 'dark' : 'light'}`}
          />
          <input
            type="text"
            placeholder="Asignada a..."
            name="assigned_to"
            value={filters.assigned_to}
            onChange={handleFilterChange}
            className={`w-full px-4 py-2 border rounded-md ${isDarkMode ? 'dark' : 'light'}`}
          />
          <input
            type="text"
            placeholder="Desactivada por..."
            name="deactivated_by"
            value={filters.deactivated_by}
            onChange={handleFilterChange}
            className={`w-full px-4 py-2 border rounded-md ${isDarkMode ? 'dark' : 'light'}`}
          />
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
          <div className="data-table-wrapper bg-transparent">
            <div className="overflow-x-auto">
              <table className="data-table w-full bg-transparent">
                <thead className={`${isDarkMode ? 'dark' : 'light'}`}>
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.accessor}
                        onClick={() => handleSort(column.accessor)}
                        className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer bg-transparent"
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.header}</span>
                          {sortConfig.key === column.accessor && (
                            <span>
                              {sortConfig.direction === 'asc'
                                ? <ChevronUp className="w-4 h-4" />
                                : <ChevronDown className="w-4 h-4" />
                              }
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`${isDarkMode ? 'dark' : 'light'}`}>
                  {displayData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`
                        ${isDarkMode ? 'dark' : 'light'}
                        border-b transition-colors bg-transparent
                      `}
                    >
                      {columns.map((column) => (
                        <td
                          key={column.accessor}
                          className="px-6 py-4 whitespace-nowrap text-sm bg-transparent"
                        >
                          {column.render
                            ? column.render(row[column.accessor])
                            : row[column.accessor] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`data-table-pagination ${isDarkMode ? 'dark' : 'light'}`}>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                  className={`p-2 rounded-md ${isDarkMode ? 'dark' : 'light'}`}
                >
                  <ChevronsLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => gotoPage(currentPage - 1)}
                  disabled={!canPreviousPage}
                  className={`p-2 rounded-md ${isDarkMode ? 'dark' : 'light'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => gotoPage(currentPage + 1)}
                  disabled={!canNextPage}
                  className={`p-2 rounded-md ${isDarkMode ? 'dark' : 'light'}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                  className={`p-2 rounded-md ${isDarkMode ? 'dark' : 'light'}`}
                >
                  <ChevronsRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <span className={`text-sm ${isDarkMode ? 'dark' : 'light'}`}>
                  Página {currentPage + 1} de {pageCount}
                </span>

                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(0);
                  }}
                  className={`
                    rounded-md border px-2 py-1 text-sm
                    ${isDarkMode ? 'dark' : 'light'}
                  `}
                >
                  {[10, 20, 30, 40, 50].map(size => (
                    <option key={size} value={size}>
                            |{size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;