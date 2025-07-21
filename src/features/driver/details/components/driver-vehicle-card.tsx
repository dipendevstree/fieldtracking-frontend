import { Camera, Car, FileText } from "lucide-react";
import { Vehicle } from "../types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface VehicleCardProps {
    vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => (
    <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg capitalize">
                        {vehicle?.make} {vehicle?.model}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {vehicle?.modelYear} • {vehicle?.color}
                    </p>
                </div>
            </div>
            <Badge variant="outline" className="text-lg font-mono">
                {vehicle?.plate_number}
            </Badge>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2" onClick={() => window.open(vehicle.vehicle_documents?.[0], '_blank')}>
                <div className="flex items-center space-x-2" >
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Documents</span>
                </div>
                <div className="text-sm text-blue-600 hover:underline cursor-pointer">
                    View Vehicle Documents
                </div>
            </div>
            <div className="space-y-2" onClick={() => window.open(vehicle.vehicle_photos?.[0], '_blank')}>
                <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Photos</span>
                </div>
                <div className="text-sm text-blue-600 hover:underline cursor-pointer">
                    View Vehicle Photos
                </div>
            </div>
        </div>
    </div>
);