import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building, Camera, Edit, Facebook, FileText, Globe, Hash, Instagram, Link, MapPin, MessageCircle, Palette, Shield, Store, Tag, Twitter } from "lucide-react";
import { InfoItem } from "./info-item";


interface BusinessData {
  industry_type?: string;
  doing_business_as?: string;
  nif?: string;
  reg_dgii?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  online_store_url?: string;
  online_store_location?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  whatsapp?: string;
}

const BusinessSection = ({ data }: { data: BusinessData }) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="h-5 w-5 mr-2" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={Building}
              label="Industry Type"
              value={data?.industry_type}
            />
            <InfoItem
              icon={Tag}
              label="Doing Business As"
              value={data?.doing_business_as}
            />
            <InfoItem
              icon={FileText}
              label="NIF"
              value={data?.nif}
            />
            <InfoItem
              icon={Shield}
              label="REG DGII"
              value={data?.reg_dgii}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={MapPin}
              label="Address"
              value={data?.address}
            />
            <InfoItem
              icon={Building}
              label="City"
              value={data?.city}
            />
            <InfoItem
              icon={MapPin}
              label="State"
              value={data?.state}
            />
            <InfoItem
              icon={Hash}
              label="ZIP Code"
              value={data?.zip_code}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Online Presence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <InfoItem
              icon={Link}
              label="Online Store URL"
              value={data?.online_store_url}
            />
            <InfoItem
              icon={MapPin}
              label="Store Location"
              value={data?.online_store_location}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem
              icon={Instagram}
              label="Instagram"
              value={data?.instagram}
            />
            <InfoItem
              icon={Facebook}
              label="Facebook"
              value={data?.facebook}
            />
            <InfoItem
              icon={Twitter}
              label="Twitter"
              value={data?.twitter}
            />
            <InfoItem
              icon={MessageCircle}
              label="WhatsApp"
              value={data?.whatsapp}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Branding & Assets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium">Logo Image</p>
              <p className="text-xs text-gray-500">Not uploaded</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Edit className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium">Signature</p>
              <p className="text-xs text-gray-500">Not uploaded</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Palette className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium">Store Theme</p>
              <p className="text-xs text-gray-500">Not set</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BusinessSection
