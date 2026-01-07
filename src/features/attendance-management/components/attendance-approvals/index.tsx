import { useState } from "react";
import { format } from "date-fns";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { FilterConfig } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import AttendanceApprovalTable from "./components/attendance-approval-table";
import {
  useGetAttendanceCorrections,
  useApproveRejectAttendanceCorrection,
} from "../../services/attendance-approval-action.hook";
import { useAttendanceApprovalStoreState } from "../../store/attendance-approval.store";
import { ActionModal } from "./components/action-modal";
import { Main } from "@/components/layout/main";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { DateRange } from "react-day-picker";

export default function AttendanceApprovals() {
  const { open, currentRow, closeModal } = useAttendanceApprovalStoreState();

  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });

  const [currentDateRange, setCurrentDateRange] = useState<
    DateRange | undefined
  >();
  const [currentStatus, setCurrentStatus] = useState<string | undefined>();

  const { mutate: approveRejectCorrection, isPending: isUpdating } =
    useApproveRejectAttendanceCorrection(
      currentRow?.correctionId || "",
      closeModal
    );

  const handleApproveConfirm = () => {
    approveRejectCorrection({
      status: "APPROVED",
      rejectionReason: undefined,
    });
  };

  const {
    data: corrections,
    totalCount,
    isLoading,
  } = useGetAttendanceCorrections(pagination);

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const filters: FilterConfig[] = [
    {
      key: "date-range",
      type: "date-range",
      placeholder: "Filter by date",
      disableFutureDates: true,
      dateRangeValue: currentDateRange,
      onDateRangeChange: (range) => {
        setCurrentDateRange(range);
        setPagination({
          ...pagination,
          page: 1,
          ...(range?.from && { startDate: format(range.from, "yyyy-MM-dd") }),
          ...(range?.to && { endDate: format(range.to, "yyyy-MM-dd") }),
        });
      },
      dataRangeClassName: "w-full max-w-xs",
    },
    {
      key: "status",
      type: "select",
      value: currentStatus,
      onChange: (value) => {
        setCurrentStatus(value);
        setPagination((prev) => ({
          ...prev,
          page: 1,
          ...(value && { status: value }),
        }));
      },
      onCancelPress: () => {
        setCurrentStatus(undefined);
        setPagination((prev) => {
          const { status: _, ...rest } = prev as any;
          return { ...rest, page: 1 };
        });
      },
      placeholder: "Select Status",
      options: [
        { label: "Pending", value: "PENDING" },
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" },
        { label: "Cancelled", value: "CANCEL" },
      ],
    },
  ];

  return (
    <Main>
      <GlobalFilterSection
        key={"attendance-approvals-filters"}
        filters={filters}
      />

      <AttendanceApprovalTable
        data={corrections}
        totalCount={totalCount}
        loading={isLoading}
        currentPage={pagination.page}
        paginationCallbacks={{ onPaginationChange }}
        defaultPageSize={pagination.limit}
      />

      {/* Confirm Dialog for Approve */}
      {currentRow && (
        <ConfirmDialog
          open={open === "confirm-approve"}
          onOpenChange={(value) => !value && closeModal()}
          title="Approve Attendance Correction"
          desc="Are you sure you want to approve this attendance correction request?"
          confirmText="Approve"
          handleConfirm={handleApproveConfirm}
          isLoading={isUpdating}
        />
      )}

      {/* Modal for Reject with Reason */}
      {currentRow && (
        <ActionModal
          open={open === "action"}
          onCancel={closeModal}
          handleConfirm={(reason) =>
            approveRejectCorrection({
              status: "REJECTED",
              rejectionReason: reason,
            })
          }
          isUpdating={isUpdating}
          onOpenChange={(value) => {
            if (!value) closeModal();
          }}
        />
      )}
    </Main>
  );
}
