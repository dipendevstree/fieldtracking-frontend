import React from 'react'
import { useAuthStore } from '@/stores/use-auth-store'
import { usePermission } from '../hooks/use-permission'

interface PermissionGateProps {
  children: React.ReactNode
  requiredPermission: string
  action?: 'add' | 'edit' | 'viewOwn' | 'viewGlobal' | 'delete'
  fallback?: React.ReactNode
}

export function PermissionGate({
  children,
  requiredPermission,
  action,
  fallback = null,
}: PermissionGateProps) {
  const { user } = useAuthStore()
  const isSuperAdmin = user?.isSuperAdmin
  const { hasAccess, canPerformAction } = usePermission()
  const hasPermission = action
    ? canPerformAction(requiredPermission, action)
    : hasAccess(requiredPermission)
  if (isSuperAdmin) {
    return <>{children}</>
  }
  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
