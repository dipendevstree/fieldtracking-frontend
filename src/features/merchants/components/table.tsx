import { CustomDataTable } from "@/components/shared/custom-data-table"
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination"
import { ColumnDef } from "@tanstack/react-table"
import { Merchant } from "../types"
import { columns } from "./columns"


interface MerchantTableProps {
    data: Merchant[]
    totalCount: number
    loading?: boolean
    paginationCallbacks?: PaginationCallbacks
    currentPage?: number
    onSearchChange?: (value: string) => void
}

const MerchantTable = ({ data, totalCount, loading, paginationCallbacks, currentPage }: MerchantTableProps) => {
    return (
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
            <CustomDataTable currentPage={currentPage} paginationCallbacks={paginationCallbacks} loading={loading} data={data} columns={columns as ColumnDef<unknown>[]} totalCount={totalCount} key={'merchants'} />
        </div>
    )
}

export default MerchantTable
