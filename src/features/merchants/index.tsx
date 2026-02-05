import { useState } from "react";
import {
  ALL_PAGE_META_DATA,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from "@/data/app.data";
import TablePageLayout from "@/components/layout/table-page-layout";
import { ErrorPage } from "@/components/shared/custom-error";
import { MerchantsActionModal } from "./components/action-form-modal";
import MerchantTable from "./components/table";
import { useGetMerchants } from "./services/merchants.hook";
import { useUsersStore } from "./store/merchant.store";
import { ErrorResponse } from "./types";

const SellersPage = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });
  const { setOpen } = useUsersStore();
  const { description, title } = ALL_PAGE_META_DATA.sellers;
  const {
    totalCount = 0,
    merchants = [],
    isLoading,
    error,
  } = useGetMerchants(pagination);
  // const { setOpen } = useUsersStore()

  if (error) {
    const errorResponse = (error as ErrorResponse)?.response?.data;
    return (
      <ErrorPage
        errorCode={errorResponse?.statusCode}
        message={errorResponse?.message}
      />
    );
  }
  const handleAddMerchant = () => {
    setOpen("add");
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };
  return (
    <TablePageLayout
      title={title}
      description={description}
      onAddButtonClick={handleAddMerchant}
    >
      <MerchantTable
        data={merchants}
        totalCount={totalCount}
        loading={isLoading}
        currentPage={pagination.page}
        pageSize={pagination.limit}
        paginationCallbacks={{ onPaginationChange }}
      />

      <MerchantsActionModal key={"merchants-action-modal"} />
    </TablePageLayout>
  );
};

export default SellersPage;
