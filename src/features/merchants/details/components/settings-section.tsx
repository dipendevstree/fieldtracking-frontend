

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Globe,
  Mail,
  Settings,
  User
} from 'lucide-react';
import { formatDate } from '../utils/common-function';
import { InfoItem } from './info-item';


interface MerchantData {
  user_id: string;
  fcm?: string;
  support_email: string;
  created_at: string;
  updated_at: string;
  otp_sent_time?: string;
  invoice_no_ncf: string;
  invoice_with_ncf: string;
  payment_no_ncf: string;
  payment_with_ncf: string;
}

const SettingsSection = ({ merchantData }: { merchantData: MerchantData }) => {
  return (
    <div className='space-y-6'>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={User}
              label="User ID"
              value={merchantData.user_id}
            />
            <InfoItem
              icon={Globe}
              label="Login Type"
              value="normal"
            />
            <InfoItem
              icon={Settings}
              label="FCM Token"
              value={merchantData.fcm || 'Not set'}
            />
            <InfoItem
              icon={Mail}
              label="Support Email"
              value={merchantData.support_email}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Account Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={Calendar}
              label="Created At"
              value={formatDate(merchantData.created_at)}
            />
            <InfoItem
              icon={Calendar}
              label="Last Updated"
              value={formatDate(merchantData.updated_at)}
            />
            <InfoItem
              icon={Clock}
              label="OTP Sent Time"
              value={merchantData.otp_sent_time || 'Never'}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Invoice & Payment Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <InfoItem
              icon={FileText}
              label="Invoice (No NCF)"
              value={merchantData.invoice_no_ncf}
            />
            <InfoItem
              icon={FileText}
              label="Invoice (With NCF)"
              value={merchantData.invoice_with_ncf}
            />
            <InfoItem
              icon={CreditCard}
              label="Payment (No NCF)"
              value={merchantData.payment_no_ncf}
            />
            <InfoItem
              icon={CreditCard}
              label="Payment (With NCF)"
              value={merchantData.payment_with_ncf}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsSection
