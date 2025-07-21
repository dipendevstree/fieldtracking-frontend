import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DriverData } from "../types";
import { CreditCard } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { Badge } from "@/components/ui/badge";

interface AccountDetailsProps {
    driverData: Pick<DriverData, 'login_type' | 'created_at' | 'updated_at'>;
}

export const AccountDetails: React.FC<AccountDetailsProps> = ({ driverData }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Account Details</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="font-medium text-gray-700">Login Type: </span>
                    <span className="capitalize">{driverData.login_type}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-700">Last Updated: </span>
                    <span>{formatDate(driverData.updated_at)}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-700">Account Created: </span>
                    <span>{formatDate(driverData.created_at)}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-700">Role: </span>
                    <Badge variant="secondary">Driver</Badge>
                </div>
            </div>
        </CardContent>
    </Card>
);