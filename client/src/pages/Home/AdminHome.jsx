import React from 'react';
import { Card } from '../../components/ui/Card';
import { MoreVertical, TrendingUp, TrendingDown } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const AdminDashboard = ({ isSidebarExpanded }) => {
  // Datos de ejemplo más realistas con tendencias
  const mockData = {
    tarjetasGeneradas: {
      current: 150,
      percentage: 12.5,
      trend: 'up',
      history: Array.from({ length: 7 }, (_, i) => ({
        name: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
        value: Math.floor(100 + Math.random() * 100)
      }))
    },
    montoTotalGenerado: {
      current: 5000,
      percentage: -2.3,
      trend: 'down',
      history: Array.from({ length: 7 }, (_, i) => ({
        name: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
        value: Math.floor(4000 + Math.random() * 2000)
      }))
    },
    montoConsumoFrecuente: {
      current: 2500,
      percentage: 8.7,
      trend: 'up',
      history: Array.from({ length: 7 }, (_, i) => ({
        name: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
        value: Math.floor(2000 + Math.random() * 1000)
      }))
    },
    montoTotalConsumo: {
      current: 3000,
      percentage: 15.2,
      trend: 'up',
      history: Array.from({ length: 7 }, (_, i) => ({
        name: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
        value: Math.floor(2500 + Math.random() * 1000)
      }))
    }
  };

  const DashboardCard = ({ title, data, isCurrency }) => {
    const formattedValue = isCurrency 
      ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data.current)
      : data.current.toLocaleString();

    const isPositive = data.trend === 'up';

    return (
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">{formattedValue}</span>
          <div className={`flex items-center px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            <span className="text-sm font-medium">{Math.abs(data.percentage)}%</span>
          </div>
        </div>

        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? '#34D399' : '#F87171'} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={isPositive ? '#34D399' : '#F87171'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                hide={true}
                domain={['dataMin - 100', 'dataMax + 100']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={isPositive ? '#34D399' : '#F87171'}
                fill={`url(#gradient-${title})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  };

  return (
    <div className={`p-6 ${isSidebarExpanded ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="mt-2 text-sm text-gray-500">Visualiza las métricas más importantes de tu negocio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Tarjetas Generadas" 
          data={mockData.tarjetasGeneradas}
          isCurrency={false}
        />
        <DashboardCard 
          title="Monto Total Generado" 
          data={mockData.montoTotalGenerado}
          isCurrency={true}
        />
        <DashboardCard 
          title="Monto de Consumo Frecuente" 
          data={mockData.montoConsumoFrecuente}
          isCurrency={true}
        />
        <DashboardCard 
          title="Monto Total de Consumo" 
          data={mockData.montoTotalConsumo}
          isCurrency={true}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;