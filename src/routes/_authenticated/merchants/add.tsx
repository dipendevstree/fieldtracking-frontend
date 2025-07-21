import MerchantsAddEdit from '@/features/merchants/add-edit'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/merchants/add')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MerchantsAddEdit />
}
