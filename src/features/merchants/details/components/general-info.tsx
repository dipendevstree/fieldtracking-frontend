import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, FileText, Globe, Hash, Mail, MapPin, Phone, Settings, User } from "lucide-react";
import { InfoItem } from "./info-item";

interface MerchantData {
  name: string;
  user_name: string;
  gender: string;
  language: string;
  email: string;
  is_email_verified: boolean;
  country_code: string;
  mobile: string;
  is_mobile_verified: boolean;
  country: string;
  is_country_verified: boolean;
  device_type: string;
  wallet: string;

}

const GeneralInfoSection = ({ merchantData }: { merchantData: MerchantData }) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={User}
              label="Full Name"
              verified
              value={merchantData.name}
            />
            <InfoItem
              icon={Hash}
              label="Username"
              verified
              value={merchantData.user_name}
            />
            <InfoItem
              icon={User}
              label="Gender"
              verified
              value={merchantData.gender}
            />
            <InfoItem
              icon={Globe}
              label="Language"
              verified
              value={merchantData.language}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={Mail}
              label="Email"
              value={merchantData.email}
              verified={merchantData.is_email_verified}
            />
            <InfoItem
              icon={Phone}
              label="Mobile"
              value={`${merchantData.country_code} ${merchantData.mobile}`}
              verified={merchantData.is_mobile_verified}
            />
            <InfoItem
              icon={MapPin}
              label="Country"
              value={merchantData.country}
              verified={merchantData.is_country_verified}
            />
            <InfoItem
              icon={Settings}
              label="Device Type"
              value={merchantData.device_type}
              verified
            />
          </CardContent>
        </Card>

      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Wallet & Financial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Wallet Balance</p>
                  <p className="text-2xl font-bold text-blue-600">${merchantData.wallet}</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Tax ID</p>
                  <p className="text-lg font-semibold text-gray-600">Not Set</p>
                </div>
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Currency</p>
                  <p className="text-lg font-semibold text-gray-600">Not Set</p>
                </div>
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GeneralInfoSection
