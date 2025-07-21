import API from '@/config/api/api'
import instance from '@/config/instance/instance'
import MerchantDetailsPage from '@/features/merchants/details'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/merchants/details/$id')({
  loader: async ({ params: { id } }) => {
    try {
      const response = await instance.get({ url: `${API.merchants.details}/${id}` })
      const { data } = response
      return { data: data, error: null }
    } catch (error: unknown) {
      return { data: null, error: (error as Error)?.message }
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = Route.useLoaderData()
  return <MerchantDetailsPage data={data} />
}
