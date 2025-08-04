import React from "react";
import { motion } from "framer-motion";
import { User, UserStatus } from "../services/userService";
import { StatusBadge } from "./StatusBadge";

interface UserCardProps {
  user: User;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onApprove, onReject }) => (
  <motion.div
    className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 border hover:shadow-md transition"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold text-lg">{user.name}</div>
        <div className="text-gray-500 text-sm">{user.email}</div>
      </div>
      <StatusBadge status={user.status} />
    </div>
    <div className="flex gap-2 mt-2">
      <button
        className="flex-1 bg-green-500 text-white py-1 rounded hover:bg-green-600 transition disabled:opacity-40"
        disabled={user.status === "approved"}
        onClick={() => onApprove(user.id)}
      >
        Approve
      </button>
      <button
        className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600 transition disabled:opacity-40"
        disabled={user.status === "rejected"}
        onClick={() => onReject(user.id)}
      >
        Reject
      </button>
    </div>
  </motion.div>
);