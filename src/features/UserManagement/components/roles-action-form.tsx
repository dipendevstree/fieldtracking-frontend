import { useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Main } from "@/components/layout/main";
import CustomButton from "@/components/shared/custom-button";
import { roleFormSchema, TRoleFormSchema } from "../data/roles-schema";
import {
  useCreateRole,
  useUpdateRole,
  useGetRolesAndPermissionById,
  useOrganizationMenulist,
} from "../services/Roles.hook";
import { useRolesStore } from "../store/roles.store";
import { toast } from "sonner";

interface MenuItem {
  organizationMenuId: string;
  menuName: string;
  menuKey: string;
  parentId?: string | null;
  isParent: boolean;
  hasChildren?: boolean;
  children?: MenuItem[];
  level: number;
}

interface Permission {
  permissionId: string;
  roleId: string;
  organizationId: string;
  organizationMenuId: string;
  viewOwn: boolean;
  viewGlobal: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  createdDate: string;
  modifiedDate: string;
  deletedDate: string | null;
  createdBy: string;
  updatedBy: string | null;
  organizationMenu: {
    organizationMenuId: string;
    menuName: string;
    menuKey: string;
    parentMenuId: string | null;
    organizationId: string;
    masterMenuId: string;
    createdBy: string;
    updatedBy: string | null;
    isActive: boolean;
    deletedDate: string | null;
    createdDate: string;
    modifiedDate: string;
  };
}

interface OrganizationMenu {
  organizationMenuId: string;
  menuName: string;
  menuKey: string;
  parentMenuId: string | null;
  organizationId: string;
  masterMenuId: string;
  createdBy: string;
  updatedBy: string | null;
  isActive: boolean;
  deletedDate: string | null;
  createdDate: string;
  modifiedDate: string;
}

interface Props {
  currentRow?: Partial<TRoleFormSchema>;
  isEdit?: boolean;
}

export function RoleActionForm({ currentRow, isEdit: propIsEdit }: Props) {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const { currentRow: storeCurrentRow, setCurrentRow } = useRolesStore();

  // Ref to track if form has been initialized to prevent multiple initializations
  const formInitialized = useRef(false);

  // Get roleId from URL params (for edit mode when page is refreshed)
  const roleIdFromUrl = params?.roleId;
  const isEdit =
    propIsEdit ?? !!(currentRow || storeCurrentRow || roleIdFromUrl);

  // Determine which role data to use
  const roleData = currentRow || storeCurrentRow;
  const effectiveRoleId = roleData?.roleId || roleIdFromUrl;

  // Get organization menu list
  const { organizationMenus, isLoading: isMenusLoading } =
    useOrganizationMenulist();

  // Get role data with permissions (only when editing)
  const { data: rolePermission, isLoading: isRoleLoading } =
    useGetRolesAndPermissionById(effectiveRoleId, {
      enabled: isEdit && !!effectiveRoleId,
    });

  // Update store with fetched role data if we got it from URL
  useEffect(() => {
    if (rolePermission && !storeCurrentRow && roleIdFromUrl) {
      console.log("Setting current row from API data");
      setCurrentRow({
        roleId: rolePermission.roleId,
        roleName: rolePermission.roleName,
        id: rolePermission.roleId,
        createdBy: rolePermission.createdBy,
        createdAt: new Date(rolePermission.createdDate),
        updatedAt: new Date(rolePermission.modifiedDate),
        permissionsCount: rolePermission.permissions?.length || 0,
      });
    }
  }, [rolePermission, storeCurrentRow, roleIdFromUrl, setCurrentRow]);

  const rolePermissions = rolePermission?.permissions || [];

  const {
    mutate: createRole,
    isPending: isCreateLoading,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateRole();

  const {
    mutate: updateRole,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateRole(effectiveRoleId || "");

  // Navigate back on successful create or update
  useEffect(() => {
    if (
      (isCreateSuccess && !isCreateError) ||
      (isUpdateSuccess && !isUpdateError)
    ) {
      handleCancel();
    }
  }, [isCreateSuccess, isCreateError, isUpdateSuccess, isUpdateError]);

  // Process menu items into a hierarchical structure
  const processMenuItems = useMemo((): MenuItem[] => {
    if (!organizationMenus?.length) return [];

    const processedMenus: MenuItem[] = [];
    const menuMap = new Map<string, MenuItem>();

    organizationMenus.forEach((orgMenu: OrganizationMenu) => {
      const menuItem: MenuItem = {
        organizationMenuId: orgMenu.organizationMenuId,
        menuName: orgMenu.menuName,
        menuKey: orgMenu.menuKey,
        parentId: orgMenu.parentMenuId,
        isParent: !orgMenu.parentMenuId,
        hasChildren: false,
        children: [],
        level: orgMenu.parentMenuId ? 1 : 0,
      };
      menuMap.set(orgMenu.organizationMenuId, menuItem);
    });

    const parentMenus: MenuItem[] = [];
    const childMenus: MenuItem[] = [];

    menuMap.forEach((menuItem) => {
      if (menuItem.isParent) {
        parentMenus.push(menuItem);
      } else {
        childMenus.push(menuItem);
      }
    });

    childMenus.forEach((child) => {
      if (child.parentId && menuMap.has(child.parentId)) {
        const parent = menuMap.get(child.parentId)!;
        parent.children!.push(child);
        parent.hasChildren = true;
      }
    });

    parentMenus.forEach((parent) => {
      processedMenus.push(parent);
      if (parent.children && parent.children.length > 0) {
        parent.children.sort((a, b) => a.menuName.localeCompare(b.menuName));
        processedMenus.push(...parent.children);
      }
    });

    childMenus.forEach((child) => {
      if (!child.parentId || !menuMap.has(child.parentId)) {
        processedMenus.push(child);
      }
    });

    return processedMenus;
  }, [organizationMenus]);

  // FIXED: Stable calculation of initial menu IDs using useMemo with proper dependencies
  const initialMenuIds = useMemo(() => {
    if (!processMenuItems.length) return [];

    return processMenuItems.map((menu) => {
      const permission = rolePermissions.find(
        (p: Permission) => p.organizationMenuId === menu.organizationMenuId
      );
      return {
        id: menu.organizationMenuId,
        permissionId: permission?.permissionId || "",
        add: permission?.add || false,
        viewGlobal: permission?.viewGlobal || false,
        viewOwn: permission?.viewOwn || false,
        edit: permission?.edit || false,
        deleteValue: permission?.delete || false,
      };
    });
  }, [processMenuItems, rolePermissions]); // Only depend on actual data, not form state

  // Initialize form with proper default values
  const form = useForm<TRoleFormSchema>({
    resolver: zodResolver(roleFormSchema),
    mode: "onChange",
    defaultValues: {
      roleName: "",
      menuIds: [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  // FIXED: Properly controlled form initialization with ref to prevent multiple calls
  useEffect(() => {
    // Skip if already initialized or if we don't have the required data yet
    if (formInitialized.current || processMenuItems.length === 0) {
      return;
    }

    // For edit mode: wait for role permission data
    if (isEdit && rolePermission && initialMenuIds.length > 0) {
      console.log("Initializing form for edit mode:", {
        roleName: rolePermission.roleName,
        menuIdsLength: initialMenuIds.length,
      });

      setValue("roleName", rolePermission.roleName);
      setValue("menuIds", initialMenuIds);
      formInitialized.current = true;
    }
    // For create mode: initialize with empty role name and default permissions
    else if (!isEdit && initialMenuIds.length > 0) {
      console.log("Initializing form for create mode");
      setValue("roleName", "");
      setValue("menuIds", initialMenuIds);
      formInitialized.current = true;
    }
  }, [
    isEdit,
    rolePermission?.roleName, // Only depend on the actual role name, not the entire object
    rolePermission?.roleId, // Only depend on the role ID
    processMenuItems.length,
    initialMenuIds.length, // Only depend on the length, not the array itself
    setValue,
  ]);

  // FIXED: Reset form initialization flag when switching between edit/create modes
  useEffect(() => {
    formInitialized.current = false;
  }, [isEdit, effectiveRoleId]);

  const menuIds: {
    id: string;
    permissionId?: string;
    viewOwn?: boolean;
    viewGlobal?: boolean;
    add?: boolean;
    edit?: boolean;
    deleteValue?: boolean;
  }[] = watch("menuIds") ?? [];

  // Calculate select all state
  const selectAllState = useMemo(() => {
    if (menuIds.length === 0) return { checked: false, indeterminate: false };

    // Only consider non-parent-with-children menus for select all calculation
    const relevantMenus = processMenuItems.filter(
      (menu) => !(menu.isParent && menu.hasChildren)
    );

    if (relevantMenus.length === 0)
      return { checked: false, indeterminate: false };

    let checkedCount = 0;
    let totalCount = relevantMenus.length;

    relevantMenus.forEach((menu) => {
      // Find the actual index in the full processMenuItems array
      const actualIndex = processMenuItems.findIndex(
        (m) => m.organizationMenuId === menu.organizationMenuId
      );
      const permissions = menuIds[actualIndex];

      if (
        permissions &&
        (permissions.viewOwn ||
          permissions.viewGlobal ||
          permissions.add ||
          permissions.edit ||
          permissions.deleteValue)
      ) {
        checkedCount++;
      }
    });

    if (checkedCount === 0) {
      return { checked: false, indeterminate: false };
    } else if (checkedCount === totalCount) {
      return { checked: true, indeterminate: false };
    } else {
      return { checked: false, indeterminate: true };
    }
  }, [menuIds, processMenuItems]);

  // Handle select all functionality
  const handleSelectAll = (checked: boolean) => {
    const updated = [...menuIds];

    processMenuItems.forEach((menu, index) => {
      // Skip parent menus that have children (they don't have individual permissions)
      if (menu.isParent && menu.hasChildren) return;

      const item = { ...updated[index] };

      if (checked) {
        // Select all permissions
        item.viewOwn = true;
        item.viewGlobal = true;
        item.add = true;
        item.edit = true;
        item.deleteValue = true;
      } else {
        // Unselect all permissions
        item.viewOwn = false;
        item.viewGlobal = false;
        item.add = false;
        item.edit = false;
        item.deleteValue = false;
      }

      updated[index] = item;
    });

    setValue("menuIds", updated);
  };

  const onSubmit = (values: any) => {
    const filteredMenuIds = values.menuIds
      .filter(
        (menu: any) =>
          menu.add ||
          menu.viewGlobal ||
          menu.viewOwn ||
          menu.edit ||
          menu.deleteValue
      )
      .map((menu: any) => ({
        id: menu.id,
        permissionId: menu.permissionId || undefined,
        add: menu.add,
        viewGlobal: menu.viewGlobal,
        viewOwn: menu.viewOwn,
        edit: menu.edit,
        deleteValue: menu.deleteValue,
      }));

    if (filteredMenuIds.length === 0) {
      toast.error("At least one permission must be selected.", {
        duration: 3000,
      });
      return;
    }

    const payload = {
      roleName: values.roleName,
      menuIds: filteredMenuIds,
    };

    if (isEdit && effectiveRoleId) {
      updateRole(payload);
    } else {
      createRole(payload);
      console.log("payloacreated", payload);
    }
  };

  const handleCancel = () => {
    setCurrentRow(null);
    formInitialized.current = false; // Reset initialization flag
    navigate({ to: "/user-management/roles" });
  };

  const updatePermission = (
    permissionIndex: number,
    permissionType: any["menuIds"],
    value: boolean
  ) => {
    const updated = [...menuIds];
    const item = { ...updated[permissionIndex], [permissionType]: value };

    // Handle automatic viewOwn selection for add/edit/delete
    if (
      (permissionType === "add" ||
        permissionType === "edit" ||
        permissionType === "deleteValue") &&
      value
    ) {
      item.viewOwn = true;
    }

    // Handle automatic deselection when viewOwn is unchecked
    if (permissionType === "viewOwn" && !value) {
      item.add = false;
      item.edit = false;
      item.deleteValue = false;
    }

    updated[permissionIndex] = item;

    // NEW: Handle parent menu inclusion when child menu is selected
    const currentMenu = processMenuItems[permissionIndex];

    // If this is a child menu (has parentId) and any permission is being enabled
    if (currentMenu.parentId && value) {
      // Find the parent menu index
      const parentIndex = processMenuItems.findIndex(
        (menu) => menu.organizationMenuId === currentMenu.parentId
      );

      if (parentIndex !== -1) {
        // Ensure parent menu has at least viewOwn permission
        const parentItem = { ...updated[parentIndex] };
        if (
          !parentItem.viewOwn &&
          !parentItem.viewGlobal &&
          !parentItem.add &&
          !parentItem.edit &&
          !parentItem.deleteValue
        ) {
          parentItem.viewOwn = true;
          updated[parentIndex] = parentItem;
        }
      }
    }

    // NEW: Handle parent menu deselection when all child menus are deselected
    if (currentMenu.parentId && !value) {
      // Check if this was the last permission being disabled for this child
      const childStillHasPermissions =
        item.viewOwn ||
        item.viewGlobal ||
        item.add ||
        item.edit ||
        item.deleteValue;

      if (!childStillHasPermissions) {
        // Find parent menu
        const parentIndex = processMenuItems.findIndex(
          (menu) => menu.organizationMenuId === currentMenu.parentId
        );

        if (parentIndex !== -1) {
          // Check if any other children of this parent still have permissions
          const siblingChildren = processMenuItems.filter(
            (menu) =>
              menu.parentId === currentMenu.parentId &&
              menu.organizationMenuId !== currentMenu.organizationMenuId
          );

          const anyChildHasPermissions = siblingChildren.some((siblingMenu) => {
            const siblingIndex = processMenuItems.findIndex(
              (menu) =>
                menu.organizationMenuId === siblingMenu.organizationMenuId
            );
            const siblingPermissions = updated[siblingIndex];
            return (
              siblingPermissions?.viewOwn ||
              siblingPermissions?.viewGlobal ||
              siblingPermissions?.add ||
              siblingPermissions?.edit ||
              siblingPermissions?.deleteValue
            );
          });

          // If no children have permissions, remove parent permissions too
          if (!anyChildHasPermissions) {
            const parentItem = { ...updated[parentIndex] };
            parentItem.viewOwn = false;
            parentItem.viewGlobal = false;
            parentItem.add = false;
            parentItem.edit = false;
            parentItem.deleteValue = false;
            updated[parentIndex] = parentItem;
          }
        }
      }
    }

    setValue("menuIds", updated);
  };

  // Define the allowed permission keys explicitly
  type PermissionKey =
    | "viewOwn"
    | "viewGlobal"
    | "add"
    | "edit"
    | "deleteValue";

  const renderPermissionCheckbox = (
    menu: MenuItem,
    index: number,
    permissionType: PermissionKey
  ) => {
    if (menu.isParent && menu.hasChildren)
      return <div className="flex justify-center"></div>;

    const isChecked = Boolean(menuIds[index]?.[permissionType]);

    return (
      <div className="flex justify-center">
        <Checkbox
          checked={isChecked}
          onCheckedChange={(checked) => {
            updatePermission(index, permissionType, checked as boolean);
          }}
        />
      </div>
    );
  };

  const loading =
    isCreateLoading ||
    isUpdateLoading ||
    isMenusLoading ||
    (isEdit && isRoleLoading);

  if (loading) {
    return (
      <Main className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Main>
    );
  }

  const onError = (error: any) => {
    console.log("Form validation errors:", error);
  };

  return (
    <Main className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? "Edit Role" : "Create New Role"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? "Update role information and permissions."
              : "Define a new role with specific permissions for your organization."}
          </p>
        </div>
      </div>

      {isCreateError && (
        <div className="text-red-500">
          Failed to create role. Please try again.
        </div>
      )}
      {isUpdateError && (
        <div className="text-red-500">
          Failed to update role. Please try again.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Role Information</CardTitle>
          <CardDescription>
            Enter the basic information for this role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="roleName">
                  Role Name <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="roleName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="roleName"
                      placeholder="Enter role name"
                      className={errors.roleName ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.roleName && (
                  <p className="text-sm text-red-500">
                    {errors.roleName.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                Configure the permissions for this role across different menu
                items.
              </CardDescription>
            </div>
            <div className="flex gap-2 items-center">
              <Checkbox
                checked={selectAllState.checked}
                // @ts-ignore - indeterminate is a valid prop for Checkbox
                indeterminate={selectAllState.indeterminate}
                onCheckedChange={handleSelectAll}
              />
              <span className="font-medium text-sm">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border">
              <div className="grid grid-cols-6 gap-4 border-b bg-gray-50 p-3 text-sm font-medium text-gray-700">
                <div>Menu</div>
                <div className="text-center">View (Own)</div>
                <div className="text-center">View (Global)</div>
                <div className="text-center">Add</div>
                <div className="text-center">Edit</div>
                <div className="text-center">Delete</div>
              </div>

              {processMenuItems.length > 0 ? (
                processMenuItems.map((menu, index) => (
                  <div
                    key={menu.organizationMenuId}
                    className={`grid grid-cols-6 items-center gap-4 border-b p-3 ${
                      menu.isParent && menu.hasChildren
                        ? "bg-gray-25 font-medium"
                        : menu.isParent
                          ? "bg-white"
                          : "bg-gray-50"
                    }`}
                  >
                    <div className="min-w-0">
                      <span
                        className={`text-sm ${
                          menu.isParent && menu.hasChildren
                            ? "font-semibold text-gray-900"
                            : menu.isParent
                              ? "font-medium text-gray-900"
                              : "text-gray-700"
                        }`}
                      >
                        {menu.level > 0}
                        {menu.menuName}
                      </span>
                    </div>
                    {renderPermissionCheckbox(menu, index, "viewOwn")}
                    {renderPermissionCheckbox(menu, index, "viewGlobal")}
                    {renderPermissionCheckbox(menu, index, "add")}
                    {renderPermissionCheckbox(menu, index, "edit")}
                    {renderPermissionCheckbox(menu, index, "deleteValue")}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>No menu items available</p>
                  <p className="mt-2 text-sm">
                    Please check if the organization menu API is returning data
                    correctly.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded bg-gray-50 p-3 text-sm text-gray-600">
              <strong>Summary:</strong>{" "}
              {processMenuItems.filter((m) => m.isParent).length} parent
              menu(s), {processMenuItems.filter((m) => !m.isParent).length}{" "}
              child menu(s)
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-4 border-t pt-4">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <CustomButton
          type="button"
          loading={loading}
          onClick={handleSubmit(onSubmit, onError)}
        >
          {isEdit ? "Update Role" : "Create Role"}
        </CustomButton>
      </div>
    </Main>
  );
}
