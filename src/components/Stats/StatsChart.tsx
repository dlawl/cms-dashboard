import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export interface StatsChartProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
  className?: string;
}

const StatsChart: React.FC<StatsChartProps> = ({ data, title, className }) => {
  return (
    <div className={className}>
      {title && <div className="font-semibold mb-2 text-gray-700">{title}</div>}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} style={{ background: 'white' }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 13, fill: '#6b7280' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 13, fill: '#6b7280' }} axisLine={false} tickLine={false} />
          <Bar dataKey="value" fill="#B8CFCE" radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;
