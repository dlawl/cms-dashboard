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
  <div className="flex gap-3 mb-8 justify-center">
    {options.map(opt => {
      const selected = filter === opt.value;
      return (
        <button
          key={opt.value}
          className={`px-4 py-1 rounded-full font-semibold transition shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer ${selected ? "bg-gradient-to-r from-primary to-accent text-gray shadow-md ring-2 ring-primary/30" : "bg-white text-foreground border border-gray-200 hover:bg-gray-50"}`}
          onClick={() => setFilter(opt.value)}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);