import CustomButton from '@/components/shared/custom-button'
import CustomTooltip from '@/components/shared/custom-tooltip'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ActionProps } from '@/types'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useRouter } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { useUsersStore } from '../store/user.store'
import { Driver } from '../types'

export function ViewAction<TData>({ row, onClick }: ActionProps<TData>) {
    return (
        <DropdownMenuItem onClick={() => onClick(row)}>
            View
            <DropdownMenuShortcut>
                <Eye size={16} />
            </DropdownMenuShortcut>
        </DropdownMenuItem>
    )
}

// Edit Action Component
export function EditAction<TData>({ row, onClick }: ActionProps<TData>) {
    return (
        <DropdownMenuItem onClick={() => onClick(row)}>
            Edit
            <DropdownMenuShortcut>
                <IconEdit size={16} />
            </DropdownMenuShortcut>
        </DropdownMenuItem>
    )
}

// Delete Action Component
export function DeleteAction<TData>({ row, onClick }: ActionProps<TData>) {
    return (
        <DropdownMenuItem onClick={() => onClick(row)} className="text-red-500">
            Delete
            <DropdownMenuShortcut>
                <IconTrash size={16} />
            </DropdownMenuShortcut>
        </DropdownMenuItem>
    )
}

// Generic DataTableRowActions Component
interface DataTableRowActionsProps<TData> {
    row: Row<TData>
    actions: React.ReactNode[]
}

export function DataTableRowActions<TData>({ actions }: DataTableRowActionsProps<TData>) {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <CustomButton
                    variant="ghost"
                    className="data-[state=open]:bg-muted flex h-8 w-8 p-0 cursor-pointer"
                >
                    <CustomTooltip title="Actions">
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </CustomTooltip>
                </CustomButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                {actions?.map((action, index) => (
                    <>
                        {action}
                        {index === actions?.length - 2 && <DropdownMenuSeparator />}
                    </>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// Driver-specific DataTableRowActions
export function DriverTableRowActions({ row }: { row: Row<Driver> }) {
    const { setOpen, setCurrentRow } = useUsersStore()
    const { navigate } = useRouter()

    const actions = [
        <ViewAction
            key="view"
            row={row}
            onClick={() => {
                navigate({ to: `/drivers/details/${row.original.user_id}` })
                setOpen('view')
                setCurrentRow(row.original)
            }}
        />,
        // <EditAction
        //     key="edit"
        //     row={row}
        //     onClick={() => {
        //         setOpen('edit')
        //         setCurrentRow(row.original)
        //     }}
        // />,
        // <DeleteAction
        //     key="delete"
        //     row={row}
        //     onClick={() => {
        //         setOpen('delete')
        //         setCurrentRow(row.original)
        //     }}
        // />,
    ]

    return <DataTableRowActions row={row} actions={actions} />
}
