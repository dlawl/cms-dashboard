import React from "react";
import { UserStatus } from "../services/userService";

interface StatusBadgeProps {
  status: UserStatus;
}

const statusMap = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  approved: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full border text-xs font-semibold ${statusMap[status]}`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);