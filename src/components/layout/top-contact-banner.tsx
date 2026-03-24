import { AlertCircle, Globe, Mail, Phone } from "lucide-react";

interface TopContactBannerProps {
  planText: string;
}

export const TopContactBanner = ({ planText }: TopContactBannerProps) => {
  return (
    <div className="flex h-10 w-full items-center justify-between bg-red-50 border-b border-red-200 px-4 text-xs font-semibold text-red-600 shadow-sm sm:px-6 sm:text-[13px] dark:bg-red-950/30 dark:border-red-900 dark:text-red-400">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 animate-pulse" />
        <span className="uppercase tracking-wide">
          Action Required: {planText}. Please contact the FieldTrack360 team.
        </span>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <a href="tel:+919825841085" className="flex items-center gap-1.5 hover:text-red-700 dark:hover:text-red-300 transition-colors">
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">+91-9825841085</span>
          <span className="sm:hidden">Call Us</span>
        </a>
        <a href="mailto:support@fieldtrack360.com" className="flex items-center gap-1.5 hover:text-red-700 dark:hover:text-red-300 transition-colors">
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">support@fieldtrack360.com</span>
          <span className="sm:hidden">Email Us</span>
        </a>
        <a href="https://www.fieldtrack360.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-red-700 dark:hover:text-red-300 transition-colors">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">www.fieldtrack360.com</span>
          <span className="sm:hidden">Website</span>
        </a>
      </div>
    </div>
  );
};
