import { useState, useMemo, useEffect } from "react"; // Added useEffect
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users, Shield, Plus, Loader2 } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { DeleteModal } from "@/components/shared/common-delete-modal";
import CustomTooltip from "@/components/shared/custom-tooltip";

// Services & Hooks
import { useGetAllLeaveTypes } from "@/features/leave-management/services/leave-type.action.hook";
import {
  useGetAllEmployeeTiers,
  useGetEmployeeTierStats,
  useCreateEmployeeTier,
  useUpdateEmployeeTier,
  useDeleteEmployeeTier,
  useGetEmployeeTierById,
} from "../../services/employee-tier.action.hook";
import { EmployeeTierFormValues, EmployeeTierSchema } from "../../data/schema";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useGetAllTiers } from "@/features/settings/Approvers/services/approvers.hook";
import { useGetAllUsers } from "@/features/UserManagement/services/AllUsers.hook";
import MultiSelect from "@/components/ui/MultiSelect";

// --- HELPER COMPONENT: TIER CARD ---
function TierCard({
  tier,
  onEdit,
  onDelete,
  leaveTypesMap,
  tierLabelMap,
}: {
  tier: any;
  onEdit: (t: any) => void;
  onDelete: (t: any) => void;
  leaveTypesMap: Record<string, string>;
  tierLabelMap: Record<string, string>;
}) {
  const displayName = tierLabelMap[tier.tierName] || tier.tierName;
  const configs = tier.leaveTypeConfig || [];
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">{displayName}</CardTitle>
          <Badge variant="secondary" className="ml-2 ">
            {tier.userCount || 0} employees
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <CustomTooltip title="Edit">
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={() => onEdit(tier)}
            >
              <IconEdit size={16} />
            </Button>
          </CustomTooltip>

          <CustomTooltip title="Delete">
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => onDelete(tier)}
            >
              <IconTrash size={16} />
            </Button>
          </CustomTooltip>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-0">
              <TableHead className="h-8 pl-0">Leave Type</TableHead>
              <TableHead className="h-8 text-right pr-0">
                Balance (Days)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs.length > 0 ? (
              configs.map((alloc: any) => (
                <TableRow
                  key={alloc.leaveTypeId}
                  className="hover:bg-muted/50 border-b last:border-0"
                >
                  <TableCell className="py-2 text-sm pl-0">
                    {leaveTypesMap[alloc.leaveTypeId] || "Unknown Leave"}
                  </TableCell>
                  <TableCell className="py-2 text-md text-right font-bold pr-0">
                    {alloc.allowedDays}{" "}
                    <span className="font-normal text-muted-foreground text-xs">
                      days
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center text-muted-foreground py-4"
                >
                  No leaves configured
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// --- MAIN COMPONENT ---
export default function EmployeeTierManagement() {
  // 1. Fetch Data
  const { data: employeeTiers = [], isLoading: isLoadingTiers } =
    useGetAllEmployeeTiers();
  const { data: leaveTypes = [] } = useGetAllLeaveTypes();
  const { data: stats } = useGetEmployeeTierStats();
  const { data: allTiers = [] } = useGetAllTiers();
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const { data: singleEmployeeTier, isLoading: isLoadingSingleTier } =
    useGetEmployeeTierById(editingTierId || "");

  // 2. Prepare Option Lists
  const leaveTypesMap = useMemo(() => {
    return leaveTypes.reduce((acc: any, curr: any) => {
      acc[curr.id] = curr.name;
      return acc;
    }, {});
  }, [leaveTypes]);

  // Generate all possible Tier options
  const allTierOptions = useMemo(() => {
    return allTiers.map((tier: string) => {
      const label = tier
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        label,
        value: tier,
      };
    });
  }, [allTiers]);

  const tierLabelMap = useMemo(() => {
    return allTierOptions.reduce((acc: any, curr: any) => {
      acc[curr.value] = curr.label;
      return acc;
    }, {});
  }, [allTierOptions]);

  // Filter out tiers that are already created
  const availableTierOptions = useMemo(() => {
    const usedTiers = employeeTiers.map((t: any) => t.tierName);
    return allTierOptions.filter((opt: any) => !usedTiers.includes(opt.value));
  }, [allTierOptions, employeeTiers]);

  const isAllTiersAssigned = availableTierOptions.length === 0;

  // 3. Mutations for Create/Edit/Delete
  const createMutation = useCreateEmployeeTier(() => handleClose());
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const updateMutation = useUpdateEmployeeTier(selectedRow?.id || "", () =>
    handleClose()
  );
  const deleteMutation = useDeleteEmployeeTier(selectedRow?.id || "", () =>
    handleClose()
  );

  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(
    null
  );

  const form = useForm<EmployeeTierFormValues>({
    resolver: zodResolver(EmployeeTierSchema) as any,
    defaultValues: {
      tierName: "",
      leaveConfigs: [],
      userIds: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "leaveConfigs",
  });

  // Fetch users for the currently selected tier in the form
  const watchedTier = form.watch("tierName");
  const { data: allUsers = [], isLoading: isLoadingUsers } = useGetAllUsers(
    {
      tierkey: watchedTier,
    },
    { enabled: !!watchedTier || modalType === "edit" }
  );

  // Transform Users for MultiSelect
  const userOptions = useMemo(() => {
    if (!allUsers) return [];
    return allUsers.map((user: any) => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName}`,
    }));
  }, [allUsers]);

  // --- NEW: Populate form when Single Tier Data loads ---
  useEffect(() => {
    if (modalType === "edit" && singleEmployeeTier && !isLoadingSingleTier) {
      // 1. Map Leave Configs
      const currentConfigs = singleEmployeeTier.leaveTypeConfig || [];
      const formConfigs = leaveTypes.map((lt: any) => {
        const existing = currentConfigs.find(
          (c: any) => c.leaveTypeId === lt.id
        );
        return {
          leaveTypeId: lt.id,
          allowedDays: existing ? existing.allowedDays : lt.balance || 0,
        };
      });

      // 2. Map Users (Extract IDs from object array)
      const assignedUserIds = singleEmployeeTier.users
        ? singleEmployeeTier.users.map((u: any) => u.id)
        : [];

      // 3. Reset Form
      form.reset({
        tierName: singleEmployeeTier.tierName,
        leaveConfigs: formConfigs,
        userIds: assignedUserIds,
      });
    }
  }, [singleEmployeeTier, modalType, isLoadingSingleTier, leaveTypes, form]);

  // 4. Handlers
  const handleOpenAdd = () => {
    setSelectedRow(null);
    setEditingTierId(null); // Clear ID so fetch doesn't trigger

    const defaultConfigs = leaveTypes.map((lt: any) => ({
      leaveTypeId: lt.id,
      allowedDays: lt.balance || 0,
    }));

    // AUTO-SELECT FIRST AVAILABLE TIER
    const initialTier =
      availableTierOptions.length > 0 ? availableTierOptions[0].value : "";
    form.reset({
      tierName: initialTier,
      leaveConfigs: defaultConfigs,
      userIds: [],
    });
    replace(defaultConfigs);
    setModalType("add");
  };

  const handleOpenEdit = (tier: any) => {
    setSelectedRow(tier);
    setEditingTierId(tier.id);
    setModalType("edit");
  };

  const handleOpenDelete = (tier: any) => {
    setSelectedRow(tier);
    setModalType("delete");
  };

  const handleClose = () => {
    setModalType(null);
    setEditingTierId(null);
    setTimeout(() => setSelectedRow(null), 300);
  };

  const onSubmit = (data: EmployeeTierFormValues) => {
    if (modalType === "edit" && selectedRow) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const onConfirmDelete = () => {
    if (selectedRow) deleteMutation.mutate();
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoadingTiers) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats*/}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tiers</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalUserTiers || 0} tiers
            </div>
            <p className="text-xs text-muted-foreground">
              Different categories configured
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Across all tiers</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-end">
        {isAllTiersAssigned ? (
          <CustomTooltip title="All available tiers have been configured.">
            <span className="cursor-not-allowed">
              <Button disabled>
                <Plus className="mr-2 h-4 w-4" /> Add Employee Tier
              </Button>
            </span>
          </CustomTooltip>
        ) : (
          <Button onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Employee Tier
          </Button>
        )}
      </div>

      {/* Tiers List */}
      <div className="space-y-6">
        {employeeTiers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-10">
              <div className="text-lg font-semibold">
                No employee tiers configured yet.
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                Click "Add Employee Tier" to start.
              </p>
            </CardContent>
          </Card>
        ) : (
          employeeTiers.map((tier: any) => (
            <TierCard
              key={tier.id}
              tier={tier}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              leaveTypesMap={leaveTypesMap}
              tierLabelMap={tierLabelMap}
            />
          ))
        )}
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      <Dialog
        open={modalType === "add" || modalType === "edit"}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {modalType === "edit" ? "Edit Tier" : "Create Employee Tier"}
            </DialogTitle>
          </DialogHeader>

          {modalType === "edit" && isLoadingSingleTier ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Loading tier details...
              </span>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="tierName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tier Level</FormLabel>
                      <FormControl>
                        <SearchableSelect
                          options={
                            modalType === "edit"
                              ? allTierOptions
                              : availableTierOptions
                          }
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select Tier Level..."
                          disabled={modalType === "edit"}
                        />
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

                <div className="space-y-4">
                  <FormLabel>Leave Allocations</FormLabel>
                  <ScrollArea className="max-h-[300px] border rounded-md overflow-y-auto">
                    <div className="p-4 space-y-4">
                      {fields.map((field, index) => {
                        const leaveName =
                          leaveTypesMap[field.leaveTypeId] || "Unknown Leave";
                        return (
                          <div
                            key={field.id}
                            className="flex items-center justify-between p-3 border rounded-md bg-card"
                          >
                            <span className="font-medium text-sm">
                              {leaveName}
                            </span>
                            <FormField
                              control={form.control}
                              name={`leaveConfigs.${index}.allowedDays`}
                              render={({ field }) => (
                                <FormItem className="flex items-center space-y-0 gap-2">
                                  <FormControl>
                                    <Input
                                      type="number"
                                      className="w-24 text-right"
                                      {...field}
                                    />
                                  </FormControl>
                                  <span className="text-sm text-muted-foreground w-8">
                                    days
                                  </span>
                                </FormItem>
                              )}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
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

      {/* Delete Modal */}
      {modalType === "delete" && selectedRow && (
        <DeleteModal
          open={modalType === "delete"}
          onOpenChange={(val) => !val && handleClose()}
          currentRow={selectedRow}
          onDelete={onConfirmDelete}
          itemName="Employee Tier"
          itemIdentifier="tierName"
        />
      )}
    </div>
  );
}
