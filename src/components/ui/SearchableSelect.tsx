import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Root as Popover,
  Trigger as PopoverTrigger,
  Portal as PopoverPortal,
  Content as PopoverContent,
} from "@radix-ui/react-popover";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  onCancelPress?: () => void;
  placeholder?: string;
  disabled?: boolean;
  onFetchMore?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onSearchChange?: (search: string) => void;
  isLoading?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  onCancelPress,
  placeholder = "Select...",
  disabled = false,
  onFetchMore,
  hasNextPage,
  isFetchingNextPage,
  onSearchChange,
  isLoading,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);
  const wheelHandlerRef = useRef<((e: WheelEvent) => void) | null>(null);

  // Handle infinite scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!onFetchMore || !hasNextPage || isFetchingNextPage) return;

      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      // Trigger when user scrolls within 20px of the bottom
      if (scrollHeight - scrollTop - clientHeight < 20) {
        onFetchMore();
      }
    },
    [onFetchMore, hasNextPage, isFetchingNextPage],
  );

  // Handle debounced search for API
  useEffect(() => {
    if (!onSearchChange) return;

    const timer = setTimeout(() => {
      onSearchChange(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, onSearchChange]);

  // Auto-close popup only when user scrolls outside the popover
  useEffect(() => {
    if (!open) return;
    const handlePageScroll = (e: Event) => {
      if (contentRef.current?.contains(e.target as Node)) return;
      setOpen(false);
      setSearch("");
    };

    window.addEventListener("scroll", handlePageScroll, true);
    return () => window.removeEventListener("scroll", handlePageScroll, true);
  }, [open]);

  // Callback ref: attach native non-passive wheel listener directly on content element
  const setContentRef = useCallback((node: HTMLDivElement | null) => {
    // Cleanup previous listener
    if (contentRef.current && wheelHandlerRef.current) {
      contentRef.current.removeEventListener("wheel", wheelHandlerRef.current);
    }

    contentRef.current = node;

    if (node) {
      const handleWheel = (e: WheelEvent) => {
        const listEl = node.querySelector(
          "[data-scroll-list]",
        ) as HTMLElement | null;
        if (!listEl) {
          e.preventDefault();
          return;
        }

        const hasOverflow = listEl.scrollHeight > listEl.clientHeight;
        if (!hasOverflow) {
          e.preventDefault();
          return;
        }

        // At scroll boundaries, prevent parent scroll
        const atTop = listEl.scrollTop === 0 && e.deltaY < 0;
        const atBottom =
          listEl.scrollTop + listEl.clientHeight >= listEl.scrollHeight &&
          e.deltaY > 0;

        if (atTop || atBottom) e.preventDefault();
      };

      wheelHandlerRef.current = handleWheel;
      node.addEventListener("wheel", handleWheel, { passive: false });
    } else {
      wheelHandlerRef.current = null;
    }
  }, []);

  // Handlers
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onCancelPress?.();
      setSearch("");
    },
    [onCancelPress],
  );

  const handleSelect = useCallback(
    (selectedValue: string) => {
      onChange(selectedValue);
      setOpen(false);
      setSearch("");
    },
    [onChange],
  );

  // Memoized values for performance
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    if (onSearchChange) return options;
    return options.filter((opt) =>
      (opt.label ?? "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search, onSearchChange]);

  // Handle popover open/close
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        setSearch("");
        if (onSearchChange) {
          onSearchChange("");
        }
      }
    },
    [onSearchChange],
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 overflow-hidden text-ellipsis whitespace-nowrap",
        )}
      >
        <span
          className={cn("truncate", !selectedOption && "text-muted-foreground")}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="flex items-center">
          {selectedOption && onCancelPress && !disabled && (
            <button
              type="button"
              aria-label="Clear selection"
              className="pointer-events-auto mr-1 rounded-full p-0.5 hover:bg-muted"
              onClick={handleClear}
            >
              <XIcon className="size-4 text-muted-foreground" />
            </button>
          )}
          <ChevronDownIcon className="size-4 opacity-50" />
        </div>
      </PopoverTrigger>

      <PopoverPortal>
        <PopoverContent
          ref={setContentRef}
          className={cn(
            "bg-popover text-popover-foreground relative z-50 w-[var(--radix-popover-trigger-width)] min-w-[8rem] rounded-md border p-1 shadow-md animate-in fade-in-0 zoom-in-95",
          )}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          align="start"
          sideOffset={4}
          collisionPadding={8}
        >
          <div className="px-1 pt-1">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-1 w-full rounded-md border px-2 py-1 text-sm focus:outline-none bg-transparent"
            />
          </div>

          <div
            data-scroll-list
            onScroll={handleScroll}
            className="max-h-64 overflow-y-auto overscroll-contain"
          >
            {filteredOptions.length > 0 ? (
              <>
                {filteredOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm select-none",
                      value === opt.value && "bg-accent text-accent-foreground",
                    )}
                  >
                    <span className="flex-1">{opt.label}</span>
                    {value === opt.value && (
                      <CheckIcon className="size-4 shrink-0" />
                    )}
                  </div>
                ))}
                {(isFetchingNextPage || isLoading) && (
                  <div className="text-muted-foreground py-2 text-xs text-center">
                    {isLoading ? "Searching..." : "Loading more..."}
                  </div>
                )}
              </>
            ) : (
              <div className="text-muted-foreground p-2 text-sm text-center">
                {isLoading ? "Searching..." : "No options found."}
              </div>
            )}
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}
