import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

// Placeholder data
const departments = [
  { label: "HR Department", value: "hr" },
  { label: "Finance Team", value: "finance" },
  { label: "IT Department", value: "it" },
];
const users = [
  { label: "Ronald Richards", value: "ronald" },
  { label: "Kathryn Murphy", value: "kathryn" },
  { label: "Jane Cooper", value: "jane" },
];
const expenseTypes = [
  { label: "Travel", value: "travel" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Training", value: "training" },
];

function getDefaultExpenseType() {
  return { type: "travel", minAmount: "1000", maxAmount: "10000" };
}

function getDefaultLevel() {
  return {
    user: "kathryn",
    expenseTypes: [getDefaultExpenseType(), getDefaultExpenseType()],
  };
}

export default function Approvers() {
  const [defaultApprover, setDefaultApprover] = useState("hr");
  const [selectedUser, setSelectedUser] = useState("ronald");
  const [levels, setLevels] = useState([
    getDefaultLevel(),
    getDefaultLevel(),
    getDefaultLevel(),
  ]);

  // Handlers
  const handleAddLevel = () => {
    setLevels([...levels, getDefaultLevel()]);
  };
  const handleRemoveLevel = (idx: number) => {
    setLevels(levels.filter((_, i) => i !== idx));
  };
  const handleUserChange = (levelIdx: number, value: string) => {
    setLevels(
      levels.map((lvl, i) =>
        i === levelIdx ? { ...lvl, user: value } : lvl
      )
    );
  };
  const handleExpenseTypeChange = (levelIdx: number, typeIdx: number, value: string) => {
    setLevels(
      levels.map((lvl, i) =>
        i === levelIdx
          ? {
              ...lvl,
              expenseTypes: lvl.expenseTypes.map((et, j) =>
                j === typeIdx ? { ...et, type: value } : et
              ),
            }
          : lvl
      )
    );
  };
  const handleAmountChange = (
    levelIdx: number,
    typeIdx: number,
    field: "minAmount" | "maxAmount",
    value: string
  ) => {
    setLevels(
      levels.map((lvl, i) =>
        i === levelIdx
          ? {
              ...lvl,
              expenseTypes: lvl.expenseTypes.map((et, j) =>
                j === typeIdx ? { ...et, [field]: value } : et
              ),
            }
          : lvl
      )
    );
  };
  const handleAddExpenseType = (levelIdx: number) => {
    setLevels(
      levels.map((lvl, i) =>
        i === levelIdx
          ? { ...lvl, expenseTypes: [...lvl.expenseTypes, getDefaultExpenseType()] }
          : lvl
      )
    );
  };
  const handleRemoveExpenseType = (levelIdx: number, typeIdx: number) => {
    setLevels(
      levels.map((lvl, i) =>
        i === levelIdx
          ? { ...lvl, expenseTypes: lvl.expenseTypes.filter((_, j) => j !== typeIdx) }
          : lvl
      )
    );
  };

  // Save/Cancel handlers (stub)
  const handleSave = () => {
    // TODO: Implement save logic
    alert("Saved! (stub)");
  };
  const handleCancel = () => {
    // TODO: Implement cancel logic
    alert("Cancelled! (stub)");
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Page Title and Description */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Expense Approvers Configuration</h1>
        <p className="text-muted-foreground text-sm">
          Configure approval hierarchy and default approvers for different scenarios
        </p>
      </div>

      {/* Top Row: Selectors and Add Level Button */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <div className="flex flex-col gap-1 w-full md:w-64">
            <Label>Default First Approver</Label>
            <Select value={defaultApprover} onValueChange={setDefaultApprover}>
              <SelectTrigger className="w-full bg-white border border-gray-200 shadow-none">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1 w-full md:w-64">
            <Label>Select user</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full bg-white border border-gray-200 shadow-none">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end w-full md:w-auto">
          <Button variant="default" className="bg-primary text-white px-4 py-2 rounded" onClick={handleAddLevel}>
            + Add New Level
          </Button>
        </div>
      </div>

      {/* Levels */}
      {levels.map((level, levelIdx) => (
        <div
          key={levelIdx}
          className="border border-dashed border-gray-200 rounded-xl p-6 mb-6 bg-gray-50 relative group transition-shadow"
        >
          {/* Remove Level Button */}
          {levels.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 opacity-70 hover:opacity-100"
              onClick={() => handleRemoveLevel(levelIdx)}
              tabIndex={-1}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
          <div className="font-semibold mb-4 text-lg">Level {levelIdx + 1}</div>
          <div className="flex flex-col md:flex-row gap-8 mb-2">
            <div className="flex-1 min-w-[180px]">
              <Label className="mb-1 block">Select User</Label>
              <Select
                value={level.user}
                onValueChange={(val) => handleUserChange(levelIdx, val)}
              >
                <SelectTrigger className="w-full bg-white border border-gray-200 shadow-none">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Expense Types */}
          {level.expenseTypes.map((et, typeIdx) => (
            <div
              key={typeIdx}
              className="flex flex-col md:flex-row md:items-end gap-4 mb-2"
            >
              <div className="flex-1 min-w-[180px]">
                <Label className="mb-1 block">Expense Type</Label>
                <Select
                  value={et.type}
                  onValueChange={(val) => handleExpenseTypeChange(levelIdx, typeIdx, val)}
                >
                  <SelectTrigger className="w-full bg-white border border-gray-200 shadow-none">
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseTypes.map((e) => (
                      <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[120px]">
                <Label className="mb-1 block">Minimum amount</Label>
                <Input
                  type="number"
                  value={et.minAmount}
                  onChange={(e) => handleAmountChange(levelIdx, typeIdx, "minAmount", e.target.value)}
                  placeholder="$0"
                  className="bg-white border border-gray-200 shadow-none"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <Label className="mb-1 block">Maximum amount</Label>
                <Input
                  type="number"
                  value={et.maxAmount}
                  onChange={(e) => handleAmountChange(levelIdx, typeIdx, "maxAmount", e.target.value)}
                  placeholder="$0"
                  className="bg-white border border-gray-200 shadow-none"
                />
              </div>
              <div className="flex items-center h-10 mt-2 md:mt-0">
                {level.expenseTypes.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-70 hover:opacity-100"
                    onClick={() => handleRemoveExpenseType(levelIdx, typeIdx)}
                    tabIndex={-1}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <div className="flex items-center mb-2">
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-primary"
              onClick={() => handleAddExpenseType(levelIdx)}
            >
              + Expense Type
            </Button>
          </div>
        </div>
      ))}
      {/* Save/Cancel Buttons */}
      <div className="flex justify-end gap-2 mt-8">
        <Button variant="outline" className="px-4 py-2" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="default" className="bg-primary text-white px-4 py-2" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}