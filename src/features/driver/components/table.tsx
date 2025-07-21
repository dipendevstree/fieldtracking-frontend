import { CustomDataTable } from "@/components/shared/custom-data-table"
import { ColumnDef } from "@tanstack/react-table"

import { columns } from "./columns"
import { Driver } from "../types"
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination"


interface UserTableProps {
    data: Driver[]
    totalCount: number
    loading?: boolean
    paginationCallbacks?: PaginationCallbacks
    currentPage?: number
}

const MerchantTable = ({ data, totalCount, loading, paginationCallbacks, currentPage }: UserTableProps) => {
    return (
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
            <CustomDataTable currentPage={currentPage} loading={loading} data={data} columns={columns as ColumnDef<unknown>[]} totalCount={totalCount} key={'merchants'}
                paginationCallbacks={paginationCallbacks} />
        </div>
    )
}

export default MerchantTable