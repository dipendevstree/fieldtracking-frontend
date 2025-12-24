import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxDisplay?: number; // How many tags to show before converting to "+ N more"
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  disabled = false,
  maxDisplay = 3,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Filter options based on search query
  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle single item
  const toggle = (val: string) => {
    const set = new Set(value || []);
    if (set.has(val)) set.delete(val);
    else set.add(val);
    onChange(Array.from(set));
  };

  // Check if all *currently filtered* options are selected
  const isAllFilteredSelected =
    filtered.length > 0 && filtered.every((opt) => value.includes(opt.value));

  // Toggle "Select All" based on current filter
  const toggleSelectAll = () => {
    const currentSet = new Set(value || []);

    if (isAllFilteredSelected) {
      // Uncheck all visible items
      filtered.forEach((opt) => currentSet.delete(opt.value));
    } else {
      // Check all visible items
      filtered.forEach((opt) => currentSet.add(opt.value));
    }

    onChange(Array.from(currentSet));
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            "group flex min-h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors",
            "hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=open]:border-ring"
          )}
        >
          {/* Left Aligned Content (Tags) */}
          <div className="flex flex-1 flex-wrap gap-1 text-left items-center">
            {value && value.length > 0 ? (
              <>
                {/* Render the first N items */}
                {value.slice(0, maxDisplay).map((v) => {
                  const opt = options.find((o) => o.value === v);
                  return (
                    <span
                      key={v}
                      className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground border border-secondary-foreground/10"
                      onClick={(e) => e.stopPropagation()} // Prevent opening/closing when clicking tag
                    >
                      <span className="truncate max-w-[100px]">
                        {opt?.label || v}
                      </span>
                      <div
                        role="button"
                        className="rounded-full p-0.5 hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(v);
                        }}
                      >
                        <XIcon className="size-3" />
                      </div>
                    </span>
                  );
                })}

                {/* Render Count Badge if overflow */}
                {value.length > maxDisplay && (
                  <span className="inline-flex items-center justify-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border border-border">
                    +{value.length - maxDisplay} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex shrink-0 items-center gap-1 ml-1">
            {value && value.length > 0 && (
              <div
                role="button"
                title="Clear all"
                className="rounded-full p-0.5 hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer mr-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange([]);
                }}
              >
                <XIcon className="size-3.5" />
              </div>
            )}
            <ChevronDownIcon className="size-4 opacity-50 transition-transform group-data-[state=open]:rotate-180" />
          </div>
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={cn(
            "relative z-[70] w-[var(--radix-popover-trigger-width)] min-w-[12rem] rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95",
            "p-1"
          )}
          align="start"
          sideOffset={5}
          onInteractOutside={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('[role="dialog"]')) e.preventDefault();
          }}
        >
          {/* Search Input */}
          <div className="mb-1 px-1 pt-1">
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-sm border bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:bg-accent/50 transition-colors"
            />
          </div>

          {/* Select All Row */}
          {filtered.length > 0 && (
            <div
              onClick={toggleSelectAll}
              className={cn(
                "flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors border-b mb-1",
                "hover:bg-accent hover:text-accent-foreground font-medium text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary ring-offset-background transition-colors",
                  isAllFilteredSelected
                    ? "bg-primary text-primary-foreground"
                    : "border-muted-foreground"
                )}
              >
                {isAllFilteredSelected && (
                  <CheckIcon className="h-3 w-3 stroke-[3]" />
                )}
              </div>
              <span className="flex-1">Select All</span>
            </div>
          )}

          {/* Scrollable Container */}
          <div
            className="max-h-48 overflow-y-auto overscroll-contain py-1"
            onWheel={(e) => e.stopPropagation()}
          >
            {filtered.length > 0 ? (
              <div className="space-y-0.5 px-1">
                {filtered.map((opt) => {
                  const isSelected = (value || []).includes(opt.value);
                  return (
                    <div
                      key={opt.value}
                      onClick={() => toggle(opt.value)}
                      className={cn(
                        "flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent/40"
                      )}
                    >
                      {/* Checkbox Visual */}
                      <div
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary ring-offset-background transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "border-black"
                        )}
                      >
                        {isSelected && (
                          <CheckIcon className="h-3 w-3 stroke-[3]" />
                        )}
                      </div>

                      {/* Label */}
                      <span className="flex-1 truncate">{opt.label}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export default MultiSelect;
