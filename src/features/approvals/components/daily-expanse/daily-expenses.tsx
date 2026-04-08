import { useState } from "react";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  EXPENSE_STATUS,
  EXPENSE_SUB_TYPE,
  EXPENSE_TYPE,
  LIMIT_TYPE,
} from "@/data/app.data";
import { useSelectOptions } from "@/hooks/use-select-option";
import { FilterConfig } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import DailyExpenseTable from "./components/daily-expense-table";
import { useGetUsers } from "@/features/livetracking/services/live-tracking-services";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { formatDropDownLabel } from "@/utils/commonFunction";
import {
  formatExpenseSubType,
  formatExpenseType,
} from "@/utils/commonFormatters";
import { useExpenseReviewAndApprovalMultiple, useGetAllDailyExpanses } from "@/features/approvals/services/daily-expanses.hook";
import { userUpcomingVisitStoreState } from "../../store/upcoming-visits.store";
import { ActionModal } from "./components/action-modal";

export default function DailyExpenses() {
  const initialDateRange: DateRange = {
    from: subDays(new Date(), 7),
    to: new Date(),
  };
  const { open, setOpen, currentRow, setCurrentRow, selectedIds, setSelectedIds } = userUpcomingVisitStoreState();
  const closeModal = () => {
    setOpen(null);
    setTimeout(() => setCurrentRow(null), 300);
    setSelectedIds(null);
  };
  const { mutate: expenseReviewAndApproval, isPending: isUpdating } = useExpenseReviewAndApprovalMultiple(() => closeModal());
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialDateRange
  );
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    startDate: initialDateRange.from
      ? format(initialDateRange.from, "yyyy-MM-dd")
      : "",
    endDate: initialDateRange.to
      ? format(initialDateRange.to, "yyyy-MM-dd")
      : "",
    salesRepresentativeUserId: "",
    expenseType: "",
    status: "",
    expenseSubType: "",
    sort: "desc",
    isWebAdminSide: true,
    limitType: ""
  });

  const {
    data: dailyExpanses,
    totalCount,
    isPending,
  } = useGetAllDailyExpanses(pagination);

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange);
    setPagination((prev) => ({
      ...prev,
      page: 1,
      startDate: newRange?.from ? format(newRange.from, "yyyy-MM-dd") : "",
      endDate: newRange?.to ? format(newRange.to, "yyyy-MM-dd") : "",
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
      [key]: value,
    }));
  };

  const { listData: userListDropDownData = [] } = useGetUsers();

  const userListDropDownList = userListDropDownData?.map((user: any) => ({
    ...user,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  }));

  const usersOptions = useSelectOptions<any>({
    listData: userListDropDownList,
    labelKey: "fullName",
    valueKey: "id",
  }).map((option) => ({ ...option, value: String(option.value) }));

  const limitTypeOptions = Object.entries(LIMIT_TYPE).map(
    ([key, value]) => ({
      label: key.replace("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase()),
      value,
    })
  );

  const expanseTypeOptions = Object.entries(EXPENSE_TYPE).map(
    ([key, value]) => ({
      label: formatExpenseType(key),
      value,
    })
  );

  const expanseStatusOptions = Object.entries(Object.fromEntries(Object.entries(EXPENSE_STATUS).filter(([k]) => k !== "REJECTED"))).map(
    ([key, value]) => ({
      label: formatDropDownLabel(key),
      value,
    })
  );

  const expanseSubTypeOptions = Object.entries(EXPENSE_SUB_TYPE).map(
    ([key, value]) => ({
      label: formatExpenseSubType(key),
      value,
    })
  );

  const filters: FilterConfig[] = [
    {
      key: "date-range",
      type: "date-range",
      placeholder: "Filter by date",
      dateRangeValue: dateRange,
      onDateRangeChange: handleDateRangeChange,
      dataRangeClassName: "w-full max-w-xs",
    },
    {
      key: "salesRepresentativeUserId",
      type: "searchable-select",
      onChange: (value) =>
        handleFilterChange("salesRepresentativeUserId", String(value)),
      placeholder: "Select Sales Rep",
      value: pagination.salesRepresentativeUserId,
      options: usersOptions,
      onCancelPress: () => handleFilterChange("salesRepresentativeUserId", ""),
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "status",
      type: "select",
      onChange: (value) => handleFilterChange("status", String(value)),
      placeholder: "Select Status",
      value: pagination.status,
      options: expanseStatusOptions,
    },
    {
      key: "expenseType",
      type: "select",
      onChange: (value) => handleFilterChange("expenseType", String(value)),
      placeholder: "Select Type",
      value: pagination.expenseType,
      options: expanseTypeOptions,
    },
    {
      key: "expenseSubType",
      type: "select",
      onChange: (value) => handleFilterChange("expenseSubType", String(value)),
      placeholder: "Select Sub Type",
      value: pagination.expenseSubType,
      options: expanseSubTypeOptions,
    },
    {
      key: "limitType",
      type: "select",
      onChange: (value) => handleFilterChange("limitType", String(value)),
      placeholder: "Select Limit Type",
      value: pagination.limitType,
      options: limitTypeOptions
    }
  ];

  const handleConfirm = (actionType: EXPENSE_STATUS, reason: string) => {
    const ids = selectedIds && selectedIds?.size > 0 ? Array.from(selectedIds) : null;
    const expenses = ids ? ids.map(id => dailyExpanses.find((e: any) => String(e.id) === String(id))).filter(Boolean) : [currentRow];
    
    if (!expenses[0]?.expenseType) return;
    
    const buildPayload = (expense: any, detailId: string, detailType: string) => {
      return {
        expenseId: expense.id,
        status: actionType === EXPENSE_STATUS.REJECT ? EXPENSE_STATUS.REJECTED : (expense.showApprove ? EXPENSE_STATUS.APPROVED : EXPENSE_STATUS.REVIEWED),
        comment: reason,
        isApprovalLevel: expense.isApprovalLevel,
        ...(detailType === 'travel' ? (expense?.expenseSubType === EXPENSE_SUB_TYPE.TRAVEL_LUMP_SUM ? { travelLumpSumId: detailId }: { travelRouteId: detailId }) : {}),
        ...(detailType === 'allowance' ? { dailyAllowanceId: detailId.split('|')[0], dailyAllowanceDetailsId: detailId.split('|')[1] } : {}),
      }
    };

    const expenseReviewsAndApprovals = expenses.flatMap(expense => {
      if (expense?.expenseType === EXPENSE_TYPE.TRAVEL) {
        const data = expense?.expenseSubType === EXPENSE_SUB_TYPE.TRAVEL_LUMP_SUM ? expense.travelLumpSums : expense.travelRoutes;
        return data.map((item: any) => buildPayload(expense, expense?.expenseSubType === EXPENSE_SUB_TYPE.TRAVEL_LUMP_SUM ? item.travelLumpSumId : item.travelRouteId, 'travel'));
      } else {
        return (expense?.dailyAllowances || []).flatMap((da: any) => 
          (da?.dailyAllowancesDetails || []).map((dad: any) => buildPayload(expense, `${da.dailyAllowanceId}|${dad.id}`, 'allowance'))
        );
      }
    });

    expenseReviewAndApproval({ expenseReviewsAndApprovals: expenseReviewsAndApprovals.filter(Boolean) });
  };
  
  return (
    <>
      <GlobalFilterSection key={"calender-view-filters"} filters={filters} />

      <DailyExpenseTable
        pagination={pagination}
        data={dailyExpanses}
        totalCount={totalCount}
        loading={isPending}
        currentPage={pagination.page}
        paginationCallbacks={{ onPaginationChange }}
        defaultPageSize={pagination.limit}
      />
      
      {(currentRow || selectedIds) && (
        <ActionModal
          key="delete-daily-expense"
          open={open === "action"}
          currentRow={currentRow ?? {}}
          onDelete={() => {}}
          onCancel={closeModal}
          handleConfirm={handleConfirm}
          isUpdating={isUpdating}
          onOpenChange={(value) => {
            if (!value) closeModal();
            else setOpen("delete");
          }}
        />
      )}
    </>
  );
}
