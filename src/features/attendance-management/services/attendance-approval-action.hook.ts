import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import {
  AttendanceApprovalParams,
  AttendanceApprovalRequest,
  AttendanceCorrectionListResponse,
} from "../types";

export const useGetAttendanceCorrections = (
  params: AttendanceApprovalParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<AttendanceCorrectionListResponse>({
    url: "attendance/correction/list",
    params: params as Record<string, unknown>,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list || [],
    totalCount: query.data?.totalCount || 0,
    totalPages: query.data?.totalPages || 0,
    currentPage: query.data?.currentPage || 1,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useApproveRejectAttendanceCorrection = (
  correctionId: string,
  onSuccess?: () => void
) => {
  return usePatchData<AttendanceApprovalRequest>({
    url: `attendance/correction/approve/${correctionId}`,
    refetchQueries: ["attendance/correction/list"],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
