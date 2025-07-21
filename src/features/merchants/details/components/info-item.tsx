import { Badge } from "@/components/ui/badge";

export const InfoItem = ({ icon: Icon, label, value, verified = false }: { icon: React.ElementType, label: string, value?: string, verified?: boolean }) => (
  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
    <Icon className="h-5 w-5 text-gray-600" />
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-600">{value || 'Not provided'}</p>
    </div>
    {verified !== null && (
      <Badge variant={verified ? 'default' : 'secondary'}>
        {verified ? 'Verified' : 'Unverified'}
      </Badge>
    )}
  </div>
);
