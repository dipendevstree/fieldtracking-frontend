import { useAuthStore } from '@/stores/use-auth-store'
import { useRouter } from '@tanstack/react-router'


export function useProtectedNavigation() {
    const router = useRouter()
    const { canAccessRoute } = useAuthStore()

    const navigateWithPermissionCheck = (path: string) => {
        if (canAccessRoute(path)) {
            router.navigate({ to: path })
        } else {
            router.navigate({ to: '/401' })
        }
    }

    return { navigateWithPermissionCheck, canAccessRoute }
}