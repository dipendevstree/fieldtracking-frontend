
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, Mail, Phone, Shield, User } from "lucide-react";

interface MerchantData {
  email: string;
  is_email_verified: boolean;
  country_code: string;
  mobile: string;
  is_mobile_verified: boolean;
  is_otp_verified: boolean;
  is_completed_profile: boolean;
}

const VerificationSection = ({ merchantData }: { merchantData: MerchantData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Account Verification Status
        </CardTitle>
        <CardDescription>
          Track the verification status of various account elements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Email Verification</p>
                  <p className="text-sm text-gray-600">{merchantData.email}</p>
                </div>
              </div>
              <Badge variant={merchantData.is_email_verified ? 'default' : 'destructive'}>
                {merchantData.is_email_verified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Mobile Verification</p>
                  <p className="text-sm text-gray-600">{merchantData.country_code} {merchantData.mobile}</p>
                </div>
              </div>
              <Badge variant={merchantData.is_mobile_verified ? 'default' : 'destructive'}>
                {merchantData.is_mobile_verified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Hash className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">OTP Verification</p>
                  <p className="text-sm text-gray-600">One-time password</p>
                </div>
              </div>
              <Badge variant={merchantData.is_otp_verified ? 'default' : 'destructive'}>
                {merchantData.is_otp_verified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium">Profile Completion</p>
                  <p className="text-sm text-gray-600">Basic profile setup</p>
                </div>
              </div>
              <Badge variant={merchantData.is_completed_profile ? 'default' : 'secondary'}>
                {merchantData.is_completed_profile ? 'Complete' : 'Incomplete'}
              </Badge>
            </div>

            <div className="p-4 border rounded-lg bg-blue-50">
              <h4 className="font-medium text-blue-900 mb-2">Account Health Score</h4>
              <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <p className="text-sm text-blue-700">25% Complete - Complete verification to improve account security</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

  )
}

export default VerificationSection
