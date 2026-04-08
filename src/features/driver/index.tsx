import { ErrorPage } from "@/components/shared/custom-error";
import { ActionFormModal } from "./components/action-form-modal";
import DriverTable from "./components/table";

import TablePageLayout from "@/components/layout/table-page-layout";
import {
  ALL_PAGE_META_DATA,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from "@/data/app.data";
import { useState } from "react";
import { useGetDrivers } from "./services/drivers.hook";
import { useUsersStore } from "./store/user.store";
import { ErrorResponse } from "./types";

const DriverPage = () => {
  const { description, title } = ALL_PAGE_META_DATA.drivers;
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });
  const {
    totalCount = 0,
    listData = [],
    isLoading,
    error,
  } = useGetDrivers(pagination);
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

  return (
    <TablePageLayout
      title={title}
      description={description}
      onAddButtonClick={handleAddMerchant}
    >
      <DriverTable
        data={listData}
        totalCount={totalCount}
        loading={isLoading}
        currentPage={pagination.page}
        pageSize={pagination.limit}
        paginationCallbacks={{
          onPaginationChange(page, pageSize) {
            setPagination((prev) => ({ ...prev, page, limit: pageSize }));
          },
        }}
      />

      <ActionFormModal key={"merchants-action-modal"} />
    </TablePageLayout>
  );
};

export default DriverPage;
