import React from 'react'
import { Navigate } from '@tanstack/react-router'
import { usePermission } from '../hooks/use-permission'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  fallback?: React.ReactNode
}

export function ProtectedRoute({
  children,
  requiredPermission,
  fallback = <Navigate to='/403' replace />,
}: ProtectedRouteProps) {
  const { hasAccess, isAuthenticated } = usePermission()

  if (!isAuthenticated) {
    return <Navigate to='/sign-in' replace />
  }

  if (requiredPermission && !hasAccess(requiredPermission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
