import CustomButton from '@/components/shared/custom-button'
import CustomTooltip from '@/components/shared/custom-tooltip'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ViewAction } from '@/features/driver/components/table-action-button'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { IconEdit } from '@tabler/icons-react'
import { useRouter } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'
import { useUsersStore } from '../store/merchant.store'
import { Merchant } from '../types'


interface DataTableRowActionsProps {
    row: Row<Merchant>,
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useUsersStore()
    const { navigate } = useRouter()

    const handleEdit = (row: Row<Merchant>) => {
        setOpen('edit')
        setCurrentRow(row.original)
    }

    // const handleDelete = (row: Row<Merchant>) => {
    //     setOpen('delete')
    //     setCurrentRow(row.original)
    // }

    return (

        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <CustomButton
                    variant='ghost'
                    className='data-[state=open]:bg-muted flex h-8 w-8 p-0 cursor-pointer'
                >
                    <CustomTooltip title='Actions' >
                        <DotsHorizontalIcon className='h-4 w-4' />
                        <span className='sr-only'>Open menu</span>
                    </CustomTooltip>
                </CustomButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-[160px]'>
                <ViewAction
                    key="view"
                    row={row}
                    onClick={() => {
                        navigate({ to: `/merchants/details/${row.original.user_id}` })
                        // setCurrentRow(row.original)
                    }}
                />
                <DropdownMenuItem
                    onClick={() => handleEdit(row)}
                >
                    Edit
                    <DropdownMenuShortcut>
                        <IconEdit size={16} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
                {/* <DropdownMenuSeparator /> */}
                {/* <DropdownMenuItem
                    onClick={() => handleDelete(row)}
                    className='text-red-500!'
                >
                    Delete
                    <DropdownMenuShortcut>
                        <IconTrash size={16} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>

    )
}
