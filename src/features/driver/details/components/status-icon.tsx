import { CheckCircle, XCircle } from "lucide-react";
import { StatusIconProps } from "../types";

export const StatusIcon: React.FC<StatusIconProps> = ({ verified, size = 16 }) => (
    verified ? (
        <CheckCircle className={`w-${size / 4} h-${size / 4} text-green-500`} />
    ) : (
        <XCircle className={`w-${size / 4} h-${size / 4} text-red-500`} />
    )
);