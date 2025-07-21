export interface LoginRequest {
    readonly email: string
    readonly password: string
}

// Permission structure
export interface Permission {
    readonly id: string
    readonly name: string
}

// Permission group with nested permissions
export interface PermissionGroup {
    readonly id: string
    readonly name: string
    readonly children: readonly Permission[]
}

// User data structure from login response
export interface LoginUser {
    readonly user_id: string
    readonly name: string
    readonly email: string
    readonly mobile: string | null
    readonly access_token: string
    readonly permissions: readonly PermissionGroup[]
}

// Complete login response structure
export interface LoginResponse {
    readonly data: LoginUser
    readonly message?: string
    readonly success?: boolean
}