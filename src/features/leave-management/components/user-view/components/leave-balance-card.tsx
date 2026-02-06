import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LeaveBalanceCardProps {
  title: string;
  total: number;
  taken: number;
  balance: number;
  percentage: number;
  headerBg: string;
  titleColor: string;
}

export function LeaveBalanceCard({
  title,
  total,
  taken,
  balance,
  percentage,
  headerBg,
  titleColor,
}: LeaveBalanceCardProps) {
  const indicatorColorClass = `[&>*]:${titleColor.replace("text-", "bg-")}`;
  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden border-slate-200">
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between space-y-0 py-3",
          headerBg,
        )}
      >
        <div className="space-y-0.5">
          <CardTitle className={cn("text-sm font-bold", titleColor)}>
            {title}
          </CardTitle>
          <p className="text-[10px] text-slate-600 font-medium">
            Balance for {new Date().getFullYear()}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between text-sm mb-4">
          <div>
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
              Total
            </p>
            <p className="font-bold text-lg">{total}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
              Taken
            </p>
            <p className="font-bold text-lg text-red-500">{taken}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
              Balance
            </p>
            <p className="font-bold text-lg text-green-600">{balance}</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
            <span>Usage</span>
            <span>{percentage}%</span>
          </div>
          <Progress
            value={percentage}
            className={cn("h-1.5", indicatorColorClass)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
