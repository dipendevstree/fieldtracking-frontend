import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { DriverData } from "../types";
import { StatusIcon } from "./status-icon";

interface VerificationStatusProps {
    driverData: Pick<DriverData, 'is_completed_profile' | 'is_email_verified' | 'is_mobile_verified' | 'is_otp_verified'>;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({ driverData }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Verification Status</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {[
                { label: "Profile Completed", status: driverData?.is_completed_profile },
                { label: "Email Verified", status: driverData?.is_email_verified },
                { label: "Mobile Verified", status: driverData?.is_mobile_verified },
                { label: "OTP Verified", status: driverData?.is_otp_verified }
            ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{item?.label}</span>
                    <StatusIcon verified={item?.status} />
                </div>
            ))}
        </CardContent>
    </Card>
);