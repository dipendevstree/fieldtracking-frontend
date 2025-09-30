import { useState, useEffect } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { cn } from "@/lib/utils";
import { Main } from "@/components/layout/main";
import TablePageLayout from "@/components/layout/table-page-layout";
import { ErrorPage } from "@/components/shared/custom-error";
import { useExpenseCategoriesStore } from "./store/expense-categories.store";
import { ErrorResponse } from "@/features/merchants/types";
import { ExpenseCategoryActionModal } from "./components/action-form-modal";
import ExpenseCategoryTable from "./components/table";
import { useGetExpenseCategoriesData } from "./services/expense-categories.hook";

const ExpenseCategoriesPage = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });

  const {
    expenseCategories = [],
    totalCount = 0,
    isLoading,
    error,
  } = useGetExpenseCategoriesData(pagination);

  const { setOpen, open } = useExpenseCategoriesStore();

  // Debug logging
  useEffect(() => {
    console.log("Expense Categories Data:", {
      expenseCategories,
      totalCount,
      isLoading,
      error,
      pagination,
    });
    // Log individual category structure to debug ID field
    if (expenseCategories && expenseCategories.length > 0) {
      console.log("First category structure:", expenseCategories[0]);
      console.log("Available fields:", Object.keys(expenseCategories[0]));
    }
  }, [expenseCategories, totalCount, isLoading, error, pagination]);

  if (error) {
    const errorResponse = (error as ErrorResponse)?.response?.data;
    console.error("Expense Categories Error:", error);
    return (
      <ErrorPage
        errorCode={errorResponse?.statusCode}
        message={errorResponse?.message}
      />
    );
  }

  const handleAddExpenseCategory = () => {
    console.log("Opening add expense category modal");
    setOpen("add-category");
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    console.log("Pagination changed:", { page, pageSize });
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  return (
    <Main className={cn("flex flex-col p-0")}>
      <TablePageLayout
        title="All Expense Categories"
        description="Manage expense category assignments"
        onAddButtonClick={handleAddExpenseCategory}
        addButtonText="Add Expense Category"
        modulePermission="expense_category"
        moduleAction="add"
        className="p-0"
      >
        <ExpenseCategoryTable
          data={expenseCategories}
          totalCount={totalCount}
          loading={isLoading}
          currentPage={pagination.page}
          paginationCallbacks={{ onPaginationChange }}
        />
      </TablePageLayout>

      {open && (
        <ExpenseCategoryActionModal key={"expense-category-action-modal"} />
      )}
    </Main>
  );
};

export default ExpenseCategoriesPage;
