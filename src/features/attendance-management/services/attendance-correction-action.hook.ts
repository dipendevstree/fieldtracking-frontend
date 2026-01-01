import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";

const ATTENDANCE_CORRECTION_QUERY = API.attendanceCorrection.list;
const MY_ATTENDANCE_CORRECTION_QUERY = API.attendanceCorrection.myCorrections;

export const useCreateAttendanceCorrection = (onSuccess?: () => void) => {
  return usePostData({
    url: API.attendanceCorrection.create,
    refetchQueries: [ATTENDANCE_CORRECTION_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateAttendanceCorrection = (
  id: string,
  onSuccess?: () => void
) => {
  return usePatchData({
    url: `${API.attendanceCorrection.update}/${id}`,
    refetchQueries: [ATTENDANCE_CORRECTION_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetAllAttendanceCorrections = (
  params?: any,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: ATTENDANCE_CORRECTION_QUERY,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    totalCount: query.data?.totalCount ?? 0,
    weekOffDays: query.data?.weekOffDays ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetMyAttendanceCorrections = (options?: {
  enabled?: boolean;
}) => {
  const query = useFetchData<any>({
    url: MY_ATTENDANCE_CORRECTION_QUERY,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    totalCount: query.data?.totalCount ?? 0,
    weekOffDays: query.data?.weekOffDays ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useAttendanceCorrectionApprove = (
  id: string,
  onSuccess?: () => void
) => {
  return usePatchData({
    url: `${API.attendanceCorrection.approve}/${id}`,
    refetchQueries: [ATTENDANCE_CORRECTION_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useAttendanceCorrectionOwnRequestCancel = (
  id: string,
  onSuccess?: () => void
) => {
  return usePatchData({
    url: `${API.attendanceCorrection.cancel}/${id}`,
    refetchQueries: [ATTENDANCE_CORRECTION_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
