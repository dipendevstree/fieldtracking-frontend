import { Eye, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import CustomTooltip from "@/components/shared/custom-tooltip";

interface AttachmentItemProps {
  name: string;
  isNew: boolean;
  onPreview: () => void;
  onRemove: () => void;
  error?: string;
}

export const AttachmentItem = ({
  name,
  isNew,
  onPreview,
  onRemove,
  error,
}: AttachmentItemProps) => {
  return (
    <div className="flex items-center justify-between p-2 bg-white border rounded-md text-sm shadow-sm transition-colors hover:bg-slate-50">
      <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0 mr-2">
        <FileText
          className={cn(
            "h-4 w-4 shrink-0",
            isNew ? "text-green-600" : "text-blue-500"
          )}
        />
        <span
          className={cn(
            "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 border",
            isNew
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          )}
        >
          {isNew ? "New" : "Existing"}
        </span>
        <div className="flex flex-col min-w-0">
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPreview();
            }}
            className={cn(
              "truncate max-w-[200px] text-slate-700 cursor-pointer hover:underline text-xs sm:text-sm font-medium",
              isNew ? "hover:text-green-700" : "hover:text-blue-700",
              error && "text-red-600"
            )}
            title={`View ${name}`}
          >
            {name}
          </span>
          {error && (
            <span className="text-[10px] text-red-500 font-medium leading-tight">
              {error}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <CustomTooltip title="Preview">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPreview();
            }}
            className="p-1 text-slate-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
          >
            <Eye className="h-4 w-4" />
          </button>
        </CustomTooltip>
        <CustomTooltip title="Remove">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </button>
        </CustomTooltip>
      </div>
    </div>
  );
};
