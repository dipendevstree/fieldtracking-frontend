import { format, isValid } from "date-fns";

const EntityKeyMap: Record<string, string[]> = {
  customer: ["companyName"],
  customerContact: ["customerName"],
  customerType: ["typeName"],
  expensesCategory: ["categoryName"],
  user: ["email"],
  dailyAllowance: ["status", "tripType", "amount"],
  dailyAllowanceDetails: [
    "status",
    "tripType",
    "amount",
    "startDate",
    "endDate",
    "expensesDate",
    "notes",
  ],
  department: ["departmentName", "departmentKey"],
  employeeRang: ["employeeRange"],
  expenseApprovalLevel: ["level", "tierkey", "minAmount", "maxAmount"],
  expenseReviewAndApproval: ["status", "comment", "isDefaultApproval"],
  expenses: [
    "expenseType",
    "expenseSubType",
    "status",
    "totalAmount",
    "totalApprovedAmount",
    "startDate",
    "endDate",
    "notes",
    "adminComments",
  ],
  industry: ["industryName"],
  visit: [
    "date",
    "time",
    "status",
    "purpose",
    "priority",
    "city",
    "state",
    "country",
  ],
  userTerritory: ["name"],
  role: ["roleName"],
  organizationType: ["organizationTypeName", "organizationTypeKey", "isActive"],
  permission: [
    "roleName",
    "roleId",
    "organizationId",
    "organizationMenuId",
    "viewOwn",
    "viewGlobal",
    "add",
    "edit",
    "delete",
  ],
  organization: ["organizationName"],
  // add more entities here...
};

// Helper function to format the changes
export const formatAuditChanges = (
  oldValue: any,
  newValue: any,
  action: string,
  entity: string
): string => {
  const keysToShow = EntityKeyMap[entity] || [];

  const tryFormatValue = (val: any) => {
    if (val === null || val === undefined) return "N/A";

    if (val instanceof Date)
      return isValid(val) ? format(val, "dd-MM-yyyy, hh:mm a") : String(val);

    if (
      typeof val === "string" ||
      typeof val === "number" ||
      typeof val === "boolean"
    )
      return String(val);

    return JSON.stringify(val);
  };

  // DELETE
  if (action === "DELETE") {
    if (oldValue) {
      const fields = keysToShow
        .map((k) => tryFormatValue(oldValue[k]))
        .filter(Boolean)
        .join(", ");
      return fields ? `Deleted ${entity}: ${fields}` : `Deleted ${entity}`;
    }
    return "Entry Deleted";
  }

  // CREATE
  if (action === "CREATE") {
    if (newValue) {
      const fields = keysToShow
        .map((k) => tryFormatValue(newValue[k]))
        .filter(Boolean)
        .join(", ");
      return fields ? `Created ${entity}: ${fields}` : `Created ${entity}`;
    }
    return "Entry Created";
  }

  if (action === "UPDATE") {
    // This gives us a complete object with the latest data.
    const referenceObject = { ...oldValue, ...newValue };

    if (Object.keys(referenceObject).length > 0) {
      // Now, we can reliably get the identifying fields from our complete object.
      const fields = keysToShow
        .map((k) => tryFormatValue(referenceObject[k]))
        .filter(Boolean)
        .join(", ");

      return fields ? `Updated ${entity}: ${fields}` : `Updated ${entity}`;
    }

    // Fallback if both old and new values are empty
    return `Updated ${entity}`;
  }

  // LOGIN
  if (action.includes("USER LOGIN")) {
    return `User logged in. Email: ${newValue?.email || "N/A"}`;
  }

  // ADMIN LOGIN
  if (action.includes("ADMIN LOGIN")) {
    return `Admin logged in. Email: ${newValue?.email || "N/A"}`;
  }

  return JSON.stringify(newValue || oldValue || {});
};
