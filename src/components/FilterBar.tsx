import React from "react";
import { UserStatus } from "../services/userService";

interface FilterBarProps {
  filter: UserStatus | "all";
  setFilter: (filter: UserStatus | "all") => void;
}

const options: { label: string; value: UserStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Pending", value: "pending" },
];

export const FilterBar: React.FC<FilterBarProps> = ({ filter, setFilter }) => (
  <div className="flex gap-2 mb-6">
    {options.map(opt => (
      <button
        key={opt.value}
        className={`px-4 py-1 rounded-full border ${
          filter === opt.value
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
        } transition`}
        onClick={() => setFilter(opt.value)}
      >
        {opt.label}
      </button>
    ))}
  </div>
);