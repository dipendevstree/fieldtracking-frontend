import API from "@/config/api/api";
import usePatchData from "@/hooks/use-patch-data";

const CALENDAR_QUERY = API.calendar.visitList;
const ANALYTICS_QUERY = API.calendar.analytics;

export const useUpdateVisitFeedBack = (
  id: string,
  token?: string,
  onSuccess?: () => void
) => {
  return usePatchData({
    url: `${API.calendar.visitFeedBack}/${id}`,
    refetchQueries: [CALENDAR_QUERY, ANALYTICS_QUERY],
    token,
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
