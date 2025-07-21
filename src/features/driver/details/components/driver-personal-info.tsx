import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DriverData } from "../types";
import { Globe, Mail, MapPin, Phone, Smartphone, User } from "lucide-react";
import { StatusIcon } from "./status-icon";

export interface PersonalInfoProps {
    driverData: Pick<DriverData, 'email' | 'country_code' | 'mobile' | 'country' | 'gender' | 'language' | 'device_type' | 'is_email_verified' | 'is_mobile_verified'>;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ driverData }) => (
    <Card className="lg:col-span-2">
        <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Personal Information</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">{driverData?.email}</span>
                        <StatusIcon verified={driverData?.is_email_verified} />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">{driverData?.country_code} {driverData?.mobile}</span>
                        <StatusIcon verified={driverData?.is_mobile_verified} />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Country</label>
                    <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">{driverData?.country}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Gender</label>
                    <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900 capitalize">{driverData?.gender}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Language</label>
                    <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900 capitalize">{driverData?.language}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Device</label>
                    <div className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900 capitalize">{driverData?.device_type}</span>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);