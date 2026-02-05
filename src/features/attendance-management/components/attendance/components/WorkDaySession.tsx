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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LogIn,
  LogOut,
  ClockIcon,
  Loader2,
  Coffee,
  LucideIcon,
  Play,
  AlertTriangle,
  Smartphone,
  Info,
} from "lucide-react";
import { useAuthStore } from "@/stores/use-auth-store";
import { socketForVisit } from "@/socket/socket";
import { useNavigate } from "@tanstack/react-router";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useViewType } from "@/context/view-type-context";
import { ViewType } from "@/components/layout/types";
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

// --- 2. MOBILE GUARD WRAPPER ---
// This wraps buttons to show a tooltip if mobile tracking is active
const MobileGuard = ({
  children,
  isMobileActive,
}: {
  children: React.ReactNode;
  isMobileActive: boolean;
}) => {
  if (!isMobileActive) return <>{children}</>;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {/* We need a span here because disabled buttons don't fire mouse events */}
          <span className="w-full block cursor-not-allowed opacity-80">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[250px] bg-slate-900 text-white border-slate-800 p-3">
          <div className="flex items-start gap-3">
            <Smartphone className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-sm">Mobile Tracking Active</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                You started this session on mobile with live tracking. Please
                manage this session via the mobile app.
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// --- 3. UTILITIES ---
const parseDurationToSeconds = (time = "00:00:00") => {
  if (!time) return 0;
  const parts = time.split(":").map(Number);
  const h = parts[0] || 0;
  const m = parts[1] || 0;
  const s = parts[2] || 0;
  return h * 3600 + m * 60 + s;
};

const formatSecondsToDuration = (totalSeconds = 0) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  const hDisplay = h.toString().padStart(2, "0");
  const mDisplay = m.toString().padStart(2, "0");
  const sDisplay = s.toString().padStart(2, "0");

  return `${hDisplay}:${mDisplay}:${sDisplay}`;
};

// --- 4. MAIN COMPONENT ---
const WorkDaySession = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { viewType, setViewType, setViewTypeToggle } = useViewType();
  const [isOpen, setIsOpen] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [dynamicErrorMsg, setDynamicErrorMsg] = useState("");

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

  /* ---------------- Derived State ---------------- */
  const activeWorkSession = sessionData?.activeSession;
  const isMobileActive = !!sessionData?.isMobileActive;

  const isPreviousDay =
    activeWorkSession?.date &&
    moment(activeWorkSession.date).format("YYYY-MM-DD") !==
      moment().format("YYYY-MM-DD");
  const isDayStarted = !!activeWorkSession;
  const isOnBreak = !!activeWorkSession?.isOnBreak;
  const activeBreak = activeWorkSession?.breaks?.find(
    (b: any) => b.status === "in_progress",
  );

  /* ---------------- Mutations ---------------- */
  const { mutate: startWorkDay, isPending: startingDay } =
    useStartWorkDaySession();

  const { mutate: endWorkDay, isPending: endingDay } = useEndWorkDaySession({
    skipToast: true,
    onError: (err: any) => {
      const msg =
        err.response?.data?.message || err.message || "Failed to end day";
      const statusCode = err.statusCode || err.response?.status;
      const messageCode = err.response?.data?.messageCode;

      if (
        isPreviousDay &&
        messageCode === "SESSION_CORRECTION_REQUIRED" &&
        statusCode === 403
      ) {
        setDynamicErrorMsg(msg);
        setShowRedirectModal(true);
      } else {
        toast.error(msg);
      }
    },
  });
  const { mutate: startBreak, isPending: startingBreak } =
    useStartBreakSession();
  const { mutate: endBreak, isPending: endingBreak } = useEndBreakSession();

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
    if (isMobileActive) return;
    if (!activeWorkSession) return toast.error("No active session");
    endWorkDay({
      workDaySessionId: activeWorkSession.workDaySessionId,
      dayEndAddress: "web",
    });
  };

  const handleStartBreak = () => {
    if (isMobileActive) return;
    if (!activeWorkSession) return toast.error("Work day not started");
    startBreak({
      workDaySessionId: activeWorkSession.workDaySessionId,
      breakType: "Web Break",
      breakStartAddress: "Web",
    });
  };

  const handleEndBreak = () => {
    if (isMobileActive) return;
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
          {isMobileActive && (
            <Smartphone className="ml-2 h-3 w-3 animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <span className="font-semibold text-sm text-slate-900">
            {isPreviousDay ? "Ongoing Session" : "Today's Session"}
          </span>
          <Badge
            variant="outline"
            className={cn(
              "border-0",
              isPreviousDay
                ? "bg-rose-100 text-rose-700 animate-pulse"
                : isOnBreak
                  ? "bg-amber-100 text-amber-700"
                  : isDayStarted
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-600",
            )}
          >
            {isPreviousDay
              ? "Previous Day"
              : isOnBreak
                ? "On Break"
                : isDayStarted
                  ? "Working"
                  : "Not Started"}
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
                disabled={isMobileActive}
              >
                Check In
              </ActionButton>
            )}

            {isDayStarted && !isOnBreak && (
              <div className="grid grid-cols-2 gap-2">
                <MobileGuard isMobileActive={isMobileActive}>
                  <ActionButton
                    isLoading={startingBreak}
                    isGlobalLoading={isGlobalLoading}
                    icon={Coffee}
                    onClick={handleStartBreak}
                    variant="outline"
                    className="w-full"
                    disabled={isMobileActive}
                  >
                    Break
                  </ActionButton>
                </MobileGuard>

                <MobileGuard isMobileActive={isMobileActive}>
                  <ActionButton
                    isLoading={endingDay}
                    isGlobalLoading={isGlobalLoading}
                    icon={LogOut}
                    onClick={handleCheckOut}
                    variant="destructive"
                    className="w-full"
                    disabled={isMobileActive}
                  >
                    Check Out
                  </ActionButton>
                </MobileGuard>
              </div>
            )}

            {isDayStarted && isOnBreak && (
              <MobileGuard isMobileActive={isMobileActive}>
                <ActionButton
                  isLoading={endingBreak}
                  isGlobalLoading={isGlobalLoading}
                  icon={Play}
                  onClick={handleEndBreak}
                  variant="secondary"
                  className="w-full bg-amber-100"
                  disabled={isMobileActive}
                >
                  End Break
                </ActionButton>
              </MobileGuard>
            )}
          </div>
          {!isMobileActive && (
            <p className="text-xs text-amber-700 bg-amber-50 rounded-md px-2 py-1.5 flex items-center justify-center gap-1.5 mt-2 border border-amber-100">
              <Info size={14} className="shrink-0 text-amber-500" />
              <span>
                For live tracking, please start your day from the mobile app.
              </span>
            </p>
          )}
        </div>
      </PopoverContent>

      <ConfirmDialog
        open={showRedirectModal}
        onOpenChange={setShowRedirectModal}
        title={
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Ongoing Session from Previous Day</span>
          </div>
        }
        desc={
          dynamicErrorMsg ||
          "This work session has expired. Please raise an attendance correction request before ending this session."
        }
        confirmText="Go to Corrections"
        cancelBtnText="Close"
        handleConfirm={() => {
          if (viewType === ViewType.Admin) {
            setViewType(ViewType.Self);
            setViewTypeToggle(true);
          }
          navigate({ to: "/attendance-management/my-attendance" });
          setShowRedirectModal(false);
        }}
      />
    </Popover>
  );
};

export default WorkDaySession;
