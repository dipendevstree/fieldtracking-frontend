import API from '@/config/api/api'
import usePostData from '@/hooks/use-post-data'
import { LoginUser } from '../types'

export const useLogin = (onSuccess: (data: LoginUser) => void) => {
  return usePostData({
    url: API.auth.superAdminLogin,
    onSuccess: (data: any) => {
      onSuccess(data)
    },
  })
}
