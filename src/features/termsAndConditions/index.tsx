import { useState } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { useGetAllTermsAndConditions } from "./services/TermsAndConditions.hook";
import { ErrorResponse } from "../merchants/types";
import { ErrorPage } from "@/components/shared/custom-error";
import { Main } from "@/components/layout/main";
import { cn } from "@/lib/utils";
import TablePageLayout from "@/components/layout/table-page-layout";
import { useTermsStore } from "./components/termsAndConditions.store";
import { TermActionModal } from "./components/action-modal";
import TermsTable from "./components/termsAndConditions-table";

const TermsAndConditionsPage = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    sortByActive: true,
  });

  const {
    data: allTerms = [],
    totalCount,
    isLoading,
    error,
  } = useGetAllTermsAndConditions(pagination);

  const { setOpen, open } = useTermsStore();

  if (error) {
    const errorResponse = (error as ErrorResponse)?.response?.data;
    return (
      <ErrorPage
        errorCode={errorResponse?.statusCode}
        message={errorResponse?.message}
      />
    );
  }

  const handleAddTerm = () => {
    setOpen("add");
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination({ page, limit: pageSize, sortByActive: true });
  };

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <TablePageLayout
        title="Terms & Policies"
        description="Manage Terms & Conditions, Privacy Policies, etc."
        onAddButtonClick={handleAddTerm}
        addButtonText="Add Document"
        modulePermission="terms_and_conditions"
        moduleAction="add"
      >
        <TermsTable
          data={allTerms}
          totalCount={totalCount}
          loading={isLoading}
          currentPage={pagination.page}
          paginationCallbacks={{ onPaginationChange }}
          defaultPageSize={pagination.limit}
        />
      </TablePageLayout>

      {open && <TermActionModal />}
    </Main>
  );
};

export default TermsAndConditionsPage;
