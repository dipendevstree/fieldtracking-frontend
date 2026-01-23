import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePostData from "@/hooks/use-post-data";

const GET_WORK_DAY_SESSION_QUERY = API.WorkSession.getWorkDaySession;

export const useGetWorkDaySession = (params?: {
  date?: string;
  enabled?: boolean;
}) => {
  return useFetchData<any>({
    url: API.WorkSession.getWorkDaySession,
    params,
  });
};

export const useStartWorkDaySession = (onSuccess?: () => void) => {
  return usePostData({
    url: API.WorkSession.startWorkDaySession,
    refetchQueries: [GET_WORK_DAY_SESSION_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useEndWorkDaySession = (onSuccess?: () => void) => {
  return usePostData({
    url: API.WorkSession.endWorkDaySession,
    refetchQueries: [GET_WORK_DAY_SESSION_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useStartBreakSession = (onSuccess?: () => void) => {
  return usePostData({
    url: API.WorkSession.startBreakSession,
    refetchQueries: [GET_WORK_DAY_SESSION_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useEndBreakSession = (onSuccess?: () => void) => {
  return usePostData({
    url: API.WorkSession.endBreakSession,
    refetchQueries: [GET_WORK_DAY_SESSION_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
