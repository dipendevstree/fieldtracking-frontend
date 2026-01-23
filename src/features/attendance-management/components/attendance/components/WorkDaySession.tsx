import { useEffect, useState, useRef } from "react";
import moment from "moment";
import { toast } from "sonner";
import {
  useGetWorkDaySession,
  useStartWorkDaySession,
  useEndWorkDaySession,
  useStartBreakSession,
  useEndBreakSession,
} from "../../../services/work-day-session.action.hook";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  LogIn,
  LogOut,
  ClockIcon,
  Loader2,
  Coffee,
  LucideIcon,
  Play,
} from "lucide-react";
import { useAuthStore } from "@/stores/use-auth-store";
import { socketForVisit } from "@/socket/socket";
import { cn } from "@/lib/utils";

// --- 1. REUSABLE BUTTON COMPONENT ---
interface ActionButtonProps extends React.ComponentProps<typeof Button> {
  isLoading: boolean;
  isGlobalLoading: boolean;
  icon: LucideIcon;
}

const ActionButton = ({
  isLoading,
  isGlobalLoading,
  icon: Icon,
  children,
  disabled,
  ...props
}: ActionButtonProps) => (
  <Button disabled={isGlobalLoading || disabled} {...props}>
    {isLoading ? (
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
    ) : (
      <Icon className="h-4 w-4 mr-2" />
    )}
    {children}
  </Button>
);

// Convert "HH:mm:ss" → seconds
const parseDurationToSeconds = (time = "00:00:00") => {
  const [h = 0, m = 0, s = 0] = time.split(":").map(Number);
  return h * 3600 + m * 60 + s;
};

// Convert seconds → "HH:mm:ss"
const formatSecondsToDuration = (seconds = 0) => {
  return moment.utc(seconds * 1000).format("HH:mm:ss");
};

const WorkDaySession = () => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  /* ---------------- Live Timer State ---------------- */
  const [liveWorkTime, setLiveWorkTime] = useState("00:00:00");
  const [liveBreakTime, setLiveBreakTime] = useState("00:00:00");

  const baseWorkSecondsRef = useRef(0);
  const baseBreakSecondsRef = useRef(0);
  const lastSyncTimeRef = useRef(Date.now());

  /* ---------------- Fetch Session ---------------- */
  const {
    data: sessionData,
    isLoading: isFetching,
    refetch,
    dataUpdatedAt,
  } = useGetWorkDaySession({
    date: moment().format("YYYY-MM-DD"),
    enabled: !!user,
  });

  /* ---------------- Socket Sync ---------------- */
  useEffect(() => {
    if (!user?.id || !user?.access_token) return;
    const socket = socketForVisit(user.access_token);
    if (!socket) return;

    const onConnect = () => socket.emit("track_user", { userId: user.id });
    const onRefresh = (payload: any) => {
      if (payload?.userId === user.id) refetch();
    };

    socket.connected ? onConnect() : socket.on("connect", onConnect);
    socket.on("work_session", onRefresh);
    socket.on("break_session", onRefresh);

    return () => {
      socket.off("connect", onConnect);
      socket.off("work_session", onRefresh);
      socket.off("break_session", onRefresh);
    };
  }, [user, refetch]);

  /* ---------------- Mutations ---------------- */
  const { mutate: startWorkDay, isPending: startingDay } =
    useStartWorkDaySession();
  const { mutate: endWorkDay, isPending: endingDay } = useEndWorkDaySession();
  const { mutate: startBreak, isPending: startingBreak } =
    useStartBreakSession();
  const { mutate: endBreak, isPending: endingBreak } = useEndBreakSession();

  /* ---------------- Derived State ---------------- */
  const activeWorkSession = sessionData?.sessions?.find(
    (s: any) => s.status === "in_progress",
  );
  const isDayStarted = !!activeWorkSession;
  const isOnBreak = !!activeWorkSession?.isOnBreak;
  const activeBreak = activeWorkSession?.breaks?.find(
    (b: any) => b.status === "in_progress",
  );

  const isGlobalLoading =
    isFetching || startingDay || endingDay || startingBreak || endingBreak;

  // SYNC SERVER TOTALS → LOCAL BASE
  useEffect(() => {
    if (!sessionData) return;
    const work = sessionData?.workingHours?.totalWorking ?? "00:00:00";
    const brk = sessionData?.workingHours?.totalBreak ?? "00:00:00";

    baseWorkSecondsRef.current = parseDurationToSeconds(work);
    baseBreakSecondsRef.current = parseDurationToSeconds(brk);
    lastSyncTimeRef.current = dataUpdatedAt || Date.now();

    setLiveWorkTime(work);
    setLiveBreakTime(brk);
  }, [sessionData, dataUpdatedAt]);

  /* LIVE TIMER */
  useEffect(() => {
    if (!isDayStarted) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - lastSyncTimeRef.current) / 1000);

      if (isOnBreak) {
        setLiveBreakTime(
          formatSecondsToDuration(baseBreakSecondsRef.current + elapsedSeconds),
        );
        setLiveWorkTime(formatSecondsToDuration(baseWorkSecondsRef.current));
      } else {
        setLiveWorkTime(
          formatSecondsToDuration(baseWorkSecondsRef.current + elapsedSeconds),
        );
        setLiveBreakTime(formatSecondsToDuration(baseBreakSecondsRef.current));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isDayStarted, isOnBreak]);

  /* ---------------- Handlers ---------------- */
  const handleCheckIn = () =>
    startWorkDay({
      date: moment().format("DD-MM-YYYY"),
      dayStartAddress: "web",
    });

  const handleCheckOut = () => {
    if (!activeWorkSession) return toast.error("No active session");
    endWorkDay({
      workDaySessionId: activeWorkSession.workDaySessionId,
      dayEndAddress: "web",
    });
  };

  const handleStartBreak = () => {
    if (!activeWorkSession) return toast.error("Work day not started");
    startBreak({
      workDaySessionId: activeWorkSession.workDaySessionId,
      breakType: "Web Break",
      breakStartAddress: "Web",
    });
  };

  const handleEndBreak = () => {
    if (!activeBreak) return toast.error("No active break");
    endBreak({
      workBreakSessionId: activeBreak.workBreakSessionId,
      breakEndAddress: "Web",
    });
  };

  /* ---------------- UI  ---------------- */
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "h-8",
            isDayStarted &&
              (isOnBreak
                ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"),
          )}
        >
          <ClockIcon className="size-4" />
          {isDayStarted ? (
            <span className="text-sm font-mono font-bold">
              {isOnBreak ? liveBreakTime : liveWorkTime}
            </span>
          ) : (
            "Start Day"
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <span className="font-semibold text-sm text-slate-900">
            Today's Session
          </span>
          <Badge
            variant="outline"
            className={cn(
              "border-0",
              isOnBreak
                ? "bg-amber-100 text-amber-700"
                : isDayStarted
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-600",
            )}
          >
            {isOnBreak ? "On Break" : isDayStarted ? "Working" : "Not Started"}
          </Badge>
        </div>

        {/* Stats */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div
              className={cn(
                "rounded-lg p-3 border flex flex-col items-center justify-center",
                !isOnBreak && isDayStarted
                  ? "bg-emerald-50/50 border-emerald-100"
                  : "bg-slate-50 border-slate-100",
              )}
            >
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Work
              </span>
              <span className="text-xl font-mono font-bold">
                {liveWorkTime}
              </span>
            </div>
            <div
              className={cn(
                "rounded-lg p-3 border flex flex-col items-center justify-center",
                isOnBreak
                  ? "bg-amber-50/50 border-amber-100"
                  : "bg-slate-50 border-slate-100",
              )}
            >
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Break
              </span>
              <span className="text-xl font-mono font-bold">
                {liveBreakTime}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {!isDayStarted && (
              <ActionButton
                isLoading={startingDay}
                isGlobalLoading={isGlobalLoading}
                icon={LogIn}
                onClick={handleCheckIn}
                className="w-full bg-slate-900"
              >
                Check In
              </ActionButton>
            )}

            {isDayStarted && !isOnBreak && (
              <div className="grid grid-cols-2 gap-2">
                <ActionButton
                  isLoading={startingBreak}
                  isGlobalLoading={isGlobalLoading}
                  icon={Coffee}
                  onClick={handleStartBreak}
                  variant="outline"
                >
                  Break
                </ActionButton>

                <ActionButton
                  isLoading={endingDay}
                  isGlobalLoading={isGlobalLoading}
                  icon={LogOut}
                  onClick={handleCheckOut}
                  variant="destructive"
                >
                  Check Out
                </ActionButton>
              </div>
            )}

            {isDayStarted && isOnBreak && (
              <ActionButton
                isLoading={endingBreak}
                isGlobalLoading={isGlobalLoading}
                icon={Play}
                onClick={handleEndBreak}
                variant="secondary"
                className="w-full bg-amber-100"
              >
                End Break
              </ActionButton>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WorkDaySession;
