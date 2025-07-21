import { useMemo } from 'react'
import { sidebarData as fullSidebarData } from '@/components/layout/data/sidebar-data'
import { filterSidebarByPermissions } from '../utils/sidebar-filter'
import { usePermission } from './use-permission'

export function useRoleBasedNavigation(backendPermissions: any) {
  console.log('backendPermissions', backendPermissions)
  const { hasAccess, canPerformAction, isAuthenticated } = usePermission()

  const sidebarData = useMemo(() => {
    if (!isAuthenticated) {
      return { ...fullSidebarData, navGroups: [] }
    }

    return filterSidebarByPermissions(
      fullSidebarData,
      hasAccess,
      backendPermissions?.permissions
    )
  }, [hasAccess, isAuthenticated, backendPermissions])

  return {
    sidebarData,
    hasAccess,
    canPerformAction,
    isAuthenticated,
  }
}
