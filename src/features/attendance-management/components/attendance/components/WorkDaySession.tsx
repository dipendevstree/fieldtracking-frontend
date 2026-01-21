import moment from "moment";
import { toast } from "sonner";
import {
  useGetWorkDaySession,
  useStartWorkDaySession,
  useEndWorkDaySession,
  useStartBreakSession,
  useEndBreakSession,
} from "../../../services/work-day-session.action.hook";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogIn, LogOut, Loader2 } from "lucide-react";

const WorkDaySession = () => {
  /* ---------------- Fetch today's session ---------------- */
  const { data: sessionData, isLoading: isFetching } = useGetWorkDaySession({
    date: moment().format("YYYY-MM-DD"),
  });

  /* ---------------- Mutations ---------------- */
  const { mutate: startWorkDay, isPending: startingDay } =
    useStartWorkDaySession();
  const { mutate: endWorkDay, isPending: endingDay } = useEndWorkDaySession();
  const { mutate: startBreak, isPending: startingBreak } =
    useStartBreakSession();
  const { mutate: endBreak, isPending: endingBreak } = useEndBreakSession();

  /* ---------------- Derived backend state ---------------- */

  // Active work session
  const activeWorkSession = sessionData?.sessions?.find(
    (s: any) => s.status === "in_progress",
  );

  const isDayStarted = !!activeWorkSession;
  const isOnBreak = !!activeWorkSession?.isOnBreak;

  // Active break (inside active session)
  const activeBreak = activeWorkSession?.breaks?.find(
    (b: any) => b.status === "in_progress",
  );

  // Totals from backend
  const totalWorkingTime = sessionData?.workingHours?.totalWorking ?? "00:00";
  const totalBreakTime = sessionData?.workingHours?.totalBreak ?? "00:00";

  const isLoading =
    isFetching || startingDay || endingDay || startingBreak || endingBreak;

  /* ---------------- Button visibility ---------------- */
  const showCheckIn = !isDayStarted;
  const showStartBreak = isDayStarted && !isOnBreak;
  const showEndBreak = isDayStarted && isOnBreak;
  const showCheckOut = isDayStarted && !isOnBreak;

  /* ---------------- Handlers ---------------- */

  const handleCheckIn = () => {
    startWorkDay({
      date: moment().format("DD-MM-YYYY"),
      dayStartAddress: "web",
    });
  };

  const handleCheckOut = () => {
    if (!activeWorkSession) {
      toast.error("No active work session found");
      return;
    }

    endWorkDay({
      workDaySessionId: activeWorkSession.workDaySessionId,
      dayEndAddress: "web",
    });
  };

  const handleStartBreak = () => {
    if (!activeWorkSession?.workDaySessionId) {
      toast.error("Work day not started");
      return;
    }

    startBreak({
      workDaySessionId: activeWorkSession.workDaySessionId,
      breakType: "Web Break",
      notes: "",
      breakStartAddress: "Web",
    });
  };

  const handleEndBreak = () => {
    if (!activeBreak) {
      toast.error("No active break found");
      return;
    }

    endBreak({
      workBreakSessionId: activeBreak.workBreakSessionId,
      breakEndAddress: "Web",
    });
  };

  /* ---------------- UI ---------------- */
  return (
    <Card className="w-full max-w-sm mb-6 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold">Work Day Session</CardTitle>

        <Badge
          className={
            isOnBreak
              ? "bg-amber-100 text-amber-700"
              : isDayStarted
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
          }
        >
          {isOnBreak ? "On Break" : isDayStarted ? "Working" : "Not Working"}
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Totals */}
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-slate-500">Working Time</p>
              <p className="font-semibold">{totalWorkingTime}</p>
            </div>

            <div>
              <p className="text-slate-500">Break Time</p>
              <p className="font-semibold">{totalBreakTime}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            {showCheckIn && (
              <Button
                className="flex-1"
                onClick={handleCheckIn}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <LogIn className="mr-2 h-4 w-4" />
                Check In
              </Button>
            )}

            {showStartBreak && (
              <Button
                className="flex-1"
                onClick={handleStartBreak}
                disabled={isLoading}
                variant="secondary"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Start Break
              </Button>
            )}

            {showCheckOut && (
              <Button
                className="flex-1"
                onClick={handleCheckOut}
                disabled={isLoading}
                variant="destructive"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <LogOut className="mr-2 h-4 w-4" />
                Check Out
              </Button>
            )}

            {showEndBreak && (
              <Button
                className="flex-1"
                onClick={handleEndBreak}
                disabled={isLoading}
                variant="secondary"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                End Break
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkDaySession;
