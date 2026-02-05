import { useState } from "react";
import {
  ALL_PAGE_META_DATA,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from "@/data/app.data";
import TablePageLayout from "@/components/layout/table-page-layout";
import { ErrorPage } from "@/components/shared/custom-error";
import { ActionFormModal } from "./components/action-form-modal";
import UsersTable from "./components/table";
import { useGetUsers } from "./services/users.hook";
import { useUsersStore } from "./store/user.store";
import { ErrorResponse } from "./types";

const BuyersPage = () => {
  const { description, title } = ALL_PAGE_META_DATA.buyers;
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });
  const {
    totalCount = 0,
    listData = [],
    isLoading,
    error,
  } = useGetUsers(pagination);
  const { setOpen } = useUsersStore();

  const handleAddMerchant = () => {
    setOpen("add");
  };

  if (error) {
    const errorResponse = (error as ErrorResponse)?.response?.data;
    return (
      <ErrorPage
        errorCode={errorResponse?.statusCode}
        message={errorResponse?.message}
      />
    );
  }

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  return (
    <TablePageLayout
      title={title}
      description={description}
      onAddButtonClick={handleAddMerchant}
    >
      <UsersTable
        data={listData}
        totalCount={totalCount}
        loading={isLoading}
        currentPage={pagination.page}
        pageSize={pagination.limit}
        paginationCallbacks={{ onPaginationChange }}
      />

      <ActionFormModal key={"merchants-action-modal"} />
    </TablePageLayout>
  );
};
export default BuyersPage;
