import { Controller, useForm } from "react-hook-form";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomButton from "@/components/shared/custom-button";
import {
  approvalActionSchema,
  approvalWorkflowSchema,
  ApprovalActionSchema,
  ApprovalWorkflowSchema,
} from "../data/schema";
import { useEffect } from "react";
import { Approval, ApprovalWorkflow } from "../type/type";

// Approval Action Form
interface ApprovalActionFormProps {
  currentApproval?: Approval;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  onSubmit: (values: ApprovalActionSchema) => void;
  resetOnSubmitSuccess?: boolean;
}

export function ApprovalActionForm({
  currentApproval,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
  resetOnSubmitSuccess,
}: ApprovalActionFormProps) {
  const form = useForm<ApprovalActionSchema>({
    resolver: zodResolver(approvalActionSchema),
    defaultValues: {
      approvalId: currentApproval?.approvalId ?? "",
      action: "approve",
      comment: "",
      rejectionReason: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = form;

  const selectedAction = watch("action");

  const onSubmit = (values: ApprovalActionSchema) => {
    onSubmitValues(values);
  };

  const handleDialogChange = (state: boolean) => {
    if (!state) reset();
    onOpenChange(state);
  };

  useEffect(() => {
    if (!loading && resetOnSubmitSuccess) {
      reset({
        approvalId: currentApproval?.approvalId ?? "",
        action: "approve",
        comment: "",
        rejectionReason: "",
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[80vh] !max-w-md overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              {selectedAction === "approve"
                ? "Approve Request"
                : "Reject Request"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              {selectedAction === "approve"
                ? "Approve this expense/allowance request."
                : "Reject this request with a reason."}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id="approval-action-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Action Type */}
            <div className="space-y-2">
              <Label htmlFor="action">Action *</Label>
              <Controller
                name="action"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approve">Approve</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.action && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.action.message}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="comment"
                    placeholder="Add a comment (optional)"
                    value={field.value || ""}
                  />
                )}
              />
              {errors.comment && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.comment.message}
                </p>
              )}
            </div>

            {/* Rejection Reason - only show when action is reject */}
            {selectedAction === "reject" && (
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                <Controller
                  name="rejectionReason"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="rejectionReason"
                      placeholder="Provide a reason for rejection"
                      value={field.value || ""}
                    />
                  )}
                />
                {errors.rejectionReason && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {errors.rejectionReason.message}
                  </p>
                )}
              </div>
            )}
          </form>
        </Form>

        <DialogFooter className="flex gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <CustomButton
            type="submit"
            loading={loading}
            form="approval-action-form"
          >
            {selectedAction === "approve"
              ? "Approve Request"
              : "Reject Request"}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Workflow Form
interface WorkflowFormProps {
  currentWorkflow?: ApprovalWorkflow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  onSubmit: (values: ApprovalWorkflowSchema) => void;
  resetOnSubmitSuccess?: boolean;
}

export function WorkflowForm({
  currentWorkflow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
  resetOnSubmitSuccess,
}: WorkflowFormProps) {
  const isEdit = !!currentWorkflow;

  const form = useForm<ApprovalWorkflowSchema>({
    resolver: zodResolver(approvalWorkflowSchema),
    defaultValues: {
      name: currentWorkflow?.name ?? "",
      description: currentWorkflow?.description ?? "",
      type: currentWorkflow?.type ?? "expense",
      steps:
        currentWorkflow?.steps.map((step) => ({
          order: step.order,
          approverType: step.approverType,
          approverId: step.approverId,
          roleId: step.roleId,
          minAmount: step.minAmount,
          maxAmount: step.maxAmount,
          isRequired: step.isRequired,
        })) ?? [],
      isActive: currentWorkflow?.isActive ?? true,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = (values: ApprovalWorkflowSchema) => {
    onSubmitValues(values);
  };

  const handleDialogChange = (state: boolean) => {
    if (!state) reset();
    onOpenChange(state);
  };

  useEffect(() => {
    if (!loading && !isEdit && resetOnSubmitSuccess) {
      reset({
        name: "",
        description: "",
        type: "expense",
        steps: [],
        isActive: true,
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[80vh] !max-w-lg overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              {isEdit ? "Edit Approval Workflow" : "Create Approval Workflow"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              {isEdit
                ? "Update approval workflow configuration."
                : "Create a new approval workflow."}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id="workflow-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Workflow Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Name *</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter workflow name"
                    value={field.value || ""}
                  />
                )}
              />
              {errors.name && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Workflow Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Workflow Type *</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select workflow type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="allowance">Allowance</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="Enter workflow description"
                    value={field.value || ""}
                  />
                )}
              />
              {errors.description && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Active Status */}
            <div className="space-y-2">
              <Label htmlFor="isActive">Active Status</Label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={field.value.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.isActive && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.isActive.message}
                </p>
              )}
            </div>
          </form>
        </Form>

        <DialogFooter className="flex gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <CustomButton type="submit" loading={loading} form="workflow-form">
            {isEdit ? "Update Workflow" : "Create Workflow"}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
