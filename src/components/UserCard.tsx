import React from "react";
import { motion } from "framer-motion";
import { User, UserStatus } from "../services/userService";
import { StatusBadge } from "./StatusBadge";

interface UserCardProps {
  user: User;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPending: (id: string) => void;
  actionLoading?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onApprove, onReject, onPending, actionLoading }) => (
  <motion.div
    className="bg-gradient-to-br from-white via-background to-gray-100 border border-gray-200 rounded-xl shadow-md p-6 flex flex-col gap-3 hover:shadow-xl transition "
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center justify-between mb-2">
      <div>
        <div className="font-bold text-lg text-primary ">{user.name}</div>
        <div className="text-secondary text-sm text-gray-400">{user.email}</div>
      </div>
      <StatusBadge status={user.status} />
    </div>
    <div className="flex gap-2 mt-3">
      <button
        className="flex-1 bg-[#7F8CAA] text-[#333446] py-2 rounded-lg shadow hover:opacity-80 transition font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-gray-700 text-gray-100 hover:bg-gray-600 flex items-center justify-center"
        disabled={user.status === "approved" || actionLoading}
        onClick={() => onApprove(user.id)}
      >
        승인
      </button>
      <button
        className="flex-1 bg-[#B8CFCE] text-[#333446] py-2 rounded-lg shadow hover:opacity-80 transition font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
        disabled={user.status === "rejected" || actionLoading}
        onClick={() => onReject(user.id)}
      >
        반려
      </button>
      <button
        className="flex-1 bg-[#EAEFEF] text-[#333446] py-2 rounded-lg shadow hover:opacity-80 transition font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
        disabled={user.status === "pending" || actionLoading}
        onClick={() => onPending(user.id)}
      >
        대기
      </button>
    </div>
  </motion.div>
);