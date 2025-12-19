import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Award, Pencil, Trash2, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLeaveStore } from "../store/use-leave-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmployeeTier, EmployeeTierSchema } from "../data/schema";

function TierCard({
  tier,
  onEdit,
  onDelete,
}: {
  tier: EmployeeTier;
  onEdit: (t: EmployeeTier) => void;
  onDelete: (id: string) => void;
}) {
  // Helper to get icon based on name (mock logic for UI)
  const getIcon = (name: string) => {
    if (name.includes("CXO")) return Award;
    if (name.includes("Senior")) return Shield;
    return Users;
  };
  const Icon = getIcon(tier.name);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-blue-600" />
          <CardTitle className="text-base">{tier.name}</CardTitle>
          <Badge variant="secondary" className="ml-2">
            12 employees
          </Badge>
          {/* Note: "12 employees" is static for now as we don't have real user count in this mock store */}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => onEdit(tier)}
          >
            <Pencil className="mr-1 h-3 w-3" /> Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(tier.id)}
          >
            <Trash2 className="mr-1 h-3 w-3" /> Delete
          </Button>
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
            {tier.leaveAllocations.map((alloc) => (
              <TableRow
                key={alloc.leaveTypeId}
                className="hover:bg-muted/50 border-b last:border-0"
              >
                <TableCell className="py-2 text-sm pl-0">
                  {/* In a real app, look up Leave Name by ID from store using a selector */}
                  {/* using ID for now or mock lookup */}
                  {alloc.leaveTypeId.length > 2
                    ? "Custom Leave"
                    : [
                        "Annual Leave",
                        "Sick Leave",
                        "Casual Leave",
                        "Work From Home",
                      ][parseInt(alloc.leaveTypeId) - 1] || "Other Leave"}
                </TableCell>
                <TableCell className="py-2 text-md text-right font-bold pr-0">
                  {alloc.days}{" "}
                  <span className="font-normal text-muted-foreground text-xs">
                    days
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function EmployeeTierManagement() {
  const {
    employeeTiers,
    addEmployeeTier,
    updateEmployeeTier,
    deleteEmployeeTier,
    leaveTypes,
  } = useLeaveStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof EmployeeTierSchema>>({
    resolver: zodResolver(EmployeeTierSchema),
    defaultValues: {
      name: "",
      leaveAllocations: [],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "leaveAllocations",
  });

  const openAddDialog = () => {
    setEditingId(null);
    // Pre-populate with all active leave types for convenience
    const defaultAllocations = leaveTypes.map((lt) => ({
      leaveTypeId: lt.id,
      days: lt.balance, // Default to the base balance
    }));

    form.reset({
      name: "",
      leaveAllocations: defaultAllocations,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (tier: EmployeeTier) => {
    setEditingId(tier.id);
    form.reset(tier);
    setIsDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof EmployeeTierSchema>) => {
    if (editingId) {
      updateEmployeeTier(editingId, data);
      toast.success("Tier updated successfully");
    } else {
      addEmployeeTier({ ...data, id: crypto.randomUUID() } as EmployeeTier);
      toast.success("Tier created successfully");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tiers</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employeeTiers.length} tiers
            </div>
            <p className="text-xs text-muted-foreground">
              Different categories configured
            </p>
          </CardContent>
        </Card>
        {/* ... stats ... */}
      </div>

      <div className="flex items-center justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add Employee Tier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Tier" : "Create Employee Tier"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tier Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Senior Management"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormLabel>Leave Allocations</FormLabel>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {fields.map((field, index) => {
                        // Find the leave type name for label
                        const leaveName =
                          leaveTypes.find((l) => l.id === field.leaveTypeId)
                            ?.name || "Unknown Leave";
                        return (
                          <div
                            key={field.id}
                            className="flex items-center justify-between p-3 border rounded-md"
                          >
                            <span className="font-medium text-sm">
                              {leaveName}
                            </span>
                            <FormField
                              control={form.control}
                              name={`leaveAllocations.${index}.days`}
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
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">
                    {editingId ? "Update" : "Save"} Tier
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tiers List */}
      <div className="space-y-6">
        {employeeTiers.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No employee tiers configured. Click "Add Employee Tier" to start.
          </div>
        ) : (
          employeeTiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              onEdit={openEditDialog}
              onDelete={deleteEmployeeTier}
            />
          ))
        )}
      </div>
    </div>
  );
}
