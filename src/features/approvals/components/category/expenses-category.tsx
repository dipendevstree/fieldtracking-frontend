import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { cn } from "@/lib/utils";
import { Main } from "@/components/layout/main";
import TablePageLayout from "@/components/layout/table-page-layout";
import { ErrorPage } from "@/components/shared/custom-error";
import { useCategoryStore } from "../../store/expenses-category.store";
import { ErrorResponse } from "@/features/merchants/types";
import { CategoryActionModal } from "./components/actionFormModal";
import CategoryTable from "./components/category-table";
import { useGetAllCategories } from "../../services/category.action.hook";

const ExpenseCategory = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });

  const {
    totalCount = 0,
    allCategories = [],
    isLoading,
    error,
  } = useGetAllCategories(pagination);

  const { setOpen, open } = useCategoryStore();
  const {} = useRouter();

  if (error) {
    const errorResponse = (error as ErrorResponse)?.response?.data;
    return (
      <ErrorPage
        errorCode={errorResponse?.statusCode}
        message={errorResponse?.message}
      />
    );
  }

  const handleAddCategory = () => {
    setOpen("add");
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <TablePageLayout
        title="All Categories"
        description="Manage category assignments"
        onAddButtonClick={handleAddCategory}
        addButtonText="Add Category"
        modulePermission="expense_category"
        moduleAction="add"
      >
        <CategoryTable
          data={allCategories}
          totalCount={totalCount}
          loading={isLoading}
          currentPage={pagination.page}
          paginationCallbacks={{ onPaginationChange }}
        />
      </TablePageLayout>

      {open && <CategoryActionModal key={"category-action-modal"} />}
    </Main>
  );
};

export default ExpenseCategory;
