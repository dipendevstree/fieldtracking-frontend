import React from 'react'

import { Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/use-auth-store'
import { UserRole } from '../layout/types'

interface RouteGuardProps {
    children: React.ReactNode
    requiredResource?: string
    requiredAction?: string
    requiredRole?: string
    requiredRoles?: string[]
    fallbackPath?: string
}

export function RouteGuard({
    children,
    requiredResource,
    requiredAction = 'read',
    requiredRole,
    requiredRoles,
    fallbackPath = '/403'
}: RouteGuardProps) {
    const { user, hasPermission, hasRole, hasAnyRole, isLoading } = useAuthStore()
    // eslint-disable-next-line no-console
    console.log('🛡️ RouteGuard: Starting route guard check', {
        requiredResource,
        requiredAction,
        requiredRole,
        requiredRoles,
        fallbackPath,
        isLoading,
        user: user ? { id: user.user_id, email: user.email } : null
    })

    if (isLoading) {
        // eslint-disable-next-line no-console
        console.log('⏳ RouteGuard: Auth is loading, showing spinner')
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!user) {
        // eslint-disable-next-line no-console
        console.log('❌ RouteGuard: No user found, redirecting to sign-in')
        return <Navigate to="/sign-in" />
    }
    // eslint-disable-next-line no-console
    console.log('✅ RouteGuard: User authenticated', {
        userId: user.user_id,
        userEmail: user.email
    })

    // Check single role
    if (requiredRole) {
        // eslint-disable-next-line no-console
        console.log('🔍 RouteGuard: Checking single role requirement', { requiredRole })
        const hasRequiredRole = hasRole(requiredRole as UserRole)
        // eslint-disable-next-line no-console
        console.log('📋 RouteGuard: Single role check result', {
            requiredRole,
            hasRole: hasRequiredRole
        })

        if (!hasRequiredRole) {
            // eslint-disable-next-line no-console
            console.log('❌ RouteGuard: User lacks required role, redirecting to fallback', {
                requiredRole,
                fallbackPath
            })
            return <Navigate to={fallbackPath} />
        }
        // eslint-disable-next-line no-console
        console.log('✅ RouteGuard: Single role requirement satisfied')
    }
    // eslint-disable-next-line no-console
    console.log("requiredRoles", requiredRoles)

    // Check multiple roles (user needs ANY of them)
    if (requiredRoles) {
        // eslint-disable-next-line no-console
        console.log('🔍 RouteGuard: Checking multiple roles requirement', { requiredRoles })
        const hasAnyRequiredRole = hasAnyRole(requiredRoles as UserRole[])
        // eslint-disable-next-line no-console
        console.log('📋 RouteGuard: Multiple roles check result', {
            requiredRoles,
            hasAnyRole: hasAnyRequiredRole
        })

        if (!hasAnyRequiredRole) {
            // eslint-disable-next-line no-console
            console.log('❌ RouteGuard: User lacks any of the required roles, redirecting to fallback', {
                requiredRoles,
                fallbackPath
            })
            return <Navigate to={fallbackPath} />
        }
        // eslint-disable-next-line no-console
        console.log('✅ RouteGuard: Multiple roles requirement satisfied')
    }

    // Check permission-based access
    if (requiredResource) {
        // eslint-disable-next-line no-console
        console.log('🔍 RouteGuard: Checking permission-based access', {
            requiredResource,
            requiredAction
        })
        const hasRequiredPermission = hasPermission(requiredResource)
        // eslint-disable-next-line no-console
        console.log('📋 RouteGuard: Permission check result', {
            requiredResource,
            requiredAction,
            hasPermission: hasRequiredPermission
        })

        if (!hasRequiredPermission) {
            // eslint-disable-next-line no-console
            console.log('❌ RouteGuard: User lacks required permission, redirecting to fallback', {
                requiredResource,
                requiredAction,
                fallbackPath
            })
            return <Navigate to={fallbackPath} />
        }
        // eslint-disable-next-line no-console
        console.log('✅ RouteGuard: Permission requirement satisfied')
    }
    // eslint-disable-next-line no-console
    console.log('🎉 RouteGuard: All checks passed, rendering children')
    return <>{children}</>
}