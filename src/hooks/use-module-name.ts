import { useLocation } from "@tanstack/react-router"

const MODULE_NAME_MAP: Record<string, string> = {
  "user-management": "User Management",
  "edit-roles-permission": "Edit Roles & Permission",
  customers: "Customer Directory",
  "add-customer": "Customer Management",
}

const isIdLike = (segment: string) => {
  // UUID v4 or purely numeric
  return /^[0-9a-fA-F-]{8,}$/.test(segment) || /^\d+$/.test(segment)
}

export const useModuleName = () => {
  const location = useLocation()
  const segments = location.pathname.split("/").filter(Boolean)

  if (segments.length === 0) return ""

  let targetSegment = segments[segments.length - 1]

  if (isIdLike(targetSegment) && segments.length > 1) {
    targetSegment = segments[segments.length - 2]
  }

  return MODULE_NAME_MAP[targetSegment] 
    ?? targetSegment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}
