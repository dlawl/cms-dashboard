import React from "react";
import { UserStatus } from "../services/userService";

interface StatusBadgeProps {
  status: UserStatus;
}

const statusMap = {
  pending: "bg-[#EAEFEF] text-[#333446] border-[#B8CFCE] ",
  approved: "bg-[#7F8CAA] text-[#333446] border-[#333446] ",
  rejected: "bg-[#B8CFCE] text-[#333446] border-[#7F8CAA] ",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full border text-xs font-semibold ${statusMap[status]}`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);