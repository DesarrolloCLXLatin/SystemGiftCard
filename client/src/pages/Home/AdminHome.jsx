import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MoreVertical, TrendingUp, TrendingDown, Download, Store, Users } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

// Custom hook for data fetching and management
const useAdminData = () => {
  const generateMockData = (baseValue, variance) =>
    Array.from({ length: 7 }, (_, i) => ({
      name: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
      value: Math.floor(baseValue + Math.random() * variance)
    }));

  return {
    tarjetasGeneradas: {
      current: 150,
      percentage: 12.5,
      trend: 'up',
      history: generateMockData(100, 100)
    },
    montoTotalGenerado: {
      current: 5000,
      percentage: -2.3,
      trend: 'down',
      history: generateMockData(4000, 2000)
    },
    montoConsumoFrecuente: {
      current: 2500,
      percentage: 8.7,
      trend: 'up',
      history: generateMockData(2000, 1000)
    },
    montoTotalConsumo: {
      current: 3000,
      percentage: 15.2,
      trend: 'up',
      history: generateMockData(2500, 1000)
    }
  };
};

const MetricCard = ({ title, data, isCurrency }) => {
  const formattedValue = isCurrency
    ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data.current)
    : data.current.toLocaleString();

  const isPositive = data.trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  const chartData = {
    labels: data.history.map(item => item.name),
    datasets: [
      {
        label: title,
        data: data.history.map(item => item.value),
        borderColor: isPositive ? '#34D399' : '#F87171',
        backgroundColor: isPositive ? 'rgba(52, 211, 153, 0.2)' : 'rgba(248, 113, 113, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        min: Math.min(...data.history.map(item => item.value)) - 100,
        max: Math.max(...data.history.map(item => item.value)) + 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'var(--card-background-color)',
        borderColor: 'var(--card-border-color)',
        borderWidth: 1,
        borderRadius: '0.5rem',
        boxShadow: 'var(--card-shadow-color)',
      },
    },
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Descargar Reporte
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">{formattedValue}</span>
          <div className={`flex items-center px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <TrendIcon className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{Math.abs(data.percentage)}%</span>
          </div>
        </div>

        <div className="h-36 mt-4">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

const TopStoresCard = () => {
  const topStoresData = Array.from({ length: 10 }, (_, i) => ({
    store: `Store ${i + 1}`,
    canjes: Math.floor(150 - (i * 12))
  }));

  const chartData = {
    labels: topStoresData.map(item => item.store),
    datasets: [
      {
        label: 'Canjes',
        data: topStoresData.map(item => item.canjes),
        backgroundColor: '#6366f1',
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed;
            }
            return label;
          }
        },
        backgroundColor: 'var(--card-background-color)',
        borderColor: 'var(--card-border-color)',
        borderWidth: 1,
        borderRadius: '0.5rem',
        padding: '0.75rem',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutBounce',
    },
  };

  return (
    <Card className="col-span-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Top 10 Tiendas
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[400px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

const TopUsersCard = () => {
  const topUsersData = Array.from({ length: 5 }, (_, i) => ({
    user: `User ${i + 1}`,
    promedioCanjes: Math.floor(15 - (i * 2)),
    cantidadCanjes: Math.floor(100 - (i * 10)),
    montoCanjeable: Math.floor(500 - (i * 50))
  }));

  return (
    <Card className="col-span-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Usuarios en linea
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Promedio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {topUsersData.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {user.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.promedioCanjes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.cantidadCanjes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-600 dark:text-indigo-400">
                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })
                      .format(user.montoCanjeable)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = ({ isSidebarExpanded }) => {
  const data = useAdminData();

  return (
    <div className={`p-6 ${isSidebarExpanded ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Panel Principal</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Estadisticas Generales
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Gift Card Generadas"
          data={data.tarjetasGeneradas}
          isCurrency={false}
        />
        <MetricCard
          title="Balance Total Generado"
          data={data.montoTotalGenerado}
          isCurrency={true}
        />
        <MetricCard
          title="Monto de Consumo Frecuente"
          data={data.montoConsumoFrecuente}
          isCurrency={true}
        />
        <MetricCard
          title="Monto Total de Consumo"
          data={data.montoTotalConsumo}
          isCurrency={true}
        />
        <TopStoresCard />
        <TopUsersCard />
      </div>
    </div>
  );
};

export default AdminDashboard;
