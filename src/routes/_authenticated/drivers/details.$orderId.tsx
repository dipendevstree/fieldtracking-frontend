import API from '@/config/api/api'
import instance from '@/config/instance/instance'
import DriverDetailsPage from '@/features/driver/details'
import { DriverData } from '@/features/driver/details/types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/drivers/details/$orderId')(
  {
    loader: async ({ params: { orderId } }) => {
      try {
        const response = await instance.get({ url: `${API.drivers.details}/${orderId}` })
        const { data } = response
        return { data: data as DriverData, error: null }
      } catch (error: unknown) {
        return { data: null, error: (error as Error)?.message }
      }
    },
    component: RouteComponent,
  },
)

function RouteComponent() {
  const { data } = Route.useLoaderData()
  return <DriverDetailsPage driverData={data as DriverData} />
}
