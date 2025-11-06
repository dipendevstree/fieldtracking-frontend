import { useMemo } from 'react'
import { useAuthStore } from '@/stores/use-auth-store'
import { Permission } from '../types'
import { PermissionManager } from '../utils/permission-utils'

export function usePermission() {
  const { user } = useAuthStore()
  const permissions = user?.role?.permissions as any

  const permissionManager = useMemo(() => {
    // If user is super admin, we don't need permission manager
    if (user?.isSuperAdmin) return null

    if (!permissions) return null
    return new PermissionManager(permissions as unknown as Permission[])
  }, [permissions, user?.isSuperAdmin])

  const hasAccess = (menuKey: string): boolean => {
    // If user is super admin, only allow access to 'super_admin' menu
    if (user?.isSuperAdmin) {
      return menuKey === 'super_admin'
    }

    return permissionManager?.hasMenuAccess(menuKey) ?? false
  }

  const canPerformAction = (
    menuKey: string,
    action: 'add' | 'edit' | 'viewOwn' | 'viewGlobal' | 'delete'
  ): boolean => {
    // If user is super admin, only allow actions on 'super_admin' menu
    if (user?.isSuperAdmin) {
      return menuKey === 'super_admin'
    }

    return permissionManager?.canPerformAction(menuKey, action) ?? false
  }

  const getAccessibleMenuKeys = (): string[] => {
    // If user is super admin, return only 'super_admin' menu key
    if (user?.isSuperAdmin) {
      return ['super_admin']
    }

    return permissionManager?.getAccessibleMenuKeys() ?? []
  }

  return {
    hasAccess,
    canPerformAction,
    getAccessibleMenuKeys,
    isAuthenticated: !!user,
    user,
  }
}
