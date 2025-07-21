import { Permission } from '../types'

export class PermissionManager {
  private permissions: Permission[]

  constructor(permissions: Permission[]) {
    this.permissions = permissions
  }

  // Check if user has permission for a specific menu key
  hasMenuAccess(menuKey: string): boolean {
    return this.findPermissionByKey(menuKey) !== null
  }

  // Check if user can perform specific action
  canPerformAction(
    menuKey: string,
    action: 'add' | 'edit' | 'viewOwn' | 'viewGlobal' | 'delete'
  ): boolean {
    const permission = this.findPermissionByKey(menuKey)
    return permission ? permission[action] : false
  }

  // Get all accessible menu keys
  getAccessibleMenuKeys(): string[] {
    const keys: string[] = []
    this.collectMenuKeys(this.permissions, keys)
    return keys
  }

  // Find permission by menu key (including nested children)
  private findPermissionByKey(menuKey: string): Permission | null {
    for (const permission of this.permissions) {
      if (permission.menuKey === menuKey) {
        return permission
      }

      // Search in children
      const childPermission = this.findInChildren(permission.children, menuKey)
      if (childPermission) {
        return childPermission
      }
    }
    return null
  }

  private findInChildren(
    children: Permission[],
    menuKey: string
  ): Permission | null {
    for (const child of children) {
      if (child.menuKey === menuKey) {
        return child
      }

      const nestedChild = this.findInChildren(child.children, menuKey)
      if (nestedChild) {
        return nestedChild
      }
    }
    return null
  }

  private collectMenuKeys(permissions: Permission[], keys: string[]): void {
    for (const permission of permissions) {
      keys.push(permission.menuKey)
      this.collectMenuKeys(permission.children, keys)
    }
  }
}
