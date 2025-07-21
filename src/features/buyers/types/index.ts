// Role interface
interface Role {
    role_id: string
    name: string
}

// User interface
interface User {
    user_id: string
    name: string
    email: string
    mobile: string
    profile_pic: string
    gender: 'male' | 'female' | 'other'
    language: string
    status: boolean
    created_at: string
    updated_at: string
    role: Role
    country_code?: string
    country?: string
}

// API Response interface
interface UserResponse {
    docs: User[]
    count: number
}

// For pagination and filtering
interface UserListParams {
    page?: number
    limit?: number
    search?: string
}

// Paginated API Response
interface PaginatedUserResponse extends UserResponse {
    page?: number
    limit?: number
    total_pages?: number
    has_next_page?: boolean
    has_prev_page?: boolean
}

// UserForm interface aligned with formSchema
export interface UserForm {
    name: string
    email: string
    mobile: string
    gender: 'male' | 'female' | 'other' | undefined
    country_code?: string
    country?: string
    isEdit?: boolean
}

// Export all types
export type {
    Role,
    User,
    UserResponse,
    UserListParams,
    PaginatedUserResponse,
}

export type ErrorResponse = {
    response?: {
        data?: {
            statusCode?: number
            message?: string
        }
    }
}