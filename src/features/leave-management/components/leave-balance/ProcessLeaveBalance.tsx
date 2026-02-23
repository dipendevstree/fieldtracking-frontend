import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { HandCoins, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import moment from "moment";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useGetUsersForDropdown } from "@/features/buyers/services/users.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import { useProcessLeaveBalance } from "../../services/leave-action.hook";

export default function ProcessLeaveBalance() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(moment().year());
  const [currentMonth, setCurrentMonth] = useState(moment().month());
  const [userId, setUserId] = useState<string>("");

  const handleYearChange = (year: string) => {
    setCurrentYear(Number(year));
  };

  const handleMonthChange = (month: string) => {
    setCurrentMonth(Number(month));
  };

  const handleUserIdChange = (userId: string) => {
    setUserId(userId);
  };

  const { mutate: processLeaveBalance, isPending } = useProcessLeaveBalance(
    () => {},
  );

  const { data: userList = [], isLoading: isUsersLoading } =
    useGetUsersForDropdown({});

  const enhancedUserList = userList.map((user: any) => ({
    ...user,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  }));

  const users = useSelectOptions<any>({
    listData: enhancedUserList,
    labelKey: "fullName",
    valueKey: "id",
  }).map((option: any) => ({ ...option, value: String(option.value) }));

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className={cn("h-8")}>
          <HandCoins /> Process Leave Balance (QA Only)
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <span className="font-semibold text-sm text-slate-900">
            Process Leave Balance (QA Only)
          </span>
        </div>

        {/* Stats */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 p-2 relative">
            <p className="text-xs font-medium text-slate-900 uppercase absolute top-0 left-5 bg-white px-1 -translate-y-2">
              Configuration
            </p>
            <div className="flex items-center justify-between gap-2 mt-2">
              <p className="text-sm font-medium text-slate-900">Year</p>
              <Select
                value={currentYear.toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-40 bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 15 }).map((_, i) => {
                    const year = moment().year() - 10 + i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-900">Month</p>
              <Select
                value={currentMonth.toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="w-40 bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }).map((_, i) => {
                    return (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        {moment.months(i)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-900">User</p>
              <div className="w-40">
                <SearchableSelect
                  options={users}
                  value={userId}
                  onChange={handleUserIdChange}
                  placeholder={isUsersLoading ? "Loading..." : "Select User..."}
                  disabled={isUsersLoading}
                  onCancelPress={() => {
                    setUserId("");
                  }}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Button
              className={cn("w-full")}
              disabled={true}
              title="Under Development"
              //   disabled={
              //     isUsersLoading ||
              //     !userId ||
              //     currentMonth === null ||
              //     currentYear === null ||
              //     isPending
              //   }
              onClick={() => {
                processLeaveBalance({
                  userId,
                  month: currentMonth,
                  year: currentYear,
                });
              }}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Process Leave Balance
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
