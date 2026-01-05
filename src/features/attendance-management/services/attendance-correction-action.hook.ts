import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";

// Query keys for consistent refetching
const ATTENDANCE_CORRECTION_QUERY = API.attendanceCorrection.list;
const MY_ATTENDANCE_CORRECTION_QUERY = API.attendanceCorrection.myCorrections;

// Shared refetch queries for correction-related operations
const CORRECTION_REFETCH_QUERIES = [
  ATTENDANCE_CORRECTION_QUERY,
  MY_ATTENDANCE_CORRECTION_QUERY,
];

export const useRequestAttendanceCorrection = (onSuccess?: () => void) => {
  return usePostData({
    url: API.attendanceCorrection.create,
    refetchQueries: CORRECTION_REFETCH_QUERIES,
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateAttendanceCorrection = (
  correctionId: string,
  onSuccess?: () => void
) => {
  return usePatchData({
    url: `${API.attendanceCorrection.update}/${correctionId}`,
    refetchQueries: CORRECTION_REFETCH_QUERIES,
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

export const useGetMyAttendanceCorrections = (
  params?: any,
  options?: {
    enabled?: boolean;
  }
) => {
  const query = useFetchData<any>({
    url: MY_ATTENDANCE_CORRECTION_QUERY,
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

export const useAttendanceCorrectionApprove = (
  id: string,
  onSuccess?: () => void
) => {
  return usePatchData({
    url: `${API.attendanceCorrection.approve}/${id}`,
    refetchQueries: CORRECTION_REFETCH_QUERIES,
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useAttendanceCorrectionOwnRequestCancel = (
  correctionId: string,
  onSuccess?: () => void
) => {
  return usePatchData({
    url: `${API.attendanceCorrection.cancel}/${correctionId}`,
    refetchQueries: CORRECTION_REFETCH_QUERIES,
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
