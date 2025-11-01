import { format } from "date-fns";
export const getStatusColor = (status: boolean) => {
  return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
};

export const getOnlineStatusColor = (isOnline: boolean) => {
  return isOnline ? "bg-green-500" : "bg-gray-400";
};

export const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return format(new Date(dateString), "dd-MM-yyyy, hh:mm a");
};
