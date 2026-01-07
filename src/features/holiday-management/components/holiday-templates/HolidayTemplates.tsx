import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  CalendarDays,
  Plus,
  Loader2,
  Globe,
} from "lucide-react";
import { IconEdit, IconTrash } from "@tabler/icons-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Custom Components
import MultiSelect from "@/components/ui/MultiSelect";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { DeleteModal } from "@/components/shared/common-delete-modal";

// Data & Services
import {
  useCreateHolidayTemplate,
  useDeleteHolidayTemplate,
  useGetAllHolidayTemplates,
  useGetHolidayTemplateStats,
  useUpdateHolidayTemplate,
  useGetHolidayTemplateById,
} from "../../services/holiday-template.action.hook";
import { useGetAllHolidays } from "../../services/holiday.action.hook";
import { HolidayTemplate, HolidayTemplateSchema } from "../../data/schema";
import { useGetAllUsers } from "@/features/UserManagement/services/AllUsers.hook";
import { Main } from "@/components/layout/main";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { useGetAllTerritoriesForDropdown } from "@/features/userterritory/services/user-territory.hook";
import { useAuthStore } from "@/stores/use-auth-store";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { Textarea } from "@/components/ui/textarea";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useDirtyTracker } from "@/features/settings/store/use-unsaved-changes-store";
import { ConfirmDialog } from "@/components/confirm-dialog";

export default function HolidayCalendarTemplates() {
  const { user } = useAuthStore();
  const allowAddUsersBasedOnTerritories =
    user?.organization?.allowAddUsersBasedOnTerritories;
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | null>(
    null
  );
  const [showLocalWarning, setShowLocalWarning] = useState(false);

  // 1. Fetch Data
  const { data: holidayTemplates = [], isLoading: isLoadingTemplates } =
    useGetAllHolidayTemplates();
  const { data: masterHolidays = [] } = useGetAllHolidays();
  const { data: stats } = useGetHolidayTemplateStats();

  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(
    null
  );

  const { data: singleTemplateData, isLoading: isLoadingSingleTemplate } =
    useGetHolidayTemplateById(editingTemplateId || "");

  // 2. Local State
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(
    null
  );

  const { data: allUsers = [], isLoading: isLoadingUsers } = useGetAllUsers({
    nullHolidayTemplateId: true,
    holidayTemplateId: modalType === "edit" ? editingTemplateId : undefined,
    ...(allowAddUsersBasedOnTerritories
      ? {
          territoryId: selectedTerritoryId,
        }
      : {}),
  });

  const { data: allTerritories = [], isLoading: isLoadingTerritories } =
    useGetAllTerritoriesForDropdown();

  const territoryOptions = allTerritories.map((territory: any) => ({
    value: territory.id,
    label: territory.name,
  }));

  const userOptions = allUsers.map((user: any) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`,
  }));
  const [selectedRow, setSelectedRow] = useState<HolidayTemplate | null>(null);

  // 3. Form Setup
  const form = useForm<z.infer<typeof HolidayTemplateSchema>>({
    resolver: zodResolver(HolidayTemplateSchema) as any,
    defaultValues: {
      name: "",
      territoryId: "",
      description: "",
      specialHolidayIds: [],
      userIds: [],
    },
  });

  // 4. Mutation Hooks
  const createMutation = useCreateHolidayTemplate(() => {
    handleClose();
  });

  const updateMutation = useUpdateHolidayTemplate(selectedRow?.id || "", () => {
    handleClose();
  });

  const deleteMutation = useDeleteHolidayTemplate(selectedRow?.id || "", () => {
    handleClose();
  });

  // 5. Handlers
  const handleOpenAdd = () => {
    setSelectedRow(null);
    setEditingTemplateId(null);
    form.reset({
      name: "",
      territoryId: "",
      description: "",
      specialHolidayIds: [],
      userIds: [],
    });
    setModalType("add");
  };

  const handleOpenEdit = (template: any) => {
    setSelectedRow(template);
    setEditingTemplateId(template.id);
    setModalType("edit");
  };

  useEffect(() => {
    if (
      modalType === "edit" &&
      singleTemplateData &&
      !isLoadingSingleTemplate
    ) {
      const currentHolidayIds = singleTemplateData.holidays
        ? singleTemplateData.holidays.map((h: any) => h.id)
        : [];

      const currentUserIds = singleTemplateData.users
        ? singleTemplateData.users.map((u: any) => u.id)
        : [];

      form.reset({
        name: singleTemplateData.name,
        territoryId: singleTemplateData.territoryId,
        description: singleTemplateData.description || "",
        specialHolidayIds: currentHolidayIds,
        userIds: currentUserIds,
      });
    }
  }, [singleTemplateData, modalType, isLoadingSingleTemplate, form]);

  const handleOpenDelete = (template: HolidayTemplate) => {
    setSelectedRow(template);
    setModalType("delete");
  };

  const handleClose = () => {
    setModalType(null);
    setEditingTemplateId(null);
    setTimeout(() => setSelectedRow(null), 300);
  };

  const onSubmit = (data: z.infer<typeof HolidayTemplateSchema>) => {
    if (modalType === "edit" && selectedRow) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const onConfirmDelete = () => {
    if (selectedRow) {
      deleteMutation.mutate();
    }
  };

  const holidayOptions = (masterHolidays || [])
    .filter((h: any) => {
      return h.isSpecial === true;
    })
    .map((h: any) => ({
      value: h.id,
      label: `${h.name} (${format(new Date(h.date), "PPP")})`,
      disabled: !h.isSpecial,
    }));

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleDialogChange = (state: boolean) => {
    if (state) {
      return;
    }
    if (form.formState.isDirty) {
      setShowLocalWarning(true);
    } else {
      actualClose();
    }
  };

  const actualClose = () => {
    form.reset();
    handleClose();
  };

  useDirtyTracker(form.formState.isDirty);

  const { showExitPrompt, confirmExit, cancelExit } = useUnsavedChanges(
    form.formState.isDirty
  );

  const isWarningOpen = showLocalWarning || showExitPrompt;

  const handleCancelDiscard = (isOpen: boolean) => {
    if (!isOpen) {
      setShowLocalWarning(false);
      if (showExitPrompt) cancelExit();
    }
  };

  const handleConfirmDiscard = () => {
    form.reset(form.getValues());
    setShowLocalWarning(false);
    actualClose();

    if (showExitPrompt) {
      setTimeout(() => {
        confirmExit();
      }, 0);
    }
  };

  // 6. Loading State
  if (isLoadingTemplates) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Main className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Templates Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Templates
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalHolidayTemplates || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Active holiday calendars
            </p>
          </CardContent>
        </Card>

        {/* Assigned Employees Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Using custom calendars
            </p>
          </CardContent>
        </Card>

        {/* Total Regions Card (New) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Regions</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRegions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Distinct regions configured
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Holiday Templates
        </h2>
        <PermissionGate requiredPermission="holiday_templates" action="add">
          <Button onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Holiday Template
          </Button>
        </PermissionGate>
      </div>

      <ConfirmDialog
        open={isWarningOpen}
        onOpenChange={handleCancelDiscard}
        title="Unsaved Changes"
        desc="You have unsaved changes. Are you sure you want to discard them? Your changes will be lost."
        confirmText="Discard Changes"
        cancelBtnText="Keep Editing"
        destructive={true}
        handleConfirm={handleConfirmDiscard}
      />

      {/* Templates Grid/List */}
      <div className="space-y-4">
        {holidayTemplates.map((template: any) => (
          <Card key={template.id}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    {template.name}
                    <Badge
                      variant="secondary"
                      className="ml-3 h-6 px-2 text-xs font-normal text-slate-600"
                    >
                      <Users className="mr-1 h-3 w-3" />
                      {template.userCount || 0} Users
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {allowAddUsersBasedOnTerritories && (
                      <Badge variant="secondary" className="font-normal">
                        <MapPin className="h-3 w-3 mr-1" />{" "}
                        {template?.territory?.name || "N/A"}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="font-normal">
                      <CalendarIcon className="h-3 w-3 mr-1" />{" "}
                      {template.holidays?.length || 0} holidays
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <PermissionGate
                    requiredPermission="holiday_templates"
                    action="edit"
                  >
                    <CustomTooltip title="Edit">
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleOpenEdit(template)}
                      >
                        <IconEdit size={16} />
                      </Button>
                    </CustomTooltip>
                  </PermissionGate>
                  <PermissionGate
                    requiredPermission="holiday_templates"
                    action="delete"
                  >
                    <CustomTooltip title="Delete">
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleOpenDelete(template)}
                      >
                        <IconTrash size={16} />
                      </Button>
                    </CustomTooltip>
                  </PermissionGate>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {holidayTemplates.length === 0 && (
          <Card>
            <CardContent className="text-center py-10">
              <div className="text-lg font-semibold">
                No holiday templates yet
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Create a holiday template to group holidays by region.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* 1. Add/Edit Dialog */}
      <Dialog
        open={modalType === "add" || modalType === "edit"}
        onOpenChange={handleDialogChange}
      >
        <DialogContent className="max-h-[80vh] !max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalType === "edit"
                ? "Edit Holiday Template"
                : "Create Holiday Template"}
            </DialogTitle>
            <DialogDescription>
              Define holidays for specific regions or categories.
            </DialogDescription>
          </DialogHeader>

          {modalType === "edit" && isLoadingSingleTemplate ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Loading template details...
              </span>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div
                  className={`grid grid-cols-${allowAddUsersBasedOnTerritories ? 2 : 1} gap-4`}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Gujarat Region"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {allowAddUsersBasedOnTerritories && (
                    <FormField
                      control={form.control}
                      name="territoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Territory</FormLabel>
                          <FormControl>
                            <SearchableSelect
                              options={territoryOptions}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                                setSelectedTerritoryId(value);
                              }}
                              onCancelPress={() => {
                                field.onChange("");
                                setSelectedTerritoryId(null);
                              }}
                              placeholder={
                                isLoadingTerritories
                                  ? "Loading territories..."
                                  : "Select territory"
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="userIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign Employees</FormLabel>
                        <FormControl>
                          {isLoadingUsers ? (
                            <div className="flex items-center text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Loading users...
                            </div>
                          ) : (
                            <MultiSelect
                              options={userOptions}
                              value={field.value || []}
                              onChange={field.onChange}
                              placeholder="Select employees..."
                            />
                          )}
                        </FormControl>
                        <div className="text-xs text-muted-foreground mt-1">
                          {(field.value || []).length} user
                          {(field.value || []).length !== 1 ? "s" : ""} selected
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Choose Holidays</Label>
                  <FormField
                    control={form.control}
                    name="specialHolidayIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelect
                            options={holidayOptions}
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Select holidays"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-xs text-muted-foreground">
                    {form.watch("specialHolidayIds")?.length || 0} holidays
                    selected
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" type="button" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : modalType === "edit" ? (
                      "Update"
                    ) : (
                      "Save"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* 2. Delete Modal */}
      {modalType === "delete" && selectedRow && (
        <DeleteModal
          open={modalType === "delete"}
          onOpenChange={(val) => !val && handleClose()}
          currentRow={selectedRow}
          onDelete={onConfirmDelete}
          itemName="Holiday Template"
          itemIdentifier="name"
        />
      )}
    </Main>
  );
}
