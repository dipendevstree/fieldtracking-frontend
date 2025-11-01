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
import { MenuItem, OrganizationMenu, Permission, Props } from "../types";

export function RoleActionForm({ currentRow, isEdit: propIsEdit }: Props) {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const { currentRow: storeCurrentRow, setCurrentRow } = useRolesStore();

  const formInitialized = useRef(false);

  const roleIdFromUrl = params?.roleId;
  const isEdit =
    propIsEdit ?? !!(currentRow || storeCurrentRow || roleIdFromUrl);

  const roleData = currentRow || storeCurrentRow;
  const effectiveRoleId = roleData?.roleId || roleIdFromUrl;

  const {
    organizationMenus,
    isLoading: isMenusLoading,
    isFetched,
  } = useOrganizationMenulist();

  const { data: rolePermission, isLoading: isRoleLoading } =
    useGetRolesAndPermissionById(effectiveRoleId, {
      enabled: isEdit && !!effectiveRoleId,
    });

  useEffect(() => {
    if (rolePermission && !storeCurrentRow && roleIdFromUrl) {
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
  }, [
    rolePermission,
    storeCurrentRow,
    roleIdFromUrl,
    setCurrentRow,
    isFetched,
  ]);

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

  useEffect(() => {
    if (
      (isCreateSuccess && !isCreateError) ||
      (isUpdateSuccess && !isUpdateError)
    ) {
      handleCancel();
    }
  }, [isCreateSuccess, isCreateError, isUpdateSuccess, isUpdateError]);

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
  }, [processMenuItems, rolePermissions]);

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
    getValues,
  } = form;

  useEffect(() => {
    if (formInitialized.current || processMenuItems.length === 0) {
      return;
    }

    if (isEdit && rolePermission && initialMenuIds.length > 0) {
      setValue("roleName", rolePermission.roleName);
      setValue("menuIds", initialMenuIds);
      formInitialized.current = true;
    } else if (!isEdit && initialMenuIds.length > 0) {
      setValue("roleName", "");
      setValue("menuIds", initialMenuIds);
      formInitialized.current = true;
    }
  }, [
    isEdit,
    rolePermission,
    processMenuItems.length,
    initialMenuIds,
    setValue,
  ]);

  useEffect(() => {
    formInitialized.current = false;
  }, [isEdit, effectiveRoleId]);

  const menuIds: TRoleFormSchema["menuIds"] = watch("menuIds") ?? [];

  // selectAllState
  const selectAllState = useMemo(() => {
    const relevantMenuItems = processMenuItems.filter(
      (menu) => !(menu.isParent && menu.hasChildren)
    );

    if (relevantMenuItems.length === 0 || menuIds.length === 0) {
      return { checked: false, indeterminate: false };
    }

    let checkedCount = 0;
    const totalPossibleCheckboxes = relevantMenuItems.length * 5; // 5 permissions per item

    relevantMenuItems.forEach((menu) => {
      const permission = menuIds.find((m) => m.id === menu.organizationMenuId);
      if (permission) {
        if (permission.viewOwn) checkedCount++;
        if (permission.viewGlobal) checkedCount++;
        if (permission.add) checkedCount++;
        if (permission.edit) checkedCount++;
        if (permission.deleteValue) checkedCount++;
      }
    });

    if (checkedCount === 0) {
      return { checked: false, indeterminate: false };
    }
    if (checkedCount === totalPossibleCheckboxes) {
      return { checked: true, indeterminate: false };
    }
    return { checked: false, indeterminate: true };
  }, [menuIds, processMenuItems]);

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    // When an indeterminate checkbox is clicked, it becomes checked (true).
    const newCheckedState = !!checked;
    const currentMenuIds = getValues("menuIds");

    const updatedMenuIds = currentMenuIds?.map((menuItem) => {
      const menuDefinition = processMenuItems.find(
        (m) => m.organizationMenuId === menuItem.id
      );

      // If it's a non-actionable parent row (a header), return it unchanged.
      if (menuDefinition?.isParent && menuDefinition?.hasChildren) {
        return menuItem;
      }

      // Otherwise, update all its permissions to the new state.
      return {
        ...menuItem,
        viewOwn: newCheckedState,
        viewGlobal: newCheckedState,
        add: newCheckedState,
        edit: newCheckedState,
        deleteValue: newCheckedState,
      };
    });

    setValue("menuIds", updatedMenuIds, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit = (values: TRoleFormSchema) => {
    const payloadMenuIds = values.menuIds?.map((menu) => ({
      id: menu.id,
      permissionId: isEdit ? menu.permissionId || undefined : undefined,
      add: !!menu.add,
      viewGlobal: !!menu.viewGlobal,
      viewOwn: !!menu.viewOwn,
      edit: !!menu.edit,
      deleteValue: !!menu.deleteValue,
    }));

    const payload = {
      ...values,
      menuIds: payloadMenuIds,
    };

    if (isEdit) {
      updateRole(payload);
    } else {
      createRole(payload);
    }
  };

  const handleCancel = () => {
    setCurrentRow(null);
    formInitialized.current = false;
    navigate({ to: "/user-management/roles" });
  };

  type PermissionKey =
    | "viewOwn"
    | "viewGlobal"
    | "add"
    | "edit"
    | "deleteValue";

  const updatePermission = (
    menuId: string,
    permissionType: PermissionKey,
    value: boolean
  ) => {
    const updatedMenuIds = [...menuIds];
    const permissionIndex = updatedMenuIds.findIndex((m) => m.id === menuId);
    if (permissionIndex === -1) return;

    const originalItem = updatedMenuIds[permissionIndex];
    const item = {
      ...originalItem,
      [permissionType]: value,
    };

    // If checking 'add', 'edit', or 'delete', ensure 'viewOwn' is also checked
    if (
      (permissionType === "add" ||
        permissionType === "edit" ||
        permissionType === "deleteValue") &&
      value
    ) {
      item.viewOwn = true;
    }

    // Handle the specific logic for the 'viewOwn' checkbox
    if (permissionType === "viewOwn") {
      if (!value) {
        // If unchecking 'viewOwn', uncheck all dependent permissions
        item.add = false;
        item.edit = false;
        item.deleteValue = false;
      }
    }

    // If 'add', 'edit', AND 'delete' are all unchecked, then 'viewOwn'
    // should also be unchecked automatically (only if user is unchecking viewOwn)
    if (
      !item.add &&
      !item.edit &&
      !item.deleteValue &&
      permissionType !== "viewOwn"
    ) {
      item.viewOwn = false;
    }

    updatedMenuIds[permissionIndex] = item;
    setValue("menuIds", updatedMenuIds, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const renderPermissionCheckbox = (
    menu: MenuItem,
    permissionType: PermissionKey
  ) => {
    if (menu.isParent && menu.hasChildren)
      return <div className="flex justify-center"></div>;

    const permission = menuIds.find((m) => m.id === menu.organizationMenuId);
    const isChecked = Boolean(permission?.[permissionType]);

    return (
      <div className="flex justify-center">
        <Checkbox
          checked={isChecked}
          onCheckedChange={(checked) =>
            updatePermission(
              menu.organizationMenuId,
              permissionType,
              Boolean(checked)
            )
          }
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                Configure the permissions for this role across different menu
                items.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectAllState.checked}
                // @ts-ignore The 'indeterminate' prop is valid for shadcn/ui Checkbox
                indeterminate={selectAllState.indeterminate}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">Select All</span>
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
                processMenuItems.map((menu) => (
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
                    <div className={`min-w-0 ${menu.level > 0 ? "pl-6" : ""}`}>
                      <span
                        className={`text-sm ${
                          menu.isParent && menu.hasChildren
                            ? "font-semibold text-gray-900"
                            : menu.isParent
                              ? "font-medium text-gray-900"
                              : "text-gray-700"
                        }`}
                      >
                        {menu.menuName}
                      </span>
                    </div>
                    {renderPermissionCheckbox(menu, "viewOwn")}
                    {renderPermissionCheckbox(menu, "viewGlobal")}
                    {renderPermissionCheckbox(menu, "add")}
                    {renderPermissionCheckbox(menu, "edit")}
                    {renderPermissionCheckbox(menu, "deleteValue")}
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
