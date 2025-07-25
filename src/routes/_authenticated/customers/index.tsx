import { createFileRoute } from '@tanstack/react-router'
import { CustomerDirectoryPage } from '../../../features/customers/components/CustomerDirectoryPage'

    export const Route = createFileRoute('/_authenticated/customers/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CustomerDirectoryPage />
}
