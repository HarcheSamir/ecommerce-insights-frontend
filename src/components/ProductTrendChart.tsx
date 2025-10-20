// src/components/ProductTrendChart.tsx

import type { FC } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import type { TrendDataPoint } from '../hooks/useWinningProducts';

interface ProductTrendChartProps {
  data?: TrendDataPoint[];
  isLoading: boolean;
  isError: boolean;
}

// --- CUSTOM TOOLTIP COMPONENT ---
const CustomTooltip: FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-800/80 backdrop-blur-sm border border-neutral-600 rounded-lg p-3 shadow-lg">
        <p className="label text-neutral-300 text-sm">{`${label}`}</p>
        <p className="intro font-bold text-[#f97316]">{`Intérêt : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};


const ProductTrendChart: FC<ProductTrendChartProps> = ({ data, isLoading, isError }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-neutral-800/50 rounded-lg">
        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#f97316]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 bg-red-900/20 rounded-lg text-red-400">
        Erreur lors du chargement des données de tendance.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-neutral-800/50 rounded-lg text-neutral-400">
        Aucune donnée de tendance disponible pour ce produit.
      </div>
    );
  }

  const chartData = data.map(point => ({
    ...point,
    interest: point.value[0],
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          {/* --- DEFINITION FOR THE GRADIENT FILL --- */}
          <defs>
            <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
          <XAxis dataKey="formattedTime" stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Line
            type="monotone"
            dataKey="interest"
            name="Intérêt de recherche"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, stroke: '#ea580c', fill: '#f97316' }}
          />
          {/* --- AREA COMPONENT FOR THE GRADIENT FILL --- */}
          <Area type="monotone" dataKey="interest" stroke={false} fillOpacity={1} fill="url(#colorInterest)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductTrendChart;