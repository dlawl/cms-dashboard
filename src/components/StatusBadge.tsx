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

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // 방어 코드: status가 없거나 잘못된 값이면 "pending"을 기본값으로 사용
  const safeStatus = status && statusMap[status] ? status : "pending";
  return (
    <span
      className={`px-3 py-1 rounded-full border text-xs font-semibold ${statusMap[safeStatus]}`}
    >
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
    </span>
  );
};