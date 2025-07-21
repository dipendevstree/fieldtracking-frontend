import API from "@/config/api/api"
import instance from "@/config/instance/instance"

export const getDriverDetails = async (orderId: string) => {
  try {
    const { data } = await instance.get({
      url: `${API.drivers.details}/${orderId}`,
    })
    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
