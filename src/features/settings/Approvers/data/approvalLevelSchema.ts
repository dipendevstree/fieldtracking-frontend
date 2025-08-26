import { z } from "zod";
import { TIER } from "@/data/app.data";

// Schema for a single expense category entry
const expenseCategorySchema = z
  .object({
    expensesLevelId: z.string().optional(),
    expensesCategoryId: z.string().min(1, "Expense category is required."),
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
  expenseCategories: z
    .array(expenseCategorySchema)
    .min(1, "At least one expense category is required."),
});

// Main form schema with advanced cross-level validation
export const formSchema = z
  .object({
    defaultApprover: z.string().min(1, "Default approver role is required."),
    selectedUser: z.string().min(1, "Please select a default user."),
    levels: z.array(levelSchema),
  })
  .superRefine((data, ctx) => {
    const categoryTierChains = new Map<string, any[]>();

    // 1. Group expense categories by category-tier
    data.levels.forEach((level, levelIdx) => {
      level.expenseCategories.forEach((ec, categoryIdx) => {
        const key = `${ec.expensesCategoryId}-${ec.tier}`;
        if (!categoryTierChains.has(key)) {
          categoryTierChains.set(key, []);
        }
        categoryTierChains.get(key)?.push({
          levelIdx,
          categoryIdx,
          minAmount: Number(ec.minAmount),
          maxAmount: Number(ec.maxAmount),
        });
      });
    });

    // 2. Validate sequential order inside each chain
    for (const chain of categoryTierChains.values()) {
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
              "expenseCategories",
              current.categoryIdx,
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
              "expenseCategories",
              prev.categoryIdx,
              "maxAmount",
            ],
          });
        }
      }
    }
  });

export type FormValues = z.infer<typeof formSchema>;
