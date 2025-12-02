import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
// Import XIcon from lucide-react
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchableSelect({
  options,
  value,
  onChange,
  onCancelPress,
  placeholder = "Select...",
  disabled = false,
}: {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange: (value: string) => void;
  onCancelPress?: () => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        disabled={disabled}
        className={cn(
          "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 overflow-hidden text-ellipsis whitespace-nowrap"
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
              onClick={(e) => {
                e.stopPropagation();
                onCancelPress();
                setSearch("");
              }}
            >
              <XIcon className="size-4 text-muted-foreground" />
            </button>
          )}
          <ChevronDownIcon className="size-4 opacity-50" />
        </div>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={cn(
            "bg-popover text-popover-foreground relative z-50 max-h-64 w-[var(--radix-popover-trigger-width)] min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md"
          )}
          align="start"
          sideOffset={4}
          collisionPadding={8}
        >
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-1 w-full rounded-md border px-2 py-1 text-sm focus:outline-none"
          />
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm select-none",
                  value === opt.value && "bg-accent text-accent-foreground"
                )}
              >
                <span className="flex-1">{opt.label}</span>
                {value === opt.value && (
                  <CheckIcon className="size-4 shrink-0" />
                )}
              </div>
            ))
          ) : (
            <div className="text-muted-foreground p-2 text-sm">
              No options found.
            </div>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
