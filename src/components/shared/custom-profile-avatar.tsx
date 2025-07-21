import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Interface for user data
interface UserData {
    name: string
    email?: string
    avatar?: string | null
    status?: 'active' | 'inactive' | 'pending' | 'suspended'
    role?: string
    verified?: boolean
}

// Component props
interface TableAvatarProps {
    user: UserData
    size?: 'xs' | 'sm' | 'md' | 'lg'
    showName?: boolean
    showEmail?: boolean
    showStatus?: boolean
    showRole?: boolean
    showVerified?: boolean
    layout?: 'horizontal' | 'vertical'
    className?: string
    onClick?: () => void
    avatarClassName?: string
    textClassName?: string
}

export const TableAvatar: React.FC<TableAvatarProps> = ({
    user,
    size = 'sm',
    showName = true,
    showEmail = false,
    showStatus = false,
    showRole = false,
    showVerified = false,
    layout = 'horizontal',
    className = '',
    onClick,
    avatarClassName = '',
    textClassName = ''
}) => {
    // Get initials from name
    const getInitials = (name: string): string => {
        return name
            ?.split(' ')
            ?.map(word => word.charAt(0))
            ?.join('')
            ?.toUpperCase()
            ?.slice(0, 2)
    }

    // Size configurations
    const sizeConfig = {
        xs: {
            avatar: 'h-6 w-6 text-xs',
            text: 'text-xs',
            container: 'gap-2'
        },
        sm: {
            avatar: 'h-8 w-8 text-sm',
            text: 'text-sm',
            container: 'gap-2'
        },
        md: {
            avatar: 'h-10 w-10 text-base',
            text: 'text-sm',
            container: 'gap-3'
        },
        lg: {
            avatar: 'h-12 w-12 text-lg',
            text: 'text-base',
            container: 'gap-3'
        }
    }

    // Status badge colors
    const statusConfig = {
        active: 'bg-green-100 text-green-800 border-green-200',
        inactive: 'bg-gray-100 text-gray-800 border-gray-200',
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        suspended: 'bg-red-100 text-red-800 border-red-200'
    }

    const config = sizeConfig[size]
    const isClickable = !!onClick

    return (
        <div
            className={cn(
                'flex items-center',
                config.container,
                layout === 'vertical' ? 'flex-col items-center text-center' : 'flex-row',
                isClickable && 'cursor-pointer hover:opacity-80 transition-opacity',
                className
            )}
            onClick={onClick}
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <Avatar className={cn(config.avatar, avatarClassName)}>
                    <AvatarImage
                        src={user.avatar || undefined}
                        alt={user.name}
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>

                {/* Verified badge */}
                {showVerified && user?.verified && (
                    <div className="absolute -bottom-1 -right-1">
                        <div className="bg-blue-500 rounded-full p-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Status indicator dot */}
                {showStatus && user?.status && (
                    <div className={cn(
                        "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                        user.status === 'active' && 'bg-green-500',
                        user.status === 'inactive' && 'bg-gray-400',
                        user.status === 'pending' && 'bg-yellow-500',
                        user.status === 'suspended' && 'bg-red-500'
                    )} />
                )}
            </div>

            {/* Text Content */}
            {(showName || showEmail || showRole) && (
                <div className={cn(
                    'flex flex-col min-w-0 flex-1',
                    layout === 'vertical' ? 'items-center mt-1' : '',
                    textClassName
                )}>
                    {/* Name */}
                    {showName && (
                        <div className={cn(
                            'font-medium text-gray-900 truncate',
                            config?.text
                        )}>
                            {user.name}
                        </div>
                    )}

                    {/* Email */}
                    {showEmail && user.email && (
                        <div className={cn(
                            'text-gray-500 truncate',
                            size === 'xs' ? 'text-xs' : 'text-xs'
                        )}>
                            {user.email}
                        </div>
                    )}

                    {/* Role */}
                    {showRole && user.role && (
                        <div className="flex items-center gap-1 mt-1">
                            <Badge
                                variant="secondary"
                                className={cn(
                                    'text-xs capitalize',
                                    size === 'xs' && 'text-xs px-1 py-0'
                                )}
                            >
                                {user.role}
                            </Badge>
                        </div>
                    )}

                    {/* Status Badge */}
                    {showStatus && user.status && !showRole && (
                        <div className="flex items-center gap-1 mt-1">
                            <Badge
                                className={cn(
                                    'text-xs capitalize border',
                                    statusConfig[user?.status],
                                    size === 'xs' && 'text-xs px-1 py-0'
                                )}
                                variant="outline"
                            >
                                {user.status}
                            </Badge>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
