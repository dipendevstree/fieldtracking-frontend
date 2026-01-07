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

export default function AttendanceApprovals() {
  const { open, currentRow, closeModal } = useAttendanceApprovalStoreState();

  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });

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
      onDateRangeChange: (range) => {
        const updated: any = { ...pagination, page: 1 };
        if (range?.from) updated.startDate = format(range.from, "yyyy-MM-dd");
        else delete updated.startDate;
        if (range?.to) updated.endDate = format(range.to, "yyyy-MM-dd");
        else delete updated.endDate;
        setPagination(updated);
      },
      dataRangeClassName: "w-full max-w-xs",
    },
    {
      key: "status",
      type: "select",
      onChange: (value) => {
        setPagination((prev) => {
          const updated: any = { ...prev, page: 1 };
          if (value) updated.status = value;
          else delete updated.status;
          return updated;
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
