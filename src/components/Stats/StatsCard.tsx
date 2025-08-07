import React from 'react';

interface StatsCardProps {
  label: string;
  value: number | string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, className }) => (
  <div
    className={`p-4 rounded-lg border border-gray-200 bg-white flex items-center justify-around ${className ?? ''}`}
    tabIndex={0}
    aria-label={label}
  >
    <div className="text-xs font-medium mb-1 text-gray-500">{label}</div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
  </div>
);

export default StatsCard;
