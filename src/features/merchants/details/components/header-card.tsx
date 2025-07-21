import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getOnlineStatusColor, getStatusColor } from "../utils/common-function"

interface MerchantData {
  profile_pic: string;
  name: string;
  user_name: string;
  merchant_id: string;
  is_online: boolean;
  status: boolean;
  role: {
    name: string;
  };
}

const HeaderCardInfo = ({ merchantData }: { merchantData: MerchantData }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={merchantData.profile_pic} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                  {merchantData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getOnlineStatusColor(merchantData.is_online)}`}></div>
            </div>
            <div>
              <CardTitle className="text-2xl">{merchantData.name}</CardTitle>
              <CardDescription className="text-lg">@{merchantData.user_name}</CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">ID: {merchantData.merchant_id}</Badge>
                <Badge className={getStatusColor(merchantData.status)}>
                  {merchantData.status ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="secondary">{merchantData.role.name}</Badge>
              </div>
            </div>
          </div>
          {/* <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Store
            </Button>
          </div> */}
        </div>
      </CardHeader>
    </Card>
  )
}

export default HeaderCardInfo
