import { Card, CardContent} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
// import { useGetGeneralSettings, useGetCompanyInfo } from '../services/Generalhook'
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from '@/stores/use-auth-store'
import { useGetOrganizationTypes } from '@/features/auth/Admin-sign-up/services/sign-up-services'

interface GeneralApplicationSettingsProps {
  onDataChange?: (data: any) => void
}

export default function GeneralApplicationSettings({ onDataChange }: GeneralApplicationSettingsProps) {
  const { user } = useAuth()
  const [autoExpenseApproval, setAutoExpenseApproval] = useState(false)
  const [allowAddUsersBasedOnTerritories, setAllowAddUsersBasedOnTerritories] = useState(false)
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    industryId: "",   
    timezone: "",
    website: "",
    description: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    defaultCurrency: "",
    dateFormat: "",
    distanceUnit: "",
    ratePerKm: "30"
  })

  // Fetch organization types from API
  const { 
    data: orgTypeList, 
    isLoading: orgTypeLoading, 
    error: orgTypeError 
  } = useGetOrganizationTypes()

  // Debug log for organization types
  useEffect(() => {
    if (orgTypeList) {
      console.log('Organization types from API:', orgTypeList)
    }
  }, [orgTypeList])

  const isLoading = !user
  const hasError = false 

  // Update form data with organization data from user login
  useEffect(() => {
    console.log('User data changed in GeneralSetting:', user) // Debug log
    if (user?.organization) {
      const org = user.organization
      console.log('Organization data:', org) // Debug log
      const newFormData = {
        organizationName: org.organizationName || "",
        organizationType: org.organizationTypeId || "",
        industryId: org.industryId || "",
        timezone: org.time_zone || "",
        website: org.website || "",
        description: org.description || "",
        streetAddress: org.address || "",
        city: org.city || "",
        state: org.state || "",
        zipCode: org.zipCode || "",
        country: org.country || "",
        defaultCurrency: "inr", 
        dateFormat: "dd-mm-yyyy", 
        distanceUnit: "kilometers", 
        ratePerKm: org.rsPerKm?.toString() || ""
      }
      console.log('Form data being set:', newFormData)
      setFormData(newFormData)
      setAutoExpenseApproval(org.isAutoExpense || false)
      setAllowAddUsersBasedOnTerritories(org.allowAddUsersBasedOnTerritories || false)
    }
  }, [user]) // Removed refreshTrigger dependency

  // Notify parent component of data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        ...formData,
        autoExpenseApproval,
        allowAddUsersBasedOnTerritories
      })
    }
  }, [formData, autoExpenseApproval, allowAddUsersBasedOnTerritories, onDataChange])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">      
        <Card className="bg-white shadow-sm">
          <CardContent>
            <div className="space-y-6">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="space-y-6">      
        <Card className="bg-white shadow-sm">
          <CardContent>
            <div className="text-center py-8">
              <p className="text-red-500">Error loading settings. Please try again.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">      
      <Card className="bg-white shadow-sm">
        <CardContent>

          {/* Company Information Section */}
          <div className="space-y-6 mb-10">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
             
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="company-name" className="text-sm font-medium text-gray-700">
                  Organization Name <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="company-name" 
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                  placeholder="Enter your organization name"
                  className="h-10"
                />
            </div>
              
            <div className="space-y-2">
                <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">
                  Default Timezone <span className="text-red-500">*</span>
                </Label>
                {/* Set form user system timezone */}
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => handleInputChange('timezone', value)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select your system timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Ideally, populate this list dynamically from user system or backend */}
                    <SelectItem value="Asia/Calcutta">Asia/Calcutta IST (+05:30)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (EST)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CST)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MST)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PST)</SelectItem>
                    <SelectItem value="Europe/London">GMT (London)</SelectItem>
                    <SelectItem value="Europe/Paris">CET (Paris)</SelectItem>
                    <SelectItem value="Asia/Tokyo">JST (Tokyo)</SelectItem>
                    <SelectItem value="Australia/Sydney">AEDT (Sydney)</SelectItem>
                  </SelectContent>
                </Select>
            </div>

              <div className="space-y-2">
                <Label htmlFor="org-type" className="text-sm font-medium text-gray-700">
                  Organization Type <span className="text-red-500">*</span>
                </Label>
                {orgTypeLoading ? (
                  <div className="text-gray-500 text-sm">Loading...</div>
                ) : orgTypeError ? (
                  <div className="text-red-500 text-sm">Failed to load organization types</div>
                ) : (
                  <Select
                    value={formData.organizationType}
                    onValueChange={(value) => handleInputChange('organizationType', value)}
                  >
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {orgTypeList?.map((type: any) => (
                        <SelectItem key={type.organizationTypeId || type.value || type.id} value={String(type.organizationTypeId || type.value || type.id)}>
                          {type.organizationTypeName || type.label || type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                  Website <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="website" 
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://your-website.com"
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Organization Description 
              </Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of your organization..."
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>

          <Separator className="my-8" />

          {/* Address Information Section */}
          <div className="space-y-6 mb-10">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="street-address" className="text-sm font-medium text-gray-700">
                  Street Address <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="street-address"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  placeholder="Enter street address"
                  className="h-10"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city name"
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                    State/Province <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Enter state or province"
                    className="h-10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                  <Label htmlFor="zip-code" className="text-sm font-medium text-gray-700">
                    ZIP/Postal Code <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="zip-code"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="Enter ZIP or postal code"
                    className="h-10"
                  />
            </div>
                
            <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Enter country name"
                    className="h-10"
                  />
                </div>
            </div>
          </div>
        </div>

          <Separator className="my-8" />

          {/* Allow to add Users based on Territories Section */}
          <div className="flex items-center justify-between">
              <div className="space-y-3">
                <Label className="text-lg font-medium text-gray-900">Allow to add Users based on Territories</Label>
              </div>
              <Switch 
                id="territory-users" 
                checked={allowAddUsersBasedOnTerritories}
                onCheckedChange={setAllowAddUsersBasedOnTerritories}
              />
            </div>

            <Separator className="my-6"/>

          {/* Auto-Expense Approval Section */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-lg font-medium text-gray-900">Auto-Expense Approval</Label>
                <p className="text-sm text-gray-600">
                  {autoExpenseApproval 
                    ? 'Automatically approve expenses (Rate per KM is required)' 
                    : 'Manually approve expenses'
                  }
                </p>
              </div>
              <Switch 
                id="auto-expense" 
                checked={autoExpenseApproval}
                onCheckedChange={setAutoExpenseApproval}
              />
            </div>
            
            {autoExpenseApproval && (
              <div className="space-y-2 mt-4">
                <Label htmlFor="rate-per-km" className="text-sm font-medium text-gray-700">
                  Rate Per KM (₹) <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="rate-per-km" 
                  value={formData.ratePerKm}
                  onChange={(e) => handleInputChange('ratePerKm', e.target.value)}
                  placeholder="30"
                  className="w-32 h-10" 
                  type="number" 
                />
          </div>
            )}
        </div>
      </CardContent>
    </Card>
    </div>
  )
}