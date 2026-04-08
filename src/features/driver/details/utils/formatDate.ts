import { format } from "date-fns";

export const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  return format(new Date(dateString), "dd-MM-yyyy");
};
