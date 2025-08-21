import { z } from "zod";
import { EXPENSE_TYPE, TIER } from "@/data/app.data";

// Schema for a single expense type entry
const expenseTypeSchema = z
  .object({
    expensesLevelId: z.string().optional(),
    type: z.nativeEnum(EXPENSE_TYPE),
    tier: z.nativeEnum(TIER),
    minAmount: z.string().min(1, "Min amount is required."),
    maxAmount: z.string().min(1, "Max amount is required."),
  })
  .refine(
    (data) => {
      const min = Number(data.minAmount);
      const max = Number(data.maxAmount);
      return !isNaN(min) && !isNaN(max) && max >= min;
    },
    {
      message: "Max amount must be greater than or equal to min amount.",
      path: ["maxAmount"], // Error shown on the maxAmount field
    }
  );

// Schema for a single approval level
const levelSchema = z.object({
  user: z.string().min(1, "Please select a user."),
  expenseTypes: z
    .array(expenseTypeSchema)
    .min(1, "At least one expense type is required."),
});

// Main form schema with advanced cross-level validation
export const formSchema = z
  .object({
    defaultApprover: z.string().min(1, "Default approver role is required."),
    selectedUser: z.string().min(1, "Please select a default user."),
    levels: z.array(levelSchema),
  })
  .superRefine((data, ctx) => {
    const typeTierChains = new Map<string, any[]>();

    // 1. Group expense types by type-tier
    data.levels.forEach((level, levelIdx) => {
      level.expenseTypes.forEach((et, typeIdx) => {
        const key = `${et.type}-${et.tier}`;
        if (!typeTierChains.has(key)) {
          typeTierChains.set(key, []);
        }
        typeTierChains.get(key)?.push({
          levelIdx,
          typeIdx,
          minAmount: Number(et.minAmount),
          maxAmount: Number(et.maxAmount),
        });
      });
    });

    // 2. Validate sequential order inside each chain
    for (const chain of typeTierChains.values()) {
      for (let i = 1; i < chain.length; i++) {
        const prev = chain[i - 1];
        const current = chain[i];

        if (current.minAmount <= prev.maxAmount) {
          // Error on current min
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Min must be greater than previous level's max (${prev.maxAmount})`,
            path: [
              "levels",
              current.levelIdx,
              "expenseTypes",
              current.typeIdx,
              "minAmount",
            ],
          });

          // Error on previous max
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Max must be less than next level's min (${current.minAmount})`,
            path: [
              "levels",
              prev.levelIdx,
              "expenseTypes",
              prev.typeIdx,
              "maxAmount",
            ],
          });
        }
      }
    }
  });

export type FormValues = z.infer<typeof formSchema>;
