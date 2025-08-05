import { useState } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { cn } from "@/lib/utils";
import { Main } from "@/components/layout/main";
import TablePageLayout from "@/components/layout/table-page-layout";
// import { ErrorResponse } from '../../merchants/types'
import ApprovalsTable from "./components/table";
// import { useGetAllApprovals } from './services/Approvals.hook'
import { useApprovalsStore } from "./store/approvals.store";
// import { ErrorPage } from '@/components/shared/custom-error'

const Approvals = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });

  // Approvals data
  // const {
  //   totalCount = 0,
  //   allApprovals = [],
  //   isLoading,
  //   error,
  // } = useGetAllApprovals(pagination)

  const { setOpen } = useApprovalsStore();

  // if (error) {
  //   const errorResponse = (error as ErrorResponse)?.response?.data
  //   return (
  //     <ErrorPage
  //       errorCode={errorResponse?.statusCode}
  //       message={errorResponse?.message}
  //     />
  //   )
  // }

  const handleAddApproval = () => {
    setOpen("workflow");
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      {/* Approvals Management Section */}
      <div className="mt-6">
        <TablePageLayout
          title="All Approvals"
          description="Manage and review expense claims and allowances"
          onAddButtonClick={handleAddApproval}
          addButtonText="Add Workflow"
        >
          <ApprovalsTable
            data={allApprovals}
            totalCount={totalCount}
            loading={isLoading}
            currentPage={pagination.page}
            paginationCallbacks={{ onPaginationChange }}
          />
        </TablePageLayout>
      </div>
    </Main>
  );
};

export default Approvals;
