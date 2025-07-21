import { useNavigate } from '@tanstack/react-router'
import { useRolesStore } from '../store/roles.store'

export function useRoleNavigation() {
  const navigate = useNavigate()
  const { setCurrentRow } = useRolesStore()

  const navigateToAddRole = () => {
    setCurrentRow(null)
    navigate({ to: '/user-management/add-roles-permission' })
  }

  const navigateToEditRole = (roleData: any) => {
    setCurrentRow(roleData)
    navigate({
      to: '/user-management/edit-roles-permission/$roleId',
      params: { roleId: roleData.id },
    })
  }

  const navigateToRolesList = () => {
    setCurrentRow(null)
    navigate({ to: '/user-management/roles' })
  }

  return {
    navigateToAddRole,
    navigateToEditRole,
    navigateToRolesList,
  }
}
