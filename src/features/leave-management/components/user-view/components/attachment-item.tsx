import { Eye, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import CustomTooltip from "@/components/shared/custom-tooltip";

interface AttachmentItemProps {
  name: string;
  isNew: boolean;
  onPreview: () => void;
  onRemove: () => void;
}

export const AttachmentItem = ({
  name,
  isNew,
  onPreview,
  onRemove,
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
          onClick={onPreview}
          className={cn(
            "truncate max-w-[240px] text-slate-700 cursor-pointer hover:underline text-xs sm:text-sm",
            isNew ? "hover:text-green-700" : "hover:text-blue-700"
          )}
          title={`View ${name}`}
        >
          {name}
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <CustomTooltip title="Preview">
          <button
            type="button"
            onClick={onPreview}
            className="p-1 text-slate-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
          >
            <Eye className="h-4 w-4" />
          </button>
        </CustomTooltip>
        <CustomTooltip title="Remove">
          <button
            type="button"
            onClick={onRemove}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </button>
        </CustomTooltip>
      </div>
    </div>
  );
};
