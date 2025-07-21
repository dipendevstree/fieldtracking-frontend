import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DriverData } from "../types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "../utils/formatDate";
import { Wallet } from "lucide-react";

interface DriverHeaderProps {
    driverData: Pick<DriverData, 'name' | 'profile_pic' | 'status' | 'is_online' | 'user_id' | 'created_at' | 'wallet'>;
}

export const DriverHeader: React.FC<DriverHeaderProps> = ({ driverData }) => (
    <div className="bg-white rounded-lg shadow-sm border p-3 md:p-6">
        <div className="flex items-center space-x-6">
            <Avatar className="md:w-20 md:h-20 size-10">
                <AvatarImage src={driverData?.profile_pic} />
                <AvatarFallback className="text-xl md:text-2xl font-semibold bg-blue-100 text-blue-600">
                    {driverData?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize">
                        {driverData?.name}
                    </h1>
                    <Badge variant={driverData?.status ? "default" : "secondary"}>
                        {driverData?.status ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant={driverData?.is_online ? "default" : "outline"}>
                        {driverData.is_online ? "Online" : "Offline"}
                    </Badge>
                </div>
                <p className="text-sm text-gray-500">
                    Member since {driverData?.created_at && formatDate(driverData?.created_at)}
                </p>
            </div>
            <div className="text-right">
                <div className="flex items-center space-x-2 text-2xl font-bold text-green-600">
                    <Wallet className="size-3 md:size-6" />
                    <span >${driverData?.wallet ?? 0}</span>
                </div>
                <p className="text-sm text-gray-500">Wallet Balance</p>
            </div>
        </div>
    </div>
);