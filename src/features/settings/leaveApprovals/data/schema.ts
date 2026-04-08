import { z } from "zod";
import { ApprovalRole } from "../type/type";

// Base schema for leave approval level
const leaveApprovalLevelSchema = z.object({
  leaveApprovalsLevelId: z.string().optional(),
  tierkey: z.string().optional(),
  approvalRole: z.string().optional(),
  userId: z.string().optional(),
});

export const formSchema = z
  .object({
    territoryId: z.string().optional(),
    approvalRole: z.string().optional(),
    userId: z.string().optional(),
    tierEnabled: z.boolean(),
    leaveApprovalsLevels: z.array(leaveApprovalLevelSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.tierEnabled) {
      // When tierEnabled is false:
      // 1. approvalRole is required
      if (!data.approvalRole || data.approvalRole.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Approval role is required",
          path: ["approvalRole"],
        });
      }

      // 2. userId is required only if approvalRole is NOT reporting_to
      if (
        data.approvalRole &&
        data.approvalRole !== ApprovalRole.reporting_to &&
        (!data.userId || data.userId.trim() === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "User is required",
          path: ["userId"],
        });
      }
    } else {
      // When tierEnabled is true:
      // 1. leaveApprovalsLevels is required and must have at least one item
      if (
        !data.leaveApprovalsLevels ||
        data.leaveApprovalsLevels.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one approval level is required",
          path: ["leaveApprovalsLevels"],
        });
      } else {
        // 2. For each level, validate userId based on approvalRole
        data.leaveApprovalsLevels.forEach((level, index) => {
          if (!level.approvalRole || level.approvalRole.trim() === "") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Approval role is required",
              path: ["leaveApprovalsLevels", index, "approvalRole"],
            });
          }

          if (
            level.approvalRole &&
            level.approvalRole !== ApprovalRole.reporting_to &&
            (!level.userId || level.userId.trim() === "")
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "User is required",
              path: ["leaveApprovalsLevels", index, "userId"],
            });
          }
        });
      }
    }
  });

export type LeaveApprovalsFormSchema = z.infer<typeof formSchema>;
