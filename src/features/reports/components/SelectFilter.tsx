import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface SelectFilterProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  options: { label: string; value: string }[];
}

export const SelectFilter: React.FC<SelectFilterProps> = ({
  label,
  value,
  onChange,
  placeholder,
  options,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative w-full">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full pr-8">
            {" "}
            {/* Add padding for clear button */}
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // prevent dropdown toggle
              onChange(""); // clear the value
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
